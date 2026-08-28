// Surfex Website Interactivity

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initTabs();
  initOsDetection();
  initCopyButtons();
  initQrModal();
  fetchLatestRelease();
});

// Mobile menu toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer on clicking links
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close other items
      faqItems.forEach(other => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// Download Page Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-${target}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

// Auto detect OS for Downloads
function initOsDetection() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  const ua = navigator.userAgent.toLowerCase();
  let detected = 'windows';

  if (ua.includes('android')) {
    detected = 'android';
  } else if (ua.includes('mac') || ua.includes('darwin')) {
    detected = 'macos';
  } else if (ua.includes('linux')) {
    detected = 'linux';
  } else if (ua.includes('win')) {
    detected = 'windows';
  }

  const targetBtn = document.querySelector(`.tab-btn[data-tab="${detected}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
}

// Copy to clipboard with Toast
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard!`);
      }).catch(() => {
        showToast(`Copied to clipboard!`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// QR Code Modal
function initQrModal() {
  const modal = document.getElementById('qrModal');
  const modalImg = document.getElementById('modalQrImg');
  const modalTitle = document.getElementById('modalQrTitle');
  if (!modal || !modalImg) return;

  document.querySelectorAll('.qr-preview').forEach(preview => {
    preview.addEventListener('click', () => {
      const src = preview.querySelector('img')?.src;
      const title = preview.dataset.title || 'Donation QR';
      if (src) {
        modalImg.src = src;
        if (modalTitle) modalTitle.textContent = title;
        modal.classList.add('show');
      }
    });
  });

  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
}

// Fetch Latest Release Assets from GitHub API
async function fetchLatestRelease() {
  const releaseBadge = document.getElementById('latestReleaseVersion');
  if (!releaseBadge) return;

  try {
    const res = await fetch('https://api.github.com/repos/smartworldarafath/Surfex---Movies-and-Series/releases/latest');
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();

    if (data.tag_name) {
      releaseBadge.textContent = data.tag_name;
    }
  } catch (err) {
    releaseBadge.textContent = 'v0.4.0';
  }
}
