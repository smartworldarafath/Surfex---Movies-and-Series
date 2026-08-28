<script setup lang="ts">
import {
  mdiAlertCircleOutline,
  mdiAndroid,
  mdiApple,
  mdiCheckCircleOutline,
  mdiDownload,
  mdiLinux,
  mdiMicrosoftWindows,
  mdiOpenInNew,
  mdiRefresh,
  mdiRestart,
  mdiTrayArrowDown,
  mdiUpdate,
} from '@mdi/js'
import { formatBytes, RELEASES_URL } from '~/utils/updates'

const updates = useUpdatesStore()
const platform = ref('')

onMounted(async () => {
  try {
    platform.value = useTauriOsPlatform()
  }
  catch {
    platform.value = isAndroidPlatform() ? 'android' : 'desktop'
  }
  // Trigger update check on mount
  if (!updates.release) {
    await updates.check()
  }
})

const platformName = computed(() => {
  if (platform.value === 'android' || updates.isAndroid) return 'Android'
  if (platform.value === 'windows' || updates.isWindows) return 'Windows'
  if (platform.value === 'macos' || platform.value === 'darwin' || updates.isMac) return 'macOS'
  if (platform.value === 'linux' || updates.isLinux) return 'Linux'
  return platform.value || 'Universal'
})

const platformIcon = computed(() => {
  if (platform.value === 'android' || updates.isAndroid) return mdiAndroid
  if (platform.value === 'windows' || updates.isWindows) return mdiMicrosoftWindows
  if (platform.value === 'macos' || platform.value === 'darwin' || updates.isMac) return mdiApple
  if (platform.value === 'linux' || updates.isLinux) return mdiLinux
  return mdiUpdate
})

const percentText = computed(() => {
  return Math.round(updates.progress * 100)
})

const sizeText = computed(() => {
  if (!updates.totalBytes) return ''
  return `${formatBytes(updates.downloadedBytes)} / ${formatBytes(updates.totalBytes)}`
})

const speedText = computed(() => {
  if (!updates.speed || updates.speed <= 0) return ''
  return `${formatBytes(updates.speed)}/s`
})

function openUrl(url: string) {
  useTauriShellOpen(url).catch(() => window.open(url, '_blank'))
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-220">
    <!-- Header banner -->
    <div class="relative overflow-hidden rounded-2xl bg-surface-container/60 p-6 backdrop-blur-md border border-outline-variant/30">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <v-icon :icon="mdiUpdate" size="32" />
            <span
              v-if="updates.available"
              class="absolute -top-1 -right-1 flex size-4 items-center justify-center"
            >
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span class="relative inline-flex size-3 rounded-full bg-primary" />
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-title-large font-bold tracking-tight">
                {{ $t('Surfex Updates') }}
              </h2>
              <v-chip size="small" variant="tonal" color="primary" class="font-semibold">
                v{{ updates.current || '0.1.0' }}
              </v-chip>
              <v-chip size="small" variant="outlined" class="opacity-80">
                <v-icon :icon="platformIcon" start size="16" />
                {{ platformName }}
              </v-chip>
            </div>
            <p class="text-body-medium opacity-70 mt-1">
              {{ $t('Manage app releases, automatic updates, and downloads from GitHub.') }}
            </p>
          </div>
        </div>

        <v-btn
          :prepend-icon="mdiRefresh"
          :loading="updates.status === 'checking'"
          variant="tonal"
          color="primary"
          rounded="lg"
          @click="updates.check(true)"
        >
          {{ $t('Check for Updates') }}
        </v-btn>
      </div>
    </div>

    <!-- Active Update Available Card -->
    <template v-if="updates.available">
      <div class="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-surface-container/80 to-surface-container/40 p-6 border border-primary/30 shadow-lg">
        <div class="flex flex-col gap-4">
          <!-- Update Header -->
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="size-3 rounded-full bg-primary animate-pulse" />
              <div>
                <div class="text-title-medium font-bold text-primary">
                  {{ $t('New Version Available: v{version}', { version: updates.available.version }) }}
                </div>
                <div v-if="updates.available.publishedAt" class="text-body-small opacity-60">
                  {{ $t('Released: {date}', { date: new Date(updates.available.publishedAt).toLocaleDateString() }) }}
                </div>
              </div>
            </div>

            <v-chip
              v-if="updates.platformAsset"
              size="small"
              color="primary"
              variant="flat"
              class="font-mono text-xs"
            >
              {{ updates.platformAsset.name }}
            </v-chip>
          </div>

          <!-- Release Notes -->
          <div v-if="updates.available.notes" class="flex flex-col gap-2">
            <div class="text-label-large font-medium opacity-90">
              {{ $t('What\'s New in this Release') }}
            </div>
            <pre class="text-body-small max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-surface-container-lowest/70 p-4 font-sans border border-outline-variant/20 leading-relaxed">{{ updates.available.notes }}</pre>
          </div>

          <!-- Download Progress with Pure Animation -->
          <div
            v-if="updates.status === 'downloading' || updates.status === 'installing'"
            class="flex flex-col gap-3 rounded-xl bg-surface-container-lowest/80 p-5 border border-primary/20"
          >
            <div class="flex items-center justify-between text-body-medium">
              <span class="flex items-center gap-2 font-medium">
                <v-icon :icon="mdiTrayArrowDown" class="animate-bounce text-primary" size="20" />
                {{ updates.status === 'installing' ? $t('Preparing installation...') : $t('Downloading update...') }}
              </span>
              <span class="font-mono font-bold text-primary text-lg">
                {{ percentText }}%
              </span>
            </div>

            <!-- Custom Animated Progress Bar -->
            <div class="relative h-3 w-full overflow-hidden rounded-full bg-surface-container-high/60">
              <div
                class="h-full rounded-full transition-all duration-300 ease-out update-progress-bar"
                :style="{ width: `${updates.progress * 100}%` }"
              />
            </div>

            <div class="flex items-center justify-between text-body-small opacity-75 font-mono">
              <span>{{ sizeText }}</span>
              <span>{{ speedText }}</span>
            </div>
          </div>

          <!-- Error Alert -->
          <v-alert
            v-if="updates.status === 'failed'"
            type="error"
            variant="tonal"
            rounded="lg"
            class="my-1"
          >
            <div class="text-body-medium">
              {{ updates.error || $t('The update couldn\'t be downloaded automatically.') }}
            </div>
          </v-alert>

          <!-- Ready to Restart Banner -->
          <v-alert
            v-if="updates.status === 'ready'"
            type="success"
            variant="tonal"
            rounded="lg"
            class="my-1"
          >
            <div class="text-body-medium">
              {{ $t('Update has been downloaded successfully! Restart Surfex to complete the upgrade.') }}
            </div>
          </v-alert>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <!-- Ready Restart -->
            <v-btn
              v-if="updates.status === 'ready'"
              :prepend-icon="mdiRestart"
              variant="flat"
              color="primary"
              size="large"
              rounded="lg"
              class="font-bold shadow-md hover:scale-102 transition-transform"
              @click="updates.restart()"
            >
              {{ $t('Restart & Update Now') }}
            </v-btn>

            <!-- Install / Download Action -->
            <v-btn
              v-else-if="updates.status !== 'downloading' && updates.status !== 'installing'"
              :prepend-icon="mdiUpdate"
              variant="flat"
              color="primary"
              size="large"
              rounded="lg"
              class="font-bold shadow-md hover:scale-102 transition-transform"
              @click="updates.install()"
            >
              {{ updates.isAndroid ? $t('Download & Install APK') : $t('Download & Update') }}
            </v-btn>

            <!-- Direct Platform Download button -->
            <v-btn
              v-if="updates.platformAsset || updates.available.apk"
              :prepend-icon="mdiDownload"
              variant="tonal"
              size="large"
              rounded="lg"
              @click="openUrl(updates.platformAsset?.browser_download_url || updates.available.apk || updates.available.url)"
            >
              {{ $t('Direct Download ({platform})', { platform: platformName }) }}
            </v-btn>

            <!-- GitHub Release Page Link -->
            <v-btn
              :prepend-icon="mdiOpenInNew"
              variant="text"
              rounded="lg"
              @click="openUrl(updates.available.url)"
            >
              {{ $t('View on GitHub') }}
            </v-btn>

            <v-btn
              v-if="!['downloading', 'ready', 'installing'].includes(updates.status) && !updates.dismissed"
              variant="text"
              rounded="lg"
              class="opacity-60"
              @click="updates.dismiss()"
            >
              {{ $t('Remind Me Later') }}
            </v-btn>
          </div>
        </div>
      </div>
    </template>

    <!-- Up To Date State -->
    <template v-else>
      <div class="flex flex-col items-center justify-center gap-4 rounded-2xl bg-surface-container/40 p-10 text-center border border-outline-variant/20">
        <div class="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <v-icon :icon="mdiCheckCircleOutline" size="36" />
        </div>
        <div>
          <h3 class="text-title-medium font-bold">
            {{ $t('Surfex is Up to Date') }}
          </h3>
          <p class="text-body-medium opacity-70 mt-1 max-w-100 mx-auto">
            {{ $t('You are running the latest version of Surfex (v{version}).', { version: updates.current || '0.1.0' }) }}
          </p>
        </div>

        <div class="flex items-center gap-3 mt-2">
          <v-btn
            :prepend-icon="mdiRefresh"
            :loading="updates.status === 'checking'"
            variant="tonal"
            color="primary"
            rounded="lg"
            @click="updates.check(true)"
          >
            {{ $t('Check Again') }}
          </v-btn>
          <v-btn
            :prepend-icon="mdiOpenInNew"
            variant="outlined"
            rounded="lg"
            @click="openUrl(RELEASES_URL)"
          >
            {{ $t('All GitHub Releases') }}
          </v-btn>
        </div>
      </div>
    </template>

    <!-- Platform Specific Update Details -->
    <settings-section :title="$t('Platform & Update Details')">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Platform card -->
        <div class="flex flex-col gap-2 rounded-xl bg-surface-container/30 p-4 border border-outline-variant/20">
          <div class="flex items-center gap-2 font-semibold">
            <v-icon :icon="platformIcon" color="primary" />
            <span>{{ $t('Target Platform') }}</span>
          </div>
          <p class="text-body-small opacity-70">
            {{ $t('Running on {platform}. Updates are automatically tailored for this system.', { platform: platformName }) }}
          </p>
        </div>

        <!-- Repository card -->
        <div class="flex flex-col gap-2 rounded-xl bg-surface-container/30 p-4 border border-outline-variant/20">
          <div class="flex items-center gap-2 font-semibold">
            <v-icon :icon="mdiOpenInNew" color="primary" />
            <span>{{ $t('Official Repository') }}</span>
          </div>
          <p class="text-body-small opacity-70 font-mono break-all">
            smartworldarafath/Surfex---Movies-and-Series
          </p>
        </div>
      </div>
    </settings-section>
  </div>
</template>

<style scoped>
.update-progress-bar {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-tertiary)));
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
