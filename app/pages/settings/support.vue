<script setup lang="ts">
import {
  mdiCheck,
  mdiContentCopy,
  mdiGithub,
  mdiHeart,
  mdiOpenInNew,
} from '@mdi/js'

const copiedKey = ref('')

function copyText(text: string, key: string) {
  navigator.clipboard.writeText(text).then(() => {
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) {
        copiedKey.value = ''
      }
    }, 2500)
  })
}

function openUrl(url: string) {
  useTauriShellOpen(url).catch(() => window.open(url, '_blank'))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <settings-section
      :title="$t('Support Surfex')"
      :hint="$t('Surfex is a completely free, open-source Movies & Series player developed without any ads, subscriptions, or trackers.')"
    >
      <v-card rounded="xl" class="panel flex flex-col gap-4 p-6 bg-surface-container/40">
        <div class="flex items-center gap-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <v-icon :icon="mdiHeart" size="28" color="primary" />
          </div>
          <div>
            <div class="text-title-medium font-bold">
              {{ $t('Donate to Support Development') }}
            </div>
            <div class="text-body-small opacity-70">
              {{ $t('If you enjoy using Surfex, consider making a donation to help fund ongoing development and server costs.') }}
            </div>
          </div>
        </div>
      </v-card>
    </settings-section>

    <!-- Donation Methods Grid -->
    <settings-section :title="$t('Donation Methods')">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- nSave Card -->
        <v-card rounded="2xl" class="panel flex flex-col justify-between p-5 border border-surface-container-highest/40 bg-surface-container/30">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-title-medium font-bold text-red-500">nSave</span>
              <v-chip size="x-small" color="red" variant="flat">
                {{ $t('Instant Zero Fees') }}
              </v-chip>
            </div>
            <p class="text-body-small opacity-70">
              {{ $t('Send instant payments directly to nSave account with zero fees.') }}
            </p>

            <div class="my-2 flex justify-center">
              <div class="rounded-xl bg-white p-2 shadow-md">
                <img
                  src="/donations/nsave-qr.jpg"
                  alt="nSave QR Code"
                  class="size-44 object-contain rounded-lg"
                >
              </div>
            </div>

            <div class="rounded-lg bg-surface-container-high/60 p-3 text-body-small">
              <div class="flex items-center justify-between">
                <span class="opacity-60">{{ $t('Name') }}:</span>
                <span class="font-semibold">Md Arafath Rahman</span>
              </div>
              <div class="mt-1 flex items-center justify-between">
                <span class="opacity-60">{{ $t('nTag') }}:</span>
                <span class="font-mono font-bold text-red-400">@arafath_rahman9</span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <v-btn
              color="red"
              variant="tonal"
              rounded="lg"
              class="flex-1"
              :prepend-icon="mdiOpenInNew"
              @click="openUrl('https://web.nsave.com/app?path=accounts%3Fntag%3Darafath_rahman9')"
            >
              {{ $t('Open in nSave') }}
            </v-btn>
            <v-btn
              variant="tonal"
              rounded="lg"
              :prepend-icon="copiedKey === 'nsave' ? mdiCheck : mdiContentCopy"
              @click="copyText('@arafath_rahman9', 'nsave')"
            >
              {{ copiedKey === 'nsave' ? $t('Copied!') : $t('Copy Tag') }}
            </v-btn>
          </div>
        </v-card>

        <!-- Payoneer Card -->
        <v-card rounded="2xl" class="panel flex flex-col justify-between p-5 border border-surface-container-highest/40 bg-surface-container/30">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-title-medium font-bold text-amber-500">Payoneer</span>
              <v-chip size="x-small" color="warning" variant="flat">
                {{ $t('Global Transfer') }}
              </v-chip>
            </div>
            <p class="text-body-small opacity-70">
              {{ $t('Send direct Payoneer payments using email or Customer ID.') }}
            </p>

            <div class="my-2 flex justify-center">
              <div class="rounded-xl bg-surface-container-highest/50 p-2 shadow-md">
                <img
                  src="/donations/payoneer.jpg"
                  alt="Payoneer Account"
                  class="h-44 w-auto object-contain rounded-lg"
                >
              </div>
            </div>

            <div class="rounded-lg bg-surface-container-high/60 p-3 text-body-small">
              <div class="flex items-center justify-between">
                <span class="opacity-60">{{ $t('Name') }}:</span>
                <span class="font-semibold">Arafath Rahman</span>
              </div>
              <div class="mt-1 flex items-center justify-between">
                <span class="opacity-60">{{ $t('Email') }}:</span>
                <span class="font-mono font-semibold">arafathrahman710@gmail.com</span>
              </div>
              <div class="mt-1 flex items-center justify-between">
                <span class="opacity-60">{{ $t('Customer ID') }}:</span>
                <span class="font-mono font-semibold">70366820</span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <v-btn
              color="warning"
              variant="tonal"
              rounded="lg"
              class="flex-1"
              :prepend-icon="copiedKey === 'payoneer-email' ? mdiCheck : mdiContentCopy"
              @click="copyText('arafathrahman710@gmail.com', 'payoneer-email')"
            >
              {{ copiedKey === 'payoneer-email' ? $t('Email Copied!') : $t('Copy Email') }}
            </v-btn>
            <v-btn
              variant="tonal"
              rounded="lg"
              :prepend-icon="copiedKey === 'payoneer-id' ? mdiCheck : mdiContentCopy"
              @click="copyText('70366820', 'payoneer-id')"
            >
              {{ copiedKey === 'payoneer-id' ? $t('ID Copied!') : $t('Copy ID') }}
            </v-btn>
          </div>
        </v-card>

        <!-- RedotPay Card -->
        <v-card rounded="2xl" class="panel flex flex-col justify-between p-5 border border-surface-container-highest/40 bg-surface-container/30">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-title-medium font-bold text-red-400">RedotPay</span>
              <v-chip size="x-small" color="error" variant="flat">
                {{ $t('Crypto & Card') }}
              </v-chip>
            </div>
            <p class="text-body-small opacity-70">
              {{ $t('Scan QR with RedotPay app or pay via RedotPay ID.') }}
            </p>

            <div class="my-2 flex justify-center">
              <div class="rounded-xl bg-surface-container-highest/50 p-2 shadow-md">
                <img
                  src="/donations/redotpay-qr.jpg"
                  alt="RedotPay QR Code"
                  class="size-44 object-contain rounded-lg"
                >
              </div>
            </div>

            <div class="rounded-lg bg-surface-container-high/60 p-3 text-body-small">
              <div class="flex items-center justify-between">
                <span class="opacity-60">{{ $t('RedotPay ID') }}:</span>
                <span class="font-mono font-bold text-red-400">1965421414</span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <v-btn
              color="error"
              variant="tonal"
              rounded="lg"
              class="flex-1"
              :prepend-icon="copiedKey === 'redotpay' ? mdiCheck : mdiContentCopy"
              @click="copyText('1965421414', 'redotpay')"
            >
              {{ copiedKey === 'redotpay' ? $t('Copied!') : $t('Copy RedotPay ID') }}
            </v-btn>
          </div>
        </v-card>
      </div>
    </settings-section>

    <!-- GitHub Project Section -->
    <settings-section :title="$t('Open Source')">
      <div class="flex items-center justify-between gap-4 flex-wrap rounded-xl bg-surface-container/40 p-5">
        <div class="flex items-center gap-3">
          <v-icon :icon="mdiGithub" size="36" />
          <div>
            <div class="text-title-medium font-bold">
              {{ $t('The project on GitHub') }}
            </div>
            <div class="text-body-small opacity-70">
              smartworldarafath/Surfex---Movies-and-Series
            </div>
          </div>
        </div>

        <v-btn
          :prepend-icon="mdiOpenInNew"
          variant="tonal"
          color="primary"
          rounded="lg"
          @click="openUrl('https://github.com/smartworldarafath/Surfex---Movies-and-Series')"
        >
          {{ $t('Visit GitHub Repo') }}
        </v-btn>
      </div>
    </settings-section>
  </div>
</template>
