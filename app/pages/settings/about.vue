<script setup lang="ts">
import { mdiOpenInNew, mdiRestart, mdiTrayArrowDown, mdiUpdate } from '@mdi/js'
import { DOWNLOAD_URL } from '~/utils/updates'

const settings = useSettingsStore()
const updates = useUpdatesStore()
const platform = ref('')

onMounted(() => {
  try {
    platform.value = useTauriOsPlatform()
  }
  catch {
    platform.value = isAndroidPlatform() ? 'android' : 'desktop'
  }
})

const credits = computed(() => [
  { title: 'mpv', text: $t('The player itself — decoding, subtitles and audio. GPLv2 or later.'), url: 'https://mpv.io' },
  { title: 'librqbit', text: $t('The torrent engine, embedded in the app. MIT licensed.'), url: 'https://github.com/ikatson/rqbit' },
  { title: 'OpenSubtitles', text: $t('Subtitles, reached through public addons Stremio operates.'), url: 'https://www.opensubtitles.org' },
])

function open(url: string) {
  useTauriShellOpen(url).catch(() => window.open(url, '_blank'))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <settings-section title="Surfex">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Surfex" class="size-16 rounded-2xl shadow-md">
        <div>
          <div class="text-title-medium font-bold">
            {{ $t('Version {version}', { version: updates.current || '0.1.0' }) }}
          </div>
          <div class="text-body-small opacity-70">
            {{ $t('Surfex — Movies and Series player, media library, on desktop and Android TV.') }}
            <template v-if="platform">
              · {{ platform }}
            </template>
          </div>
        </div>
      </div>
    </settings-section>

    <settings-section :title="$t('Updates')">
      <div class="flex items-center justify-between gap-4 flex-wrap rounded-xl bg-surface-container/40 p-4">
        <div>
          <p class="text-body-medium font-medium">
            <template v-if="updates.available">
              {{ $t('Surfex {version} is available', { version: updates.available.version }) }}
            </template>
            <template v-else>
              {{ $t('Surfex is up to date (v{version})', { version: updates.current || '0.1.0' }) }}
            </template>
          </p>
          <p class="text-body-small opacity-70">
            {{ $t('Automatic updates from smartworldarafath/Surfex---Movies-and-Series.') }}
          </p>
        </div>

        <v-btn
          :prepend-icon="mdiUpdate"
          variant="tonal"
          color="primary"
          rounded="lg"
          :to="localePath('/settings/updates')"
        >
          {{ $t('Open Updates Manager') }}
        </v-btn>
      </div>
    </settings-section>

    <settings-section :title="$t('Film and TV data')">
      <img src="/tmdb.svg" alt="The Movie Database" class="h-5 w-auto self-start">
      <p class="text-body-medium">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p class="text-body-small opacity-70">
        {{ $t('Every poster, backdrop, cast list, rating and synopsis in the app comes from The Movie Database.') }}
      </p>
      <div>
        <v-btn :append-icon="mdiOpenInNew" variant="tonal" size="small" @click="open('https://www.themoviedb.org')">
          themoviedb.org
        </v-btn>
      </div>

      <v-text-field
        v-model.trim="settings.tmdbKey"
        :label="$t('Your own TMDB read token')"
        :placeholder="$t('Leave empty to use the built-in one')"
        variant="solo-filled"
        density="comfortable"
        rounded="lg"
        flat
        autocomplete="off"
        spellcheck="false"
        :hint="$t('Only needed if the app stops loading artwork and titles. Create one free under your TMDB account settings, API, “API Read Access Token”. It is kept out of backup files.')"
        persistent-hint
      />
    </settings-section>

    <settings-section :title="$t('Built on')">
      <v-list bg-color="transparent" class="rounded-lg bg-surface-container/40">
        <v-list-item
          v-for="item in credits"
          :key="item.title"
          :title="item.title"
          :subtitle="item.text"
          :append-icon="mdiOpenInNew"
          @click="open(item.url)"
        />
      </v-list>
    </settings-section>

    <settings-section :title="$t('Legal')">
      <p class="text-body-medium">
        {{ $t('Surfex hosts no content, indexes no content, and ships with no sources configured. It is a BitTorrent client with a player attached: it fetches only what you point it at, from servers you added yourself.') }}
      </p>
      <p class="text-body-small opacity-70">
        {{ $t('Copyright in what you play is unaffected by the tool you play it with. Whether you have the right to download a given title is yours to answer, under the law where you are. Reports about a source belong with whoever operates it — the project has no control over, and no relationship with, any of them.') }}
      </p>
      <p class="text-body-small opacity-70">
        {{ $t('Surfex is MIT licensed. The components it is built on keep their own terms, listed above; on Windows the bundled mpv is GPL software and its licence and offer of source sit next to the application\'s executable.') }}
      </p>
    </settings-section>
  </div>
</template>
