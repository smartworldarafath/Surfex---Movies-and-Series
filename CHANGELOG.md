# Surfex - Releases & Changelog

All notable releases for **Surfex - Movies and Series** are documented below.

## Surfex v0.1.0 (2026-08-02)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.1.0.apk | Native Android APK installer |
| **Windows** | Surfex_0.1.0_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.1.0_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.1.0_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

First release

---

## Surfex v0.1.1 (2026-08-17)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.1.1.apk | Native Android APK installer |
| **Windows** | Surfex_0.1.1_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.1.1_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.1.1_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

- User supplied TMDB token
- theme from art flash fix

---

## Surfex v0.2.0 (2026-08-18)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.2.0.apk | Native Android APK installer |
| **Windows** | Surfex_0.2.0_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.2.0_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.2.0_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

## In-app updates

Surfex now tells you when a new version is out — a badge in the toolbar, and the
details under **Settings → About**.

Where the app installed itself, it can update itself: the AppImage, the Windows
`.exe` and `.msi`, and the macOS `.app` download and install in one click. Where
something else owns the files — a `.deb`, an `.rpm`, the AUR, Nix — it says so
and links the release instead, because overwriting files your package manager is
keeping track of does more harm than an out-of-date app. Android links the APK.

Every update is signed, and a bundle that didn't come out of this repo's release
workflow is refused.

**This one has to be installed by hand.** 0.1.1 shipped without an updater, so
there's nothing in it to notice 0.2.0. From this version on it's automatic.

## Season progress

Season cards now show how far into a season you are, and a tick once it's
finished. The eye button marks a whole season watched or unwatched without
opening it — and if you mark a later season, it offers to catch the earlier ones
up.

## Also

- macOS: the README now documents the `xattr` command for the *"Surfex is
  damaged and can't be opened"* message. Nothing is damaged — that is what
  Gatekeeper says about any app without a €99/year Apple certificate.

---

## Surfex v0.2.1 (2026-08-18)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.2.1.apk | Native Android APK installer |
| **Windows** | Surfex_0.2.1_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.2.1_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.2.1_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

Updated home screen

---

## Surfex v0.2.2 (2026-08-20)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.2.2.apk | Native Android APK installer |
| **Windows** | Surfex_0.2.2_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.2.2_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.2.2_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

## A white screen now explains itself

Surfex's interface is one JavaScript bundle, and a webview too old to read it
paints nothing at all - so on some Android TV boxes the app opened to a blank
screen with nothing to go on (#5).

This release adds a diagnostics screen that runs *before* the app does, written
in the oldest JavaScript there is so that it still works where the app doesn't.
When Surfex fails to start you now get:

- the version of Android System WebView the device has, and whether it is new
  enough — Surfex needs Chrome 111 or newer
- which of the features it relies on are missing, each with the version that
  added it
- whatever error actually stopped it, with the file and the line

It stays out of the way otherwise: it only appears when nothing has been drawn,
and takes itself back down if a slow device catches up. The arrow keys scroll
it, so it can be read from a remote.

This doesn't make an old webview any newer. It replaces a blank screen with an
answer — **if Surfex opens to nothing on your device, install this version and
photograph what it says.** That is the whole bug report.

## Also

- A permanent APK link. `releases/latest/download/Surfex.apk` always points at
  the newest build, for sideloading with Downloader on a television.

---

## Surfex v0.2.3 (2026-08-22)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.2.3.apk | Native Android APK installer |
| **Windows** | Surfex_0.2.3_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.2.3_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.2.3_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

## Subtitle auto-sync, rewritten

It used to match the cues against raw loudness, so a door slam outranked a
spoken line and the subtitles drifted towards the music. It now matches on
speech — how far the audio sits above the room, normalised per film.

- Accepts a fit only when it clearly beats every other one, instead of guessing.
- Lands inside 40 ms, and the delay reads to two decimals.
- Searches ±3 minutes (was ±90 s), and falls back to listening to the whole film
  when the last twenty minutes aren't conclusive.
- When it still can't tell, it offers its best guess as one button instead of
  giving up.
- Still fixes 23.976 / 24 / 25 fps mismatches, now only when it's sure.

## Player

- Subtitles lift above the control bar whenever the chrome is up, not just when
  a panel is open.
- Real tooltips on the player buttons — and mpv no longer paints over them.
- The volume knob stays inside the rail at 100 %.
- YouTube trailers scale correctly at any UI scale.

## Library

- Favourites, Watchlist and History now filter by title, sort by recency, title,
  year or rating, and split into All / Movies / TV / Anime.
- The controls bar measures its own width instead of trusting a breakpoint, so
  filters stop crowding each other at mid widths.

## Fixes

- Roboto actually ships now — the desktop builds had been falling back to the
  system sans-serif.
- A missing appindicator library no longer takes the whole app down at startup.

---

## Surfex v0.3.0 (2026-08-24)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.3.0.apk | Native Android APK installer |
| **Windows** | Surfex_0.3.0_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.3.0_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.3.0_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

### The app speaks 72 languages

Surfex is now translated. Pick a language under **Settings → Language** — the
list is searchable, sorted in your own alphabet, and each entry carries its
flag. The choice is remembered and applied without a reload.

It goes past the interface:

- **Film and show data comes back in your language.** Titles, overviews and
  season names are requested from TMDB in the language you picked, falling back
  to English field by field where TMDB has nothing.
- **Subtitle language names are localised too**, so a Slovenian UI lists
  *slovenščina*, not *Slovenian*.
- Vuetify's own component labels (dialog buttons, pagination, date pickers) are
  translated in all 72, including the 33 Vuetify itself doesn't ship.
- An unfinished translation renders as English line by line rather than showing
  a placeholder, so nothing is ever blank while a language is being filled in.

Right-to-left languages (Arabic, Hebrew, Persian, Urdu) lay out correctly.

### Settings is now navigable

Every settings section is a real page. **Back** walks through them the way you
expect, a reload comes back to the section you had open, and Appearance's three
tabs are proper tabs instead of a segmented control. Long sections scroll
properly on TV and on phones.

### Fixes

- **App scale now uses the webview's native zoom** where the platform supports
  it — sharper text at any scale, and the mpv window is placed by measuring the
  real pixel ratio instead of inferring it, so the video no longer lands
  slightly off its box at scales other than 100%.
- The whole app type-checks clean (`bun run check:types`), with new checks
  guarding the translation catalogs (`bun run check:i18n`).
- Assorted layout and focus fixes across settings, the torrent picker and the
  downloads list.

---

## Surfex v0.4.0 (2026-08-26)

### Release Assets & Packages

| Platform | Package Name | Details |
| :--- | :--- | :--- |
| **Android (Phone & TV)** | Surfex.apk / Surfex_v0.4.0.apk | Native Android APK installer |
| **Windows** | Surfex_0.4.0_x64-setup.exe / .msi | Windows 64-bit installer |
| **Linux** | Surfex_0.4.0_amd64.AppImage / .deb / .rpm | Linux AppImage and package formats |
| **macOS** | Surfex_0.4.0_aarch64.dmg / .app | Apple Silicon build with bundled libmpv |

### Release Notes

## Surfex 0.4.0

**Updating on Android is now one tap.** Settings → About checks for a new
version, downloads the APK and hands it straight to Android's own installer —
no browser, no file manager, no hunting for the right build. Your library and
settings are kept, as always.

### Remote control
The d-pad got a big pass over it:

- Settings tabs are reachable again — Appearance could never get to Background
  or Display.
- The player's subtitle and track menus now keep focus, scroll to their last
  row, and close on BACK like any dialog.
- BACK at the home screen backgrounds the app instead of killing it, which is
  what made reopening Surfex crash on some TVs.
- Predictive back (Android 13+) is handled properly, so BACK stops walking
  backwards through pages you never visited.

### New

- **Next episode.** When an episode ends, the next one is one press away — or
  rolls in by itself after 10 seconds, with the countdown on the button so you
  can stop it.
- **Automatic subtitles.** Pick a language once and every film opens with it on.
  Changing language while watching updates the setting too.
- **Hide sound descriptions** — drops "(electricity buzzing)" and "MAN:" from
  subtitles written for the hard of hearing.
- **Show progress that means something.** A series card now shows how far
  through the *show* you are, not the last file, and names the episode you'd
  carry on with.
- **Flags in the language picker**, and a lot more of the app translated.
- **Settings → Support** — the  supporters list, read live.
- Desktop windows reopen at the size and position you left them.
- A filter box in the torrent picker.

### Fixes

- No more white or dark flashes while the app starts, on Windows and Android.
- Poster cards no longer flicker or go blank while scrolling.
- If the app ever fails to start, it now says why on screen instead of showing
  a black rectangle.
- Various speed-ups on the browse and library pages.

---

