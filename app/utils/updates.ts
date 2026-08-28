/**
 * Surfex Update Manager & GitHub Release Integration
 *
 * Repository: https://github.com/smartworldarafath/Surfex---Movies-and-Series
 *
 * Fetches latest release metadata directly from GitHub API and matches
 * the appropriate binary / installer for the user's current platform:
 * - Android: .apk
 * - Windows: .msi / .exe / setup installer
 * - macOS: .dmg / .app
 * - Linux: .AppImage / .deb
 */

export const REPO = 'smartworldarafath/Surfex---Movies-and-Series'
export const RELEASES_URL = `https://github.com/${REPO}/releases`
export const LATEST_RELEASE_URL = `https://github.com/${REPO}/releases/latest`
export const DOWNLOAD_URL = LATEST_RELEASE_URL
export const APK_URL = `https://github.com/${REPO}/releases/latest/download/Surfex.apk`

const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`
const ALL_RELEASES_API_URL = `https://api.github.com/repos/${REPO}/releases`

export interface ReleaseAsset {
  name: string
  size: number
  browser_download_url: string
  content_type: string
}

export interface Update {
  /** No leading `v` — comparable with what `getVersion()` returns */
  version: string
  name: string
  publishedAt: string
  /** The release body, formatted markdown / text */
  notes: string
  /** The release page */
  url: string
  /** Platform-specific assets */
  apk: string
  windows: string
  macos: string
  linux: string
  assets: ReleaseAsset[]
}

/**
 * Semver ordering: negative when `a` is older, positive when it is newer.
 */
export function compareVersions(a: string, b: string): number {
  const parse = (v: string) => {
    const [core = '', pre = ''] = v.trim().replace(/^v/, '').split('+')[0]!.split(/-(.*)/)
    return { core: core.split('.').map(Number), pre: pre ? pre.split('.') : [] }
  }
  const x = parse(a)
  const y = parse(b)

  for (let i = 0; i < 3; i++) {
    const d = (x.core[i] ?? 0) - (y.core[i] ?? 0)
    if (d)
      return d
  }

  if (!x.pre.length || !y.pre.length)
    return (y.pre.length ? 1 : 0) - (x.pre.length ? 1 : 0)

  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const p = x.pre[i]
    const q = y.pre[i]
    if (p === undefined || q === undefined)
      return p === undefined ? -1 : 1
    const [n, m] = [Number(p), Number(q)]
    if (Number.isNaN(n) !== Number.isNaN(m))
      return Number.isNaN(n) ? 1 : -1
    if (!Number.isNaN(n) && n !== m)
      return n - m
    if (p !== q)
      return p < q ? -1 : 1
  }
  return 0
}

/** Is `latest` worth telling the user about, given they are running `current`? */
export function isNewer(current: string, latest: string) {
  if (!current || !latest)
    return false
  return compareVersions(latest, current) > 0
}

/**
 * Parses a GitHub release API object into a typed `Update` structure
 */
export function parseUpdate(data: unknown): Update | null {
  const r = data as {
    tag_name?: string
    name?: string
    published_at?: string
    body?: string
    html_url?: string
    draft?: boolean
    prerelease?: boolean
    assets?: {
      name?: string
      size?: number
      browser_download_url?: string
      content_type?: string
    }[]
  } | null

  const version = r?.tag_name?.trim().replace(/^v/, '') ?? ''
  if (!r || !version || r.draft || r.prerelease)
    return null

  const assets: ReleaseAsset[] = (r.assets || []).map(a => ({
    name: a.name || '',
    size: a.size || 0,
    browser_download_url: a.browser_download_url || '',
    content_type: a.content_type || '',
  }))

  const apk = assets.find(a => a.name.endsWith('.apk'))?.browser_download_url || ''
  const windows = assets.find(a => a.name.endsWith('.msi') || a.name.endsWith('.exe'))?.browser_download_url || ''
  const macos = assets.find(a => a.name.endsWith('.dmg') || a.name.endsWith('.app.tar.gz'))?.browser_download_url || ''
  const linux = assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.endsWith('.rpm'))?.browser_download_url || ''

  return {
    version,
    name: r.name || `Surfex v${version}`,
    publishedAt: r.published_at || '',
    notes: r.body?.trim() ?? '',
    url: r.html_url || RELEASES_URL,
    apk,
    windows,
    macos,
    linux,
    assets,
  }
}

/**
 * Ask GitHub for the latest release.
 */
export async function latestUpdate(): Promise<Update | null> {
  try {
    const data = await $fetch(API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      timeout: 10_000,
      retry: 0,
    })
    return parseUpdate(data)
  }
  catch {
    // If latest release gives 404 or fails, try all releases list
    try {
      const releases = await $fetch<unknown[]>(ALL_RELEASES_API_URL, {
        headers: { Accept: 'application/vnd.github+json' },
        timeout: 10_000,
        retry: 0,
      })
      if (Array.isArray(releases) && releases.length > 0) {
        for (const rel of releases) {
          const parsed = parseUpdate(rel)
          if (parsed) return parsed
        }
      }
    }
    catch {}
    return null
  }
}

/**
 * Format bytes into human-readable string (e.g., 42.5 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
