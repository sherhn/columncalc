/**
 * cookie-consent.js
 * Баннер согласия на использование куки-файлов (152-ФЗ).
 *
 * Логика повторного показа:
 *   - Согласие:  переспрашивать через 45 дней.
 *   - Отказ:     переспрашивать через 5 дней.
 */

const STORAGE_KEY     = 'mc_cookie_consent';
const TIMESTAMP_KEY   = 'mc_cookie_consent_at';
const STYLE_ID        = 'mc-consent-style';
const BANNER_ID       = 'mc-consent-banner';
const OVERLAY_ID      = 'mc-consent-overlay';

const DAYS_ACCEPTED = 45;
const DAYS_DECLINED =  5;

let _grantCallbacks = [];

// ─── Публичный API ────────────────────────────────────────────────────────────

export function initConsent() {
  const stored    = localStorage.getItem(STORAGE_KEY);
  const savedAt   = Number(localStorage.getItem(TIMESTAMP_KEY) || 0);
  const elapsed   = Date.now() - savedAt;

  if (stored === 'accepted') {
    if (elapsed < DAYS_ACCEPTED * 864e5) {
      _fireCallbacks();   // срок не истёк – грузим РСЯ сразу
      return;
    }
    // срок истёк – сбрасываем и показываем баннер заново
    _clearStorage();
  }

  if (stored === 'declined') {
    if (elapsed < DAYS_DECLINED * 864e5) return;  // срок не истёк – молчим
    _clearStorage();                               // срок истёк – покажем снова
  }

  _injectStyles();
  _renderBanner();
}

export function onConsentGranted(callback) {
  if (typeof callback === 'function') _grantCallbacks.push(callback);
}

// ─── Внутренние функции ───────────────────────────────────────────────────────

function _fireCallbacks() {
  _grantCallbacks.forEach(fn => { try { fn(); } catch (e) {} });
  _grantCallbacks = [];
}

function _clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
}

function _accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  localStorage.setItem(TIMESTAMP_KEY, Date.now());
  _removeBanner();
  _fireCallbacks();
}

function _decline() {
  localStorage.setItem(STORAGE_KEY, 'declined');
  localStorage.setItem(TIMESTAMP_KEY, Date.now());
  _removeBanner();
}

function _removeBanner() {
  const banner  = document.getElementById(BANNER_ID);
  const overlay = document.getElementById(OVERLAY_ID);
  if (banner)  { banner.style.transform = 'translateY(110%)'; banner.style.opacity = '0'; setTimeout(() => banner.remove(), 300); }
  if (overlay) { overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 300); }
}

function _renderBanner() {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9998;
    background:rgba(0,0,0,0.38);
    opacity:0;transition:opacity 0.3s ease;
    pointer-events:none;
  `;
  document.body.appendChild(overlay);

  const banner = document.createElement('div');
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-label', 'Уведомление об использовании куки-файлов');

  banner.innerHTML = `
    <div class="mc-cb-top-bar"></div>
    <div class="mc-cb-inner">
      <div class="mc-cb-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" fill="currentColor"/>
        </svg>
      </div>
      <div class="mc-cb-body">
        <div class="mc-cb-title">Этот сайт использует куки-файлы</div>
        <div class="mc-cb-text">
          Рекламная система Яндекс (РСЯ) использует куки-файлы для показа объявлений.
          Реклама позволяет поддерживать сайт бесплатным для всех пользователей.
          Подробнее – в <a href="privacy.html" class="mc-cb-link">Политике конфиденциальности</a>.
        </div>
      </div>
      <div class="mc-cb-actions">
        <button id="mc-cb-accept" class="mc-cb-btn mc-cb-btn--primary">Принять и продолжить</button>
        <button id="mc-cb-decline" class="mc-cb-btn mc-cb-btn--secondary">Отказаться</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('mc-cb-accept').addEventListener('click', _accept);
  document.getElementById('mc-cb-decline').addEventListener('click', _decline);

  setTimeout(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity  = '1';
      banner.style.transform = 'translateY(0)';
      banner.style.opacity   = '1';
    });
  }, 400);
}

function _injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${BANNER_ID} {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      background: #ffffff;
      box-shadow: 0 -4px 32px rgba(0,0,0,0.18), 0 -1px 0 #e0ddd8;
      transform: translateY(110%);
      opacity: 0;
      transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
    }
    .mc-cb-top-bar { height: 3px; background: #2563eb; }
    .mc-cb-inner {
      max-width: 1060px; margin: 0 auto;
      padding: 20px 24px;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    }
    .mc-cb-icon { color: #2563eb; flex-shrink: 0; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
    .mc-cb-icon svg { width: 26px; height: 26px; }
    .mc-cb-body { flex: 1; min-width: 240px; }
    .mc-cb-title { font-size: .9rem; font-weight: 600; color: #1a1a18; margin-bottom: 4px; letter-spacing: -.01em; }
    .mc-cb-text  { font-size: .78rem; line-height: 1.6; color: #7a7872; }
    .mc-cb-link  { color: #2563eb; text-decoration: none; border-bottom: 1px solid rgba(37,99,235,0.3); }
    .mc-cb-link:hover { border-bottom-color: #2563eb; }
    .mc-cb-actions { display: flex; flex-direction: column; gap: 7px; flex-shrink: 0; align-items: stretch; min-width: 190px; }
    .mc-cb-btn { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-weight: 500; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: background 0.13s, opacity 0.13s; text-align: center; white-space: nowrap; }
    .mc-cb-btn--primary  { font-size: .88rem; padding: 11px 20px; background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,0.35); }
    .mc-cb-btn--primary:hover  { background: #1d4ed8; box-shadow: 0 3px 12px rgba(37,99,235,0.45); }
    .mc-cb-btn--primary:active { background: #1e40af; box-shadow: none; }
    .mc-cb-btn--secondary { font-size: .72rem; padding: 5px 10px; background: transparent; color: #c8c5bf; border-color: transparent; }
    .mc-cb-btn--secondary:hover { color: #7a7872; }
    @media (max-width: 620px) {
      .mc-cb-inner { flex-direction: column; align-items: flex-start; padding: 18px 16px 20px; gap: 14px; }
      .mc-cb-actions { width: 100%; min-width: 0; flex-direction: row; align-items: center; gap: 12px; }
      .mc-cb-btn--primary { flex: 1; }
    }
  `;

  document.head.appendChild(style);
}