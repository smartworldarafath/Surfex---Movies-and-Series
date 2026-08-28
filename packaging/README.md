# Packaging

Two distribution channels live here, both free. Neither needs a certificate:
Linux package managers verify by hash and by who pushed the commit, so nothing
in this directory costs money.

| | Who reviews it | How long | What you have to keep doing |
|---|---|---|---|
| [AUR](#aur) | Nobody | Minutes | Nothing — CI pushes each release |
| [Flathub](#flathub) | A human, once | Days to a few weeks | Regenerate sources per release, open a PR |

---

## AUR

`surfex-bin` repackages the `.deb` from the GitHub release. It does not build
from source: that would compile the whole Rust tree *and* run a Nuxt build on
every user's machine for bytes that already exist.

It also deliberately does not repackage the AppImage. The AppImage runtime sets
`$APPIMAGE`, and that variable is what tells `can_self_update` in
`src-tauri/src/lib.rs` that this copy may overwrite its own binary — which under
a package manager is a file `pacman` owns. Unpacked from the `.deb` there is no
bundle type, so the app defers to `pacman` and the update panel says so.

### One-time setup

1. **Make an AUR account** at <https://aur.archlinux.org/register>. Email and a
   username; there is no review and no fee.
2. **Upload an SSH public key** under *My Account → SSH Public Key*. Make a
   dedicated one rather than reusing your GitHub key:
   ```sh
   ssh-keygen -t ed25519 -f ~/.ssh/aur -C "aur@surfex" -N ""
   cat ~/.ssh/aur.pub     # paste this into the AUR account page
   ```
3. **Create the package** by pushing it once by hand. The AUR has no "new
   package" button — a push to a repo that does not exist creates it, and the
   name you push claims the name:
   ```sh
   GIT_SSH_COMMAND="ssh -i ~/.ssh/aur" git clone ssh://aur@aur.archlinux.org/surfex-bin.git
   cp packaging/aur/PKGBUILD packaging/aur/.SRCINFO surfex-bin/
   cd surfex-bin
   git add PKGBUILD .SRCINFO
   git commit -m "Initial import"
   GIT_SSH_COMMAND="ssh -i ~/.ssh/aur" git push -u origin master
   ```
   It is live the moment that push lands.
4. **Add two repository secrets** on GitHub so releases publish themselves:
   - `AUR_SSH_KEY` — the contents of `~/.ssh/aur` (the private half)
   - `AUR_USERNAME` — your AUR account name

From then on `.github/workflows/aur.yml` runs whenever a release is
**published** (not when the tag is pushed — release.yml leaves a draft, and a
draft's asset URLs 404). It rewrites `pkgver` and both hashes from the actual
release assets, regenerates `.SRCINFO` in a throwaway Arch container, and
pushes.

---

## Flathub

Flathub builds from source on its own machines, **with no network access**, so
every crate and every npm package has to be declared up front with a hash. That
is what `generate-sources.sh` produces.

The app id is `io.github.smartworldarafath.Surfex`.

### One-time setup

1. **A GitHub account is all you need.** Flathub logs in with it; there is no
   separate registration and no fee.
2. **Build it locally first.**
   ```sh
   sudo pacman -S flatpak flatpak-builder          # or apt/dnf install
   flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo
   flatpak install --user flathub org.gnome.Platform//50 org.gnome.Sdk//50 \
       org.freedesktop.Sdk.Extension.node22//25.08 org.freedesktop.Sdk.Extension.rust-stable//25.08

   TMDB_API=<the read token> ./packaging/flatpak/generate-sources.sh v0.1.0
   flatpak-builder --force-clean --user --install builddir \
       packaging/flatpak/generated/io.github.smartworldarafath.Surfex.yml
   flatpak run io.github.smartworldarafath.Surfex
   ```
3. **Submit.** Fork <https://github.com/flathub/flathub>, make a branch **named
   exactly `io.github.smartworldarafath.Surfex`** off `new-pr`, put the seven generated files at the repo root, and open a PR
   against the `new-pr` branch.

4. Once merged you get push access to a `flathub/io.github.smartworldarafath.Surfex` repo.
   Add a **`FLATHUB_TOKEN`** repository secret here — a PAT with push access to
   that repo — and releases publish themselves from then on.
