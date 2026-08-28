import type { ReleaseAsset, Update } from '~/utils/updates'
import { invoke } from '@tauri-apps/api/core'
import { APK_URL, isNewer, latestUpdate } from '~/utils/updates'

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'installing' | 'failed' | 'up_to_date'

export interface DownloadProgressInfo {
  percent: number
  downloadedBytes: number
  totalBytes: number
  speedBytesPerSec: number
}

/**
 * Surfex In-App Updates Store
 *
 * Checks https://github.com/smartworldarafath/Surfex---Movies-and-Series/releases
 * Handles Android APK installation, Desktop (Windows, macOS, Linux) updater plugin,
 * and direct platform asset download handlers.
 */
export const useUpdatesStore = defineStore('updates', () => {
  /** The running version. Defaults to v0.1.0 if not yet determined. */
  const current = ref('0.1.0')
  const release = ref<Update | null>(null)
  const capable = ref(false)
  const status = ref<UpdateStatus>('idle')
  const error = ref('')
  /** 0–1 while downloading */
  const progress = ref(0)
  const downloadedBytes = ref(0)
  const totalBytes = ref(0)
  const speed = ref(0)
  const lastCheckedAt = ref<number | null>(null)

  const skipped = useLocalStorage('surfex.updateSkipped', '')

  const available = computed(() =>
    release.value && isNewer(current.value, release.value.version) ? release.value : null)

  const isUpToDate = computed(() =>
    !available.value && !!release.value && !!current.value && !isNewer(current.value, release.value.version))

  /** Android installer capability */
  const apk = computed(() => canInstallApk())

  /** Platform detection */
  const isAndroid = computed(() => isAndroidPlatform())
  const isWindows = computed(() => isWindowsPlatform())
  const isMac = computed(() => isMacPlatform())
  const isLinux = computed(() => isLinuxPlatform())

  /** Can this copy automatically install or update */
  const canUpdate = computed(() => capable.value || apk.value)

  const dismissed = computed(() => !!available.value && available.value.version === skipped.value)

  /** Target asset matching user's current platform */
  const platformAsset = computed<ReleaseAsset | null>(() => {
    if (!release.value || !release.value.assets.length) return null
    const assets = release.value.assets
    if (isAndroid.value) {
      return assets.find(a => a.name.endsWith('.apk')) || null
    }
    if (isWindows.value) {
      return assets.find(a => a.name.endsWith('.msi') || a.name.endsWith('.exe')) || null
    }
    if (isMac.value) {
      return assets.find(a => a.name.endsWith('.dmg') || a.name.endsWith('.app.tar.gz')) || null
    }
    if (isLinux.value) {
      return assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.endsWith('.rpm')) || null
    }
    return assets[0] || null
  })

  function dismiss() {
    skipped.value = available.value?.version ?? ''
  }

  /**
   * Check for updates on GitHub
   */
  async function check(manual = false) {
    if (status.value === 'downloading' || status.value === 'ready' || status.value === 'installing')
      return

    status.value = 'checking'
    error.value = ''

    try {
      const ver = await useTauriAppGetVersion().catch(() => '')
      if (ver) current.value = ver.replace(/^v/, '')
      capable.value = await invoke<boolean>('can_self_update').catch(() => false)
      const latest = await latestUpdate()
      release.value = latest
      lastCheckedAt.value = Date.now()

      if (latest && isNewer(current.value, latest.version)) {
        status.value = 'idle'
      }
      else if (manual) {
        status.value = 'up_to_date'
      }
      else {
        status.value = 'idle'
      }
    }
    catch (e) {
      status.value = manual ? 'failed' : 'idle'
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  /**
   * Download and install the update with real-time animated progress
   */
  async function install() {
    if (!available.value)
      return

    if (apk.value || isAndroid.value)
      return installUpdateApk()

    if (!capable.value) {
      // Fallback: if not self-updating via Tauri, open direct asset link
      const target = platformAsset.value?.browser_download_url || available.value.url
      window.open(target, '_blank')
      return
    }

    status.value = 'downloading'
    progress.value = 0
    downloadedBytes.value = 0
    totalBytes.value = 0
    speed.value = 0
    error.value = ''

    try {
      const update = await useTauriUpdaterCheck()
      if (!update)
        throw new Error($t('The release carries no update for this platform.'))

      let lastTime = Date.now()
      let lastDone = 0

      await update.downloadAndInstall(event => {
        if (event.event === 'Started') {
          totalBytes.value = event.data.contentLength ?? 0
          lastTime = Date.now()
        }
        else if (event.event === 'Progress') {
          downloadedBytes.value += event.data.chunkLength
          if (totalBytes.value > 0) {
            progress.value = Math.min(1, downloadedBytes.value / totalBytes.value)
          }
          const now = Date.now()
          const diffMs = now - lastTime
          if (diffMs >= 500) {
            const bytesDiff = downloadedBytes.value - lastDone
            speed.value = (bytesDiff / diffMs) * 1000
            lastTime = now
            lastDone = downloadedBytes.value
          }
        }
        else if (event.event === 'Finished') {
          progress.value = 1
          downloadedBytes.value = totalBytes.value
        }
      })
      status.value = 'ready'
    }
    catch (e) {
      status.value = 'failed'
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  /**
   * Android APK updater with animated progress polling
   */
  async function installUpdateApk() {
    status.value = 'downloading'
    progress.value = 0
    downloadedBytes.value = 0
    totalBytes.value = platformAsset.value?.size || 0
    error.value = ''

    const downloadUrl = available.value?.apk || platformAsset.value?.browser_download_url || APK_URL
    const problem = installApk(downloadUrl)

    if (problem) {
      status.value = 'failed'
      error.value = problem === 'permission'
        ? $t('Android needs your permission to install apps from Surfex. Turn it on, then press Update again.')
        : $t('The download couldn\'t be started.')
      return
    }

    await new Promise<void>(resolve => {
      let lastProgress = 0
      let lastTime = Date.now()

      const timer = setInterval(() => {
        const state = apkProgress()
        const currentProgress = state.progress ?? 0
        progress.value = currentProgress

        if (totalBytes.value > 0) {
          downloadedBytes.value = Math.round(currentProgress * totalBytes.value)
        }

        const now = Date.now()
        const diffMs = now - lastTime
        if (diffMs >= 1000 && totalBytes.value > 0) {
          const progDiff = currentProgress - lastProgress
          speed.value = Math.max(0, (progDiff * totalBytes.value) / (diffMs / 1000))
          lastTime = now
          lastProgress = currentProgress
        }

        if (state.status === 'downloading')
          return

        clearInterval(timer)
        if (state.status === 'installing') {
          status.value = 'installing'
          progress.value = 1
        }
        else {
          status.value = 'failed'
          error.value = $t('The download didn\'t finish.')
        }
        resolve()
      }, 500)
    })
  }

  const restart = () => useTauriProcessRelaunch()

  return {
    current,
    release,
    capable,
    apk,
    canUpdate,
    isAndroid,
    isWindows,
    isMac,
    isLinux,
    platformAsset,
    status,
    error,
    progress,
    downloadedBytes,
    totalBytes,
    speed,
    lastCheckedAt,
    available,
    isUpToDate,
    dismissed,
    dismiss,
    check,
    install,
    restart,
  }
})

