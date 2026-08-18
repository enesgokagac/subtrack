'use strict';

const STORAGE_KEY = 'subtrack_v2_data';
const BUDGETS_KEY = 'subtrack_v2_budgets';
const SETTINGS_KEY = 'subtrack_v2_settings';
const FIRST_VISIT_KEY = 'subtrack_v2_first';

const POPULAR_SERVICES = [
  { name: 'Netflix', emoji: '🎬', category: 'eğlence', color: '#ef4444', amount: 7.99, currency: 'USD' },
  { name: 'Spotify', emoji: '🎵', category: 'müzik', color: '#10b981', amount: 5.99, currency: 'USD' },
  { name: 'YouTube Premium', emoji: '▶️', category: 'eğlence', color: '#ef4444', amount: 7.99, currency: 'USD' },
  { name: 'ChatGPT Plus', emoji: '🤖', category: 'yapay zeka', color: '#10b981', amount: 20, currency: 'USD' },
  { name: 'Claude Pro', emoji: '🤖', category: 'yapay zeka', color: '#6366f1', amount: 20, currency: 'USD' },
  { name: 'Midjourney', emoji: '🖼️', category: 'yapay zeka', color: '#6366f1', amount: 10, currency: 'USD' },
  { name: 'GitHub Copilot', emoji: '💻', category: 'yazılım', color: '#8b5cf6', amount: 10, currency: 'USD' },
  { name: 'Adobe Creative Cloud', emoji: '🎨', category: 'yazılım', color: '#ef4444', amount: 54.99, currency: 'USD' },
  { name: 'Microsoft 365', emoji: '📊', category: 'yazılım', color: '#3b82f6', amount: 6.99, currency: 'USD' },
  { name: 'Notion', emoji: '📝', category: 'yazılım', color: '#1a1a2e', amount: 8, currency: 'USD' },
  { name: 'Figma', emoji: '🎨', category: 'yazılım', color: '#ec4899', amount: 12, currency: 'USD' },
  { name: 'Vercel Pro', emoji: '🚀', category: 'yazılım', color: '#1a1a2e', amount: 20, currency: 'USD' },
  { name: 'Linear', emoji: '📌', category: 'yazılım', color: '#6366f1', amount: 8, currency: 'USD' },
  { name: 'Zoom Pro', emoji: '📹', category: 'yazılım', color: '#3b82f6', amount: 14.99, currency: 'USD' },
  { name: 'Canva Pro', emoji: '✨', category: 'yazılım', color: '#ec4899', amount: 12.99, currency: 'USD' },
  { name: 'iCloud 200GB', emoji: '☁️', category: 'bulut', color: '#3b82f6', amount: 2.99, currency: 'USD' },
  { name: 'Google One', emoji: '☁️', category: 'bulut', color: '#f59e0b', amount: 2.99, currency: 'USD' },
  { name: 'Dropbox Plus', emoji: '📦', category: 'bulut', color: '#3b82f6', amount: 11.99, currency: 'USD' },
  { name: 'Disney+', emoji: '🏰', category: 'eğlence', color: '#3b82f6', amount: 7.99, currency: 'USD' },
  { name: 'Amazon Prime', emoji: '📦', category: 'eğlence', color: '#f59e0b', amount: 14.99, currency: 'USD' },
  { name: 'Apple TV+', emoji: '🍎', category: 'eğlence', color: '#94a3b8', amount: 9.99, currency: 'USD' },
  { name: 'Udemy', emoji: '📚', category: 'eğitim', color: '#a855f7', amount: 29.99, currency: 'USD' },
  { name: 'Duolingo Plus', emoji: '🦜', category: 'eğitim', color: '#10b981', amount: 6.99, currency: 'USD' },
  { name: 'Gym/Spor Salonu', emoji: '🏋️', category: 'spor', color: '#f59e0b', amount: 500, currency: 'TRY' },
];

const CATEGORY_ICONS = { 'eğlence':'🎬','müzik':'🎵','yazılım':'💻','yapay zeka':'🤖','spor':'🏋️','eğitim':'📚','bulut':'☁️','diğer':'📦' };
const CURRENCY_INFO = {
  USD:{ flag:'🇺🇸', name:'Amerikan Doları', symbol:'$' },
  EUR:{ flag:'🇪🇺', name:'Euro', symbol:'€' },
  GBP:{ flag:'🇬🇧', name:'İngiliz Sterlini', symbol:'£' },
  JPY:{ flag:'🇯🇵', name:'Japon Yeni', symbol:'¥' },
  TRY:{ flag:'🇹🇷', name:'Türk Lirası', symbol:'₺' },
};
const CHART_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#06b6d4','#f97316','#14b8a6'];

let subscriptions = [];
let budgets = {};
let settings = { alertDays: 3, theme: 'dark', view: 'grid', email: '' };
let tryRates = { USD:32.5, EUR:35.2, GBP:41.0, JPY:0.22, TRY:1 };
let analyticsMode = 'monthly';
let selectedColor = '#6366f1';
let deleteTargetId = null;
let charts = {};
let calendarDate = new Date();
let selectedCards = new Set();
let currentView = 'grid';

document.addEventListener('DOMContentLoaded', () => {
  loadAllData();
  applyTheme(settings.theme);
  setupNavigation();
  setupModal();
  setupSearch();
  setupKeyboardShortcuts();
  setupThemeToggle();
  fetchExchangeRates();
  setGreeting();
  checkBrowserNotifPermission();

  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== document.getElementById('sidebar-toggle')) {
        sidebar.classList.remove('open');
      }
    }

    if (!e.target.closest('.search-wrap')) {
      document.getElementById('global-search-results').classList.remove('visible');
    }
  });

  document.getElementById('notify-email').value = settings.email;
  document.getElementById('notify-email').addEventListener('change', (e) => {
    settings.email = e.target.value;
    saveSettings();
  });

  document.querySelectorAll('.day-btn').forEach(btn => {
    const days = parseInt(btn.textContent);
    btn.classList.toggle('active', days === settings.alertDays);
  });

  if (!localStorage.getItem(FIRST_VISIT_KEY)) {
    document.getElementById('onboarding-overlay').style.display = 'flex';
  }

  buildQuickServices();

  renderAll();
  renderReport();
});

function loadAllData() {
  try { subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { subscriptions = []; }
  try { budgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || '{}'); } catch { budgets = {}; }
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    settings = { ...settings, ...s };
  } catch {}
  currentView = settings.view || 'grid';
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions)); }
function saveBudgets() { localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets)); }
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

async function fetchExchangeRates() {
  try {
    const r = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
    if (!r.ok) throw new Error();
    const data = await r.json();
    ['USD','EUR','GBP','JPY'].forEach(c => {
      if (data.rates[c]) tryRates[c] = 1 / data.rates[c];
    });
    document.getElementById('usd-rate-badge').innerHTML = `<span>💱 USD: ₺${tryRates.USD.toFixed(2)}</span>`;
    document.getElementById('rates-last-updated').textContent = `Güncellendi: ${new Date().toLocaleTimeString('tr-TR')}`;
  } catch {
    document.getElementById('usd-rate-badge').innerHTML = `<span>💱 USD: ~₺${tryRates.USD.toFixed(2)}</span>`;
    document.getElementById('rates-last-updated').textContent = 'Tahmini kurlar';
  }
  renderRates();
  renderAll();
  convertCurrency();
}

function convertToTRY(amount, currency) {
  return currency === 'TRY' ? amount : amount * (tryRates[currency] || 1);
}
function formatTRY(n) { return '₺' + n.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function formatCurrency(n, cur) {
  const s = CURRENCY_INFO[cur]?.symbol || cur;
  return s + n.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function getMonthlyAmount(sub) {
  if (sub.period === 'yearly') return sub.amount / 12;
  if (sub.period === 'weekly') return sub.amount * 4.33;
  return sub.amount;
}
function getYearlyAmount(sub) {
  if (sub.period === 'yearly') return sub.amount;
  if (sub.period === 'weekly') return sub.amount * 52;
  return sub.amount * 12;
}
function getDaysUntilRenewal(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const r = new Date(dateStr); r.setHours(0,0,0,0);
  return Math.max(0, Math.round((r - today) / 86400000));
}
function getUpcomingRenewals(days) {
  return subscriptions
    .filter(s => s.status !== 'paused')
    .filter(s => { const d = getDaysUntilRenewal(s.renewalDate); return d >= 0 && d <= days; })
    .sort((a, b) => getDaysUntilRenewal(a.renewalDate) - getDaysUntilRenewal(b.renewalDate));
}

function renderAll() {
  renderDashboard();
  renderSubscriptions();
  renderAlerts();
  renderCalendar();
  renderReport();
  renderBudgetPage();
  updateNavCount();
}

function updateNavCount() {
  document.getElementById('nav-sub-count').textContent = subscriptions.length;
  const upcoming = getUpcomingRenewals(settings.alertDays);
  const badge = document.getElementById('alert-badge');
  badge.textContent = upcoming.length;
  badge.classList.toggle('visible', upcoming.length > 0);
}

function renderDashboard() {
  const active = subscriptions.filter(s => s.status !== 'paused');
  const monthly = active.reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
  const yearly = monthly * 12;
  const ghost = subscriptions.filter(s => s.status === 'ghost');
  const ghostTotal = ghost.reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
  const upcoming = getUpcomingRenewals(7);

  document.getElementById('stat-monthly').textContent = formatTRY(monthly);
  document.getElementById('stat-monthly-count').textContent = `${active.length} aktif abonelik`;
  document.getElementById('stat-yearly').textContent = formatTRY(yearly);
  document.getElementById('stat-ghost').textContent = formatTRY(ghostTotal);
  document.getElementById('stat-ghost-count').textContent = `${ghost.length} kullanılmayan`;
  document.getElementById('stat-upcoming-count').textContent = upcoming.length;
  document.getElementById('upcoming-count-badge').textContent = upcoming.length;

  const budgetKeys = Object.keys(budgets);
  const bmoDiv = document.getElementById('budget-overview-mini');
  const bmBars = document.getElementById('budget-mini-bars');
  if (budgetKeys.length > 0) {
    bmoDiv.style.display = 'block';
    bmBars.innerHTML = budgetKeys.slice(0, 3).map(cat => {
      const limit = budgets[cat];
      const spent = subscriptions
        .filter(s => s.status === 'active' && (cat === 'toplam' || s.category === cat))
        .reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
      const pct = Math.min(100, Math.round((spent / limit) * 100));
      const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
      const label = cat === 'toplam' ? '💰 Genel' : `${CATEGORY_ICONS[cat] || ''} ${cat}`;
      return `<div class="budget-mini-bar-wrap">
        <div class="bm-top">
          <span class="bm-name">${label}</span>
          <span class="bm-pct" style="color:${color}">${pct}% (${formatTRY(spent)} / ${formatTRY(limit)})</span>
        </div>
        <div class="bm-track"><div class="bm-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
    }).join('');
  } else {
    bmoDiv.style.display = 'none';
  }

  const upcomingList = document.getElementById('upcoming-list');
  if (upcoming.length === 0) {
    upcomingList.innerHTML = `<div class="empty-state"><span class="empty-icon">🎉</span><p>Önümüzdeki 7 günde yenileme yok!</p></div>`;
  } else {
    upcomingList.innerHTML = upcoming.map(s => {
      const days = getDaysUntilRenewal(s.renewalDate);
      const cls = days <= 1 ? 'days-urgent' : days <= 3 ? 'days-soon' : 'days-ok';
      const label = days === 0 ? 'Bugün!' : days === 1 ? 'Yarın' : `${days} gün`;
      const tryAmt = convertToTRY(getMonthlyAmount(s), s.currency);
      return `<div class="upcoming-item">
        <div class="upcoming-dot" style="background:${s.color}"></div>
        <div>
          <div class="upcoming-name">${escHtml(s.name)}</div>
          ${s.card ? `<div class="upcoming-card">💳 ${escHtml(s.card)}</div>` : ''}
        </div>
        <span class="upcoming-days ${cls}">${label}</span>
        <span class="upcoming-amount">${formatTRY(tryAmt)}</span>
      </div>`;
    }).join('');
  }

  const tipEl = document.getElementById('savings-tip');
  if (ghostTotal > 0) {
    tipEl.style.display = 'block';
    tipEl.innerHTML = `💡 <strong>Tasarruf İpucu:</strong> ${ghost.length} kullanılmayan aboneliğinizi iptal ederek aylık <strong>${formatTRY(ghostTotal)}</strong> (yıllık <strong>${formatTRY(ghostTotal * 12)}</strong>) tasarruf edebilirsiniz!`;
  } else {
    tipEl.style.display = 'none';
  }

  const dashGrid = document.getElementById('dashboard-sub-grid');
  const recent = [...subscriptions].reverse().slice(0, 8);
  if (recent.length === 0) {
    dashGrid.innerHTML = `<div class="empty-state large"><span class="empty-icon">📭</span><p>Henüz abonelik eklenmedi.</p><button class="btn-primary" onclick="document.getElementById('btn-open-modal').click()">İlk Aboneliği Ekle</button></div>`;
  } else {
    dashGrid.className = `sub-cards-grid ${currentView === 'list' ? 'list-view' : ''}`;
    dashGrid.innerHTML = recent.map(s => renderSubCard(s)).join('');
  }
}

function renderSubCard(s) {
  const monthlyTRY = convertToTRY(getMonthlyAmount(s), s.currency);
  const renewal = new Date(s.renewalDate).toLocaleDateString('tr-TR', {day:'numeric', month:'short', year:'numeric'});
  const days = getDaysUntilRenewal(s.renewalDate);
  const daysLabel = days === 0 ? '⚠️ Bugün' : days === 1 ? '⚠️ Yarın' : `${renewal}`;
  const statusClass = `status-${s.status}`;
  const statusText = s.status === 'active' ? '✅ Aktif' : s.status === 'ghost' ? '👻 Hayalet' : '⏸ Duraklatıldı';
  const icon = s.emoji || CATEGORY_ICONS[s.category] || '📦';
  const isSelected = selectedCards.has(s.id);
  const tryLine = s.currency !== 'TRY' ? `<div class="sub-card-price-try">≈ ${formatTRY(monthlyTRY)} / ay</div>` : '<div class="sub-card-price-try">&nbsp;</div>';
  const autoRenewTag = s.autoRenew === false ? '<span style="font-size:0.65rem;color:#f59e0b;margin-left:4px">⚠️ Manuel</span>' : '';

  return `<div class="sub-card${s.status === 'ghost' ? ' ghost-card' : ''}${isSelected ? ' selected-card' : ''}" style="--card-color:${s.color}" id="card-${s.id}">
    <div class="sub-card-top">
      <div class="sub-card-left">
        <input type="checkbox" class="sub-card-checkbox" ${isSelected ? 'checked' : ''} onclick="toggleSelect('${s.id}',this)" />
        <div class="sub-card-icon" style="background:${s.color}22">${icon}</div>
        <div>
          <div class="sub-card-name">${escHtml(s.name)}${autoRenewTag}</div>
          <div class="sub-card-category">${icon} ${s.category}</div>
        </div>
      </div>
      <div class="sub-card-actions">
        <button class="action-btn" onclick="openEditModal('${s.id}')" title="Düzenle">✏️</button>
        <button class="action-btn" onclick="quickPauseToggle('${s.id}')" title="${s.status === 'paused' ? 'Aktive et' : 'Duraklat'}">
          ${s.status === 'paused' ? '▶️' : '⏸'}
        </button>
        <button class="action-btn delete" onclick="confirmDelete('${s.id}')" title="Sil">🗑️</button>
      </div>
    </div>
    <div class="sub-card-price">${formatCurrency(s.amount, s.currency)}<span style="font-size:0.76rem;font-weight:500;color:var(--text-muted)"> / ${periodLabel(s.period)}</span></div>
    ${tryLine}
    ${s.card ? `<div class="sub-card-card-info">💳 ${escHtml(s.card)}</div>` : ''}
    ${s.note ? `<div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px;font-style:italic">${escHtml(s.note)}</div>` : ''}
    <div class="sub-card-footer">
      <span class="sub-card-renewal">🗓 ${days <= 1 ? `<strong style="color:#f87171">${daysLabel}</strong>` : daysLabel}</span>
      <span class="sub-card-status ${statusClass}">${statusText}</span>
    </div>
  </div>`;
}

function periodLabel(p) { return p === 'monthly' ? 'ay' : p === 'yearly' ? 'yıl' : 'hafta'; }

function quickPauseToggle(id) {
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) return;
  sub.status = sub.status === 'paused' ? 'active' : 'paused';
  saveData(); renderAll();
  showToast(sub.status === 'paused' ? `${sub.name} duraklatıldı` : `${sub.name} aktive edildi`, 'info');
}

function renderSubscriptions() {
  const grid = document.getElementById('subscriptions-grid');
  const q = (document.getElementById('search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('filter-category')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  const sortBy = document.getElementById('sort-by')?.value || 'name';

  let filtered = subscriptions.filter(s => {
    if (q && !s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
    if (cat && s.category !== cat) return false;
    if (status && s.status !== status) return false;
    return true;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'amount-desc': return convertToTRY(getMonthlyAmount(b), b.currency) - convertToTRY(getMonthlyAmount(a), a.currency);
      case 'amount-asc': return convertToTRY(getMonthlyAmount(a), a.currency) - convertToTRY(getMonthlyAmount(b), b.currency);
      case 'renewal': return new Date(a.renewalDate) - new Date(b.renewalDate);
      case 'created': return new Date(b.createdAt) - new Date(a.createdAt);
      default: return a.name.localeCompare(b.name, 'tr');
    }
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state large"><span class="empty-icon">${subscriptions.length === 0 ? '📭' : '🔍'}</span><p>${subscriptions.length === 0 ? 'Henüz abonelik eklenmedi.' : 'Arama sonucu yok.'}</p>${subscriptions.length === 0 ? `<button class="btn-primary" onclick="document.getElementById('btn-open-modal').click()">İlk Aboneliği Ekle</button>` : ''}</div>`;
    document.getElementById('sub-page-summary').textContent = '';
  } else {
    grid.className = `sub-cards-grid ${currentView === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = filtered.map(s => renderSubCard(s)).join('');

    const totalTRY = filtered.filter(s => s.status !== 'paused').reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
    document.getElementById('sub-page-summary').innerHTML = `
      <strong>${filtered.length}</strong> abonelik listeleniyor &nbsp;•&nbsp;
      Aylık toplam: <strong>${formatTRY(totalTRY)}</strong> &nbsp;•&nbsp;
      Yıllık: <strong>${formatTRY(totalTRY * 12)}</strong>
    `;
  }

  updateBulkBar();
}

function toggleSelect(id, cb) {
  if (cb.checked) selectedCards.add(id);
  else selectedCards.delete(id);
  updateBulkBar();
  document.querySelectorAll(`#card-${id}`).forEach(el => el.classList.toggle('selected-card', cb.checked));
}
function updateBulkBar() {
  const bar = document.getElementById('bulk-bar');
  const count = document.getElementById('bulk-count');
  if (selectedCards.size > 0) {
    bar.style.display = 'flex';
    count.textContent = `${selectedCards.size} seçili`;
  } else {
    bar.style.display = 'none';
  }
}
function clearSelection() { selectedCards.clear(); renderSubscriptions(); }
function bulkPause() {
  selectedCards.forEach(id => { const s = subscriptions.find(x => x.id === id); if (s) s.status = 'paused'; });
  saveData(); selectedCards.clear(); renderAll(); showToast(`${selectedCards.size || '+'} abonelik duraklatıldı`, 'info');
}
function bulkActivate() {
  selectedCards.forEach(id => { const s = subscriptions.find(x => x.id === id); if (s) s.status = 'active'; });
  saveData(); selectedCards.clear(); renderAll(); showToast('Abonelikler aktive edildi', 'success');
}
function bulkDelete() {
  if (!confirm(`${selectedCards.size} aboneliği silmek istediğinizden emin misiniz?`)) return;
  subscriptions = subscriptions.filter(s => !selectedCards.has(s.id));
  saveData(); selectedCards.clear(); renderAll(); showToast('Seçili abonelikler silindi', 'info');
}

function setView(v) {
  currentView = v;
  settings.view = v;
  saveSettings();
  document.getElementById('view-grid').classList.toggle('active', v === 'grid');
  document.getElementById('view-list').classList.toggle('active', v === 'list');
  renderSubscriptions();
  renderDashboard();
}

function renderAlerts() {
  const upcoming = getUpcomingRenewals(settings.alertDays);
  const badge = document.getElementById('alert-badge');
  badge.textContent = upcoming.length;
  badge.classList.toggle('visible', upcoming.length > 0);

  const alertsList = document.getElementById('alerts-list');
  if (upcoming.length === 0) {
    alertsList.innerHTML = `<div class="empty-state"><span class="empty-icon">✅</span><p>Aktif uyarı yok!</p></div>`;
  } else {
    alertsList.innerHTML = upcoming.map(s => {
      const days = getDaysUntilRenewal(s.renewalDate);
      const isUrgent = days <= 1;
      const tryAmt = convertToTRY(getMonthlyAmount(s), s.currency);
      return `<div class="alert-item ${isUrgent ? 'alert-urgent' : 'alert-warning'}">
        <div class="alert-icon">${isUrgent ? '🚨' : '⚠️'}</div>
        <div class="alert-content">
          <div class="alert-title">${escHtml(s.name)} yenileniyor!</div>
          <div class="alert-desc">${days === 0 ? 'Bugün' : days === 1 ? 'Yarın' : `${days} gün içinde`} • ${formatCurrency(s.amount, s.currency)} (≈ ${formatTRY(tryAmt)})${s.card ? ` • 💳 ${escHtml(s.card)}` : ''}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-secondary btn-sm" onclick="openEditModal('${s.id}')">✏️</button>
          <button class="btn-danger btn-sm" onclick="confirmDelete('${s.id}')">🗑</button>
        </div>
      </div>`;
    }).join('');
  }

  const ghostList = document.getElementById('ghost-list');
  const ghosts = subscriptions.filter(s => s.status === 'ghost');
  if (ghosts.length === 0) {
    ghostList.innerHTML = `<div class="empty-state"><span class="empty-icon">👻</span><p>Hayalet gider yok!</p></div>`;
  } else {
    ghostList.innerHTML = ghosts.map(s => {
      const monthlyTRY = convertToTRY(getMonthlyAmount(s), s.currency);
      return `<div class="alert-item" style="border-color:rgba(239,68,68,0.2)">
        <div class="alert-icon">👻</div>
        <div class="alert-content">
          <div class="alert-title">${escHtml(s.name)}</div>
          <div class="alert-desc">Aylık ${formatTRY(monthlyTRY)} • Yıllık ${formatTRY(monthlyTRY * 12)} boşa gidiyor</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-secondary btn-sm" onclick="reactivateSub('${s.id}')">▶️ Aktive Et</button>
          <button class="btn-danger btn-sm" onclick="confirmDelete('${s.id}')">🗑 İptal Et</button>
        </div>
      </div>`;
    }).join('');
  }
}

function reactivateSub(id) {
  const sub = subscriptions.find(s => s.id === id);
  if (sub) { sub.status = 'active'; saveData(); renderAll(); showToast(`${sub.name} aktive edildi!`, 'success'); }
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById('calendar-title').textContent =
    new Date(year, month, 1).toLocaleDateString('tr-TR', {month:'long', year:'numeric'});

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  const eventMap = {};
  subscriptions.forEach(s => {
    const d = new Date(s.renewalDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(s);
    }
  });

  let html = '';

  for (let i = startOffset - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${daysInPrevMonth - i}</div></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const isToday = thisDate.getTime() === today.getTime();
    const events = eventMap[d] || [];
    html += `<div class="cal-day${isToday ? ' today' : ''}${events.length > 0 ? ' has-events' : ''}">
      <div class="cal-day-num">${d}</div>
      ${events.slice(0, 3).map(s => `<div class="cal-event" style="background:${s.color}22;color:${s.color}" title="${escHtml(s.name)} – ${formatCurrency(s.amount, s.currency)}">${s.emoji || '💳'} ${escHtml(s.name.length > 8 ? s.name.slice(0,8)+'…' : s.name)}</div>`).join('')}
      ${events.length > 3 ? `<div style="font-size:0.6rem;color:var(--text-muted)">+${events.length - 3} daha</div>` : ''}
    </div>`;
  }

  const total = startOffset + daysInMonth;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${i}</div></div>`;
  }
  document.getElementById('calendar-grid').innerHTML = html;
}

function changeCalendarMonth(dir) {
  calendarDate.setMonth(calendarDate.getMonth() + dir);
  renderCalendar();
}
function goToday() { calendarDate = new Date(); renderCalendar(); }

function renderAnalytics() {
  destroyCharts();

  const catFilter = document.getElementById('analytics-category-filter')?.value || '';
  const subs = catFilter ? subscriptions.filter(s => s.category === catFilter) : subscriptions;
  const active = subs.filter(s => s.status !== 'paused');

  const totalMonthly = active.reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
  const totalYearly = active.reduce((s, sub) => s + convertToTRY(getYearlyAmount(sub), sub.currency), 0);
  const avgCost = active.length > 0 ? totalMonthly / active.length : 0;
  const mostExpensive = active.reduce((m, sub) => {
    const c = convertToTRY(getMonthlyAmount(sub), sub.currency);
    return c > m.cost ? {name: sub.name, cost: c} : m;
  }, {name:'–', cost:0});

  document.getElementById('analytics-summary-row').innerHTML = [
    {label: 'Aylık Toplam', value: formatTRY(totalMonthly)},
    {label: 'Yıllık Toplam', value: formatTRY(totalYearly)},
    {label: 'Ortalama Maliyet', value: formatTRY(avgCost)},
    {label: 'En Pahalı', value: mostExpensive.name},
  ].map(x => `<div class="asummary-card"><div class="asummary-label">${x.label}</div><div class="asummary-value">${x.value}</div></div>`).join('');

  renderCategoryChart(subs);
  renderCurrencyChart(subs);
  renderTrendChart();
  renderTopList(subs);
  renderSavingsOpportunities();
}

function renderCategoryChart(subs) {
  const canvas = document.getElementById('categoryChart');
  const legend = document.getElementById('category-legend');
  if (!canvas) return;
  const totals = {};
  (subs || subscriptions).filter(s => s.status !== 'paused').forEach(s => {
    const amt = analyticsMode === 'monthly'
      ? convertToTRY(getMonthlyAmount(s), s.currency)
      : convertToTRY(getYearlyAmount(s), s.currency);
    totals[s.category] = (totals[s.category] || 0) + amt;
  });
  const labels = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
  const values = labels.map(k => totals[k]);
  const colors = CHART_COLORS.slice(0, labels.length);
  if (!values.length) { canvas.parentElement.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>Veri yok</p></div>'; return; }
  charts.category = new MiniPieChart(canvas, labels, values, colors);
  legend.innerHTML = labels.map((l, i) => `<div class="legend-item"><div class="legend-dot" style="background:${colors[i]}"></div><span class="legend-label">${CATEGORY_ICONS[l]||'📦'} ${l}</span><span class="legend-val">${formatTRY(values[i])}</span></div>`).join('');
}

function renderCurrencyChart(subs) {
  const canvas = document.getElementById('currencyChart');
  const legend = document.getElementById('currency-legend');
  if (!canvas) return;
  const totals = {};
  (subs || subscriptions).filter(s => s.status !== 'paused').forEach(s => {
    const amt = convertToTRY(analyticsMode === 'monthly' ? getMonthlyAmount(s) : getYearlyAmount(s), s.currency);
    totals[s.currency] = (totals[s.currency] || 0) + amt;
  });
  const labels = Object.keys(totals);
  const values = labels.map(k => totals[k]);
  const colors = ['#10b981','#3b82f6','#ec4899','#f59e0b','#6366f1'];
  if (!values.length) { canvas.parentElement.innerHTML = '<div class="empty-state"><span class="empty-icon">💱</span><p>Veri yok</p></div>'; return; }
  charts.currency = new MiniPieChart(canvas, labels, values, colors.slice(0, labels.length));
  legend.innerHTML = labels.map((l, i) => `<div class="legend-item"><div class="legend-dot" style="background:${colors[i]}"></div><span class="legend-label">${CURRENCY_INFO[l]?.flag||''} ${l}</span><span class="legend-val">${formatTRY(values[i])}</span></div>`).join('');
}

function renderTrendChart() {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const months = [], totals = [];
  const now = new Date();
  const baseMonthly = subscriptions.filter(s => s.status !== 'paused').reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleDateString('tr-TR', {month:'short', year:'2-digit'}));
    const variation = i === 0 ? 1 : (0.75 + Math.random() * 0.5);
    totals.push(Math.round(baseMonthly * variation));
  }
  charts.trend = new MiniBarChart(canvas, months, totals, '#6366f1');
}

function renderTopList(subs) {
  const list = document.getElementById('top-subs-list');
  if (!list) return;
  const sorted = [...(subs || subscriptions)].filter(s => s.status !== 'paused')
    .map(s => ({...s, tryMonthly: convertToTRY(getMonthlyAmount(s), s.currency)}))
    .sort((a, b) => b.tryMonthly - a.tryMonthly).slice(0, 5);
  if (!sorted.length) { list.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>Veri yok</p></div>'; return; }
  const max = sorted[0].tryMonthly;
  list.innerHTML = sorted.map((s, i) => `<div class="top-item">
    <div class="top-item-rank">${i+1}</div>
    <div style="flex:1">
      <div class="top-item-name">${s.emoji||''} ${escHtml(s.name)}</div>
      <div class="top-item-bar" style="width:${Math.round((s.tryMonthly/max)*100)}%;background:${s.color}"></div>
    </div>
    <div class="top-item-price">${formatTRY(s.tryMonthly)}</div>
  </div>`).join('');
}

function renderSavingsOpportunities() {
  const container = document.getElementById('savings-opportunities');
  if (!container) return;
  const opps = [];
  const ghost = subscriptions.filter(s => s.status === 'ghost');
  if (ghost.length > 0) {
    const total = ghost.reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
    opps.push({ icon:'👻', title:`${ghost.length} hayalet abonelik`, desc:'Kullanmadığınız abonelikler var.', amount:`Yıllık ${formatTRY(total*12)} tasarruf edebilirsiniz` });
  }

  const catCounts = {};
  subscriptions.filter(s => s.status === 'active').forEach(s => catCounts[s.category] = (catCounts[s.category]||0)+1);
  if (catCounts['eğlence'] >= 3) opps.push({ icon:'🎬', title:'Çok fazla eğlence platformu', desc:`${catCounts['eğlence']} eğlence aboneliğiniz var. Birini iptal etmeyi düşünün.`, amount:'' });
  if (catCounts['yapay zeka'] >= 3) opps.push({ icon:'🤖', title:'Birden fazla AI aracı', desc:`${catCounts['yapay zeka']} yapay zeka aboneliğiniz var. En çok kullandığınızı seçin.`, amount:'' });

  const monthlyPayers = subscriptions.filter(s => s.status === 'active' && s.period === 'monthly' && s.amount >= 10);
  if (monthlyPayers.length > 0) {
    const potentialSave = monthlyPayers.reduce((s, sub) => s + convertToTRY(sub.amount * 0.15, sub.currency), 0);
    opps.push({ icon:'💡', title:'Yıllık planlara geçin', desc:`${monthlyPayers.length} aylık aboneliğinizi yıllığa çevirirseniz ortalama %15-20 indirim alırsınız.`, amount:`Yaklaşık ${formatTRY(potentialSave)}/ay tasarruf` });
  }
  if (opps.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">🎉</span><p>Görünür tasarruf fırsatı yok!</p></div>';
  } else {
    container.innerHTML = opps.map(o => `<div class="sav-opp"><div class="sav-opp-title">${o.icon} ${o.title}</div><div class="sav-opp-desc">${o.desc}</div>${o.amount ? `<div class="sav-opp-amount">→ ${o.amount}</div>` : ''}</div>`).join('');
  }
}

function destroyCharts() {
  Object.values(charts).forEach(c => { try { c.destroy(); } catch {} });
  charts = {};
}

function renderBudgetPage() {
  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  document.getElementById('budget-total-value').textContent = formatTRY(totalBudget);
  const keys = Object.keys(budgets);
  document.getElementById('budget-total-sub').textContent = keys.length > 0 ? `${keys.length} kategori bütçesi tanımlı` : 'Tanımlanmış bütçe yok';

  const list = document.getElementById('budget-list');
  if (keys.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="empty-icon">🎯</span><p>Bütçe limiti eklenmedi.</p><button class="btn-primary" onclick="openBudgetModal()">İlk Bütçeyi Ekle</button></div>`;
    return;
  }
  list.innerHTML = keys.map(cat => {
    const limit = budgets[cat];
    const spent = subscriptions
      .filter(s => s.status === 'active' && (cat === 'toplam' || s.category === cat))
      .reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
    const pct = Math.min(100, Math.round((spent / limit) * 100));
    const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
    const label = cat === 'toplam' ? '💰 Genel Toplam' : `${CATEGORY_ICONS[cat]||'📦'} ${cat}`;
    return `<div class="budget-item">
      <div class="bi-top">
        <div class="bi-name">${label}</div>
        <div>
          <span class="bi-amounts">${formatTRY(spent)} / ${formatTRY(limit)}</span>
          &nbsp;<span class="bi-pct" style="color:${color}">${pct}%</span>
        </div>
      </div>
      <div class="bi-track"><div class="bi-fill" style="width:${pct}%;background:${color}"></div></div>
      ${pct >= 90 ? `<div style="font-size:0.76rem;color:${color};margin-top:6px">⚠️ ${pct >= 100 ? 'Bütçe aşıldı!' : 'Bütçe limitine yaklaşıyorsunuz!'}</div>` : ''}
      <div class="bi-actions">
        <button class="btn-secondary btn-sm" onclick="openBudgetModalEdit('${cat}',${limit})">✏️ Düzenle</button>
        <button class="btn-danger btn-sm" onclick="deleteBudget('${cat}')">🗑 Sil</button>
      </div>
    </div>`;
  }).join('');
}

function openBudgetModal() {
  document.getElementById('budget-category').value = 'toplam';
  document.getElementById('budget-limit').value = '';
  document.getElementById('budget-modal-overlay').classList.add('active');
}
function openBudgetModalEdit(cat, limit) {
  document.getElementById('budget-category').value = cat;
  document.getElementById('budget-limit').value = limit;
  document.getElementById('budget-modal-overlay').classList.add('active');
}
function closeBudgetModal() { document.getElementById('budget-modal-overlay').classList.remove('active'); }
function saveBudget() {
  const cat = document.getElementById('budget-category').value;
  const limit = parseFloat(document.getElementById('budget-limit').value);
  if (!cat || isNaN(limit) || limit <= 0) { showToast('Geçerli bir limit girin!', 'error'); return; }
  budgets[cat] = limit;
  saveBudgets();
  closeBudgetModal();
  renderBudgetPage();
  renderDashboard();
  showToast('Bütçe kaydedildi!', 'success');
  checkBudgetAlerts();
}
function deleteBudget(cat) {
  delete budgets[cat];
  saveBudgets();
  renderBudgetPage();
  renderDashboard();
  showToast('Bütçe silindi', 'info');
}
function checkBudgetAlerts() {
  Object.entries(budgets).forEach(([cat, limit]) => {
    const spent = subscriptions.filter(s => s.status === 'active' && (cat === 'toplam' || s.category === cat))
      .reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
    const pct = (spent / limit) * 100;
    if (pct >= 100) showToast(`⚠️ ${cat === 'toplam' ? 'Genel' : cat} bütçesi aşıldı!`, 'error');
    else if (pct >= 80) showToast(`⚠️ ${cat === 'toplam' ? 'Genel' : cat} bütçenizin %${Math.round(pct)}'ini kullandınız.`, 'warning');
  });
}

function renderReport() {
  const tbody = document.getElementById('report-tbody');
  const tfoot = document.getElementById('report-tfoot');
  const statsRow = document.getElementById('report-stats-row');
  const dateEl = document.getElementById('report-date');
  if (!tbody) return;

  dateEl.textContent = `Oluşturulma: ${new Date().toLocaleString('tr-TR')}`;

  const active = subscriptions.filter(s => s.status !== 'paused');
  const totalMonthly = active.reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);
  const totalYearly = totalMonthly * 12;
  const ghostCount = subscriptions.filter(s => s.status === 'ghost').length;
  const ghostMonthly = subscriptions.filter(s => s.status === 'ghost').reduce((s, sub) => s + convertToTRY(getMonthlyAmount(sub), sub.currency), 0);

  statsRow.innerHTML = [
    {label:'Toplam Abonelik', value: subscriptions.length},
    {label:'Aktif', value: active.length},
    {label:'Hayalet Gider', value: ghostCount},
    {label:'Aylık Toplam', value: formatTRY(totalMonthly)},
    {label:'Yıllık Toplam', value: formatTRY(totalYearly)},
    {label:'Boşa Giden', value: formatTRY(ghostMonthly * 12) + '/yıl'},
  ].map(x => `<div class="report-stat"><div class="rs-label">${x.label}</div><div class="rs-value">${x.value}</div></div>`).join('');

  const sorted = [...subscriptions].sort((a, b) => convertToTRY(getMonthlyAmount(b), b.currency) - convertToTRY(getMonthlyAmount(a), a.currency));
  tbody.innerHTML = sorted.map(s => {
    const monthly = convertToTRY(getMonthlyAmount(s), s.currency);
    const yearly = convertToTRY(getYearlyAmount(s), s.currency);
    const renewal = new Date(s.renewalDate).toLocaleDateString('tr-TR');
    const statusText = s.status === 'active' ? '✅' : s.status === 'ghost' ? '👻' : '⏸';
    return `<tr>
      <td>${s.emoji||''} ${escHtml(s.name)}</td>
      <td>${CATEGORY_ICONS[s.category]||''} ${s.category}</td>
      <td>${statusText} ${s.status}</td>
      <td>${formatCurrency(s.amount, s.currency)}/${periodLabel(s.period)}</td>
      <td>${formatTRY(monthly)}</td>
      <td>${formatTRY(yearly)}</td>
      <td>${renewal}</td>
    </tr>`;
  }).join('');
  tfoot.innerHTML = `<tr><td colspan="4"><strong>TOPLAM</strong></td><td><strong>${formatTRY(totalMonthly)}</strong></td><td><strong>${formatTRY(totalYearly)}</strong></td><td></td></tr>`;
}

function exportCSV() {
  const rows = [['Ad','Kategori','Durum','Tutar','Para Birimi','Periyot','Aylık TRY','Yıllık TRY','Yenileme','Kart','Not']];
  subscriptions.forEach(s => {
    rows.push([
      s.name, s.category, s.status, s.amount, s.currency, s.period,
      convertToTRY(getMonthlyAmount(s), s.currency).toFixed(2),
      convertToTRY(getYearlyAmount(s), s.currency).toFixed(2),
      s.renewalDate, s.card||'', s.note||''
    ]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const bom = '\uFEFF';
  downloadFile(bom + csv, `subtrack_${dateStr()}.csv`, 'text/csv;charset=utf-8');
  showToast('CSV indirildi!', 'success');
}

function exportJSON() {
  const backup = { subscriptions, budgets, settings, exportedAt: new Date().toISOString(), version: 2 };
  downloadFile(JSON.stringify(backup, null, 2), `subtrack_backup_${dateStr()}.json`, 'application/json');
  showToast('JSON yedeği indirildi!', 'success');
}

function importJSON() { document.getElementById('import-file').click(); }

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.subscriptions && Array.isArray(data.subscriptions)) {
        if (!confirm(`${data.subscriptions.length} abonelik içe aktarılacak. Mevcut veriler korunacak. Devam edilsin mi?`)) return;
        const existingIds = new Set(subscriptions.map(s => s.id));
        data.subscriptions.forEach(s => { if (!existingIds.has(s.id)) subscriptions.push(s); });
        if (data.budgets) Object.assign(budgets, data.budgets);
        saveData(); saveBudgets();
        renderAll();
        showToast(`${data.subscriptions.length} abonelik içe aktarıldı!`, 'success');
      } else {
        showToast('Geçersiz yedek dosyası!', 'error');
      }
    } catch { showToast('Dosya okunamadı!', 'error'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function printReport() { window.print(); }

function downloadFile(content, filename, type) {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dateStr() { return new Date().toISOString().slice(0,10); }

function renderRates() {
  const grid = document.getElementById('rates-grid');
  grid.innerHTML = ['USD','EUR','GBP','JPY'].map(code => {
    const info = CURRENCY_INFO[code];
    const rate = tryRates[code] || 1;
    return `<div class="rate-card" onclick="setConverterFrom('${code}')">
      <div class="rate-flag">${info.flag}</div>
      <div class="rate-code">${code}/TRY</div>
      <div class="rate-value">₺${rate.toFixed(code==='JPY'?4:2)}</div>
      <div class="rate-name">${info.name}</div>
    </div>`;
  }).join('');
}

function setConverterFrom(code) {
  document.getElementById('conv-from').value = code;
  document.getElementById('conv-to').value = 'TRY';
  document.getElementById('conv-amount').value = 1;
  convertCurrency();
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById('conv-amount').value) || 0;
  const from = document.getElementById('conv-from').value;
  const to = document.getElementById('conv-to').value;
  let result, rate;
  if (from === to) { result = amount; rate = 1; }
  else if (from === 'TRY') { rate = 1 / (tryRates[to] || 1); result = amount * rate; }
  else if (to === 'TRY') { rate = tryRates[from] || 1; result = amount * rate; }
  else { const inTRY = amount * (tryRates[from] || 1); rate = 1 / (tryRates[to] || 1); result = inTRY * rate; }

  const toInfo = CURRENCY_INFO[to];
  document.getElementById('conv-result').textContent = `${toInfo?.symbol||to}${result.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:4})}`;
  document.getElementById('conv-rate-info').textContent = `1 ${from} = ${(tryRates[from]||1).toFixed(4)} TRY`;
}

function swapCurrencies() {
  const f = document.getElementById('conv-from'), t = document.getElementById('conv-to');
  [f.value, t.value] = [t.value, f.value];
  convertCurrency();
}

function setupModal() {
  document.getElementById('btn-open-modal').addEventListener('click', openAddModal);
  document.getElementById('btn-add-modal-top').addEventListener('click', openAddModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
  document.getElementById('btn-save-sub').addEventListener('click', saveSub);
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === document.getElementById('modal-overlay')) closeModal(); });
  document.getElementById('budget-modal-overlay').addEventListener('click', e => { if (e.target === document.getElementById('budget-modal-overlay')) closeBudgetModal(); });

  const nameInput = document.getElementById('sub-name');
  const suggestions = document.getElementById('service-suggestions');
  nameInput.addEventListener('input', () => {
    updateTRYPreview();
    const q = nameInput.value.toLowerCase();
    if (q.length < 1) { suggestions.classList.remove('visible'); return; }
    const matches = POPULAR_SERVICES.filter(s => s.name.toLowerCase().includes(q)).slice(0, 6);
    if (!matches.length) { suggestions.classList.remove('visible'); return; }
    suggestions.classList.add('visible');
    suggestions.innerHTML = matches.map(s => `<div class="suggestion-item" data-service='${JSON.stringify(s)}'><span class="suggestion-emoji">${s.emoji}</span><span>${s.name}</span><span style="margin-left:auto;font-size:0.72rem;color:var(--text-muted)">${formatCurrency(s.amount,s.currency)}/ay</span></div>`).join('');
    suggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const svc = JSON.parse(item.dataset.service);
        fillService(svc);
      });
    });
  });
  nameInput.addEventListener('blur', () => setTimeout(() => suggestions.classList.remove('visible'), 150));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); closeBudgetModal(); }
  });
}

function buildQuickServices() {
  const chips = document.getElementById('qs-chips');
  const popular = POPULAR_SERVICES.slice(0, 10);
  chips.innerHTML = popular.map(s => `<div class="qs-chip" onclick='fillService(${JSON.stringify(s)})'>${s.emoji} ${s.name}</div>`).join('');
}

function fillService(service) {
  document.getElementById('sub-name').value = service.name;
  document.getElementById('sub-category').value = service.category;
  if (service.amount) document.getElementById('sub-amount').value = service.amount;
  if (service.currency) document.getElementById('sub-currency').value = service.currency;
  if (service.color) selectColor(service.color, null);
  document.getElementById('service-suggestions').classList.remove('visible');
  updateTRYPreview();
}

function openAddModal() {
  document.getElementById('modal-title').textContent = 'Abonelik Ekle';
  document.getElementById('edit-id').value = '';
  document.getElementById('sub-name').value = '';
  document.getElementById('sub-amount').value = '';
  document.getElementById('sub-currency').value = 'TRY';
  document.getElementById('sub-period').value = 'monthly';
  document.getElementById('sub-category').value = 'eğlence';
  document.getElementById('sub-status').value = 'active';
  document.getElementById('sub-note').value = '';
  document.getElementById('sub-card').value = '';
  document.getElementById('sub-auto-renew').checked = true;
  document.getElementById('sub-color').value = '#6366f1';
  document.getElementById('try-preview').style.display = 'none';
  selectedColor = '#6366f1';
  document.querySelectorAll('.color-opt').forEach(o => o.classList.toggle('selected', o.dataset.color === '#6366f1'));
  const nxt = new Date(); nxt.setMonth(nxt.getMonth() + 1);
  document.getElementById('sub-renewal').valueAsDate = nxt;
  document.getElementById('modal-overlay').classList.add('active');
  setTimeout(() => document.getElementById('sub-name').focus(), 100);
}

function openEditModal(id) {
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) return;
  document.getElementById('modal-title').textContent = 'Abonelik Düzenle';
  document.getElementById('edit-id').value = id;
  document.getElementById('sub-name').value = sub.name;
  document.getElementById('sub-amount').value = sub.amount;
  document.getElementById('sub-currency').value = sub.currency;
  document.getElementById('sub-period').value = sub.period;
  document.getElementById('sub-renewal').value = sub.renewalDate;
  document.getElementById('sub-category').value = sub.category;
  document.getElementById('sub-status').value = sub.status;
  document.getElementById('sub-note').value = sub.note || '';
  document.getElementById('sub-card').value = sub.card || '';
  document.getElementById('sub-auto-renew').checked = sub.autoRenew !== false;
  document.getElementById('sub-color').value = sub.color || '#6366f1';
  selectedColor = sub.color || '#6366f1';
  document.querySelectorAll('.color-opt').forEach(o => o.classList.toggle('selected', o.dataset.color === sub.color));
  document.getElementById('modal-overlay').classList.add('active');
  updateTRYPreview();
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }

function selectColor(color, el) {
  selectedColor = color;
  document.getElementById('sub-color').value = color;
  document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
  if (el) el.classList.add('selected');
  else document.querySelector(`[data-color="${color}"]`)?.classList.add('selected');
}

function updateTRYPreview() {
  const amount = parseFloat(document.getElementById('sub-amount').value);
  const currency = document.getElementById('sub-currency').value;
  const preview = document.getElementById('try-preview');
  const symbol = CURRENCY_INFO[currency]?.symbol || currency;
  document.getElementById('form-currency-symbol').textContent = symbol;
  if (currency !== 'TRY' && !isNaN(amount) && amount > 0) {
    const tryAmt = convertToTRY(amount, currency);
    preview.style.display = 'block';
    preview.textContent = `≈ ${formatTRY(tryAmt)} (anlık kura göre)`;
  } else {
    preview.style.display = 'none';
  }
}

function saveSub() {
  const name = document.getElementById('sub-name').value.trim();
  const amount = parseFloat(document.getElementById('sub-amount').value);
  const currency = document.getElementById('sub-currency').value;
  const period = document.getElementById('sub-period').value;
  const renewal = document.getElementById('sub-renewal').value;
  const category = document.getElementById('sub-category').value;
  const status = document.getElementById('sub-status').value;
  const note = document.getElementById('sub-note').value.trim();
  const card = document.getElementById('sub-card').value.trim();
  const autoRenew = document.getElementById('sub-auto-renew').checked;
  const color = document.getElementById('sub-color').value || '#6366f1';
  const editId = document.getElementById('edit-id').value;

  if (!name) { showToast('Hizmet adı gerekli!', 'error'); return; }
  if (isNaN(amount) || amount <= 0) { showToast('Geçerli bir tutar girin!', 'error'); return; }
  if (!renewal) { showToast('Yenileme tarihi gerekli!', 'error'); return; }

  const service = POPULAR_SERVICES.find(s => s.name.toLowerCase() === name.toLowerCase());
  const emoji = service?.emoji || (CATEGORY_ICONS[category] || '📦');

  if (editId) {
    const idx = subscriptions.findIndex(s => s.id === editId);
    if (idx !== -1) subscriptions[idx] = { ...subscriptions[idx], name, amount, currency, period, renewalDate: renewal, category, status, note, card, autoRenew, color, emoji };
    showToast(`${name} güncellendi!`, 'success');
  } else {
    subscriptions.push({ id: generateId(), name, amount, currency, period, renewalDate: renewal, category, status, note, card, autoRenew, color, emoji, createdAt: new Date().toISOString() });
    showToast(`${name} eklendi! 🎉`, 'success');
  }
  saveData();
  closeModal();
  renderAll();
  checkBudgetAlerts();
}

function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('delete-overlay').classList.add('active');
  document.getElementById('btn-confirm-delete').onclick = () => {
    subscriptions = subscriptions.filter(s => s.id !== deleteTargetId);
    saveData(); renderAll(); closeDeleteModal();
    showToast('Abonelik silindi.', 'info');
  };
}
function closeDeleteModal() { document.getElementById('delete-overlay').classList.remove('active'); deleteTargetId = null; }

function setupSearch() {
  document.getElementById('search-input')?.addEventListener('input', renderSubscriptions);
  document.getElementById('filter-category')?.addEventListener('change', renderSubscriptions);
  document.getElementById('filter-status')?.addEventListener('change', renderSubscriptions);
  document.getElementById('sort-by')?.addEventListener('change', renderSubscriptions);

  const globalSearch = document.getElementById('global-search');
  const gsResults = document.getElementById('global-search-results');
  globalSearch.addEventListener('input', () => {
    const q = globalSearch.value.toLowerCase().trim();
    if (!q) { gsResults.classList.remove('visible'); return; }
    const matches = subscriptions.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || (s.note||'').toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) { gsResults.innerHTML = '<div class="gsr-item" style="color:var(--text-muted)">Sonuç bulunamadı</div>'; gsResults.classList.add('visible'); return; }
    gsResults.classList.add('visible');
    gsResults.innerHTML = matches.map(s => {
      const monthlyTRY = convertToTRY(getMonthlyAmount(s), s.currency);
      return `<div class="gsr-item" onclick="openEditModal('${s.id}');document.getElementById('global-search').value='';document.getElementById('global-search-results').classList.remove('visible')">
        <div class="gsr-dot" style="background:${s.color}"></div>
        <div class="gsr-info">
          <div class="gsr-name">${s.emoji||''} ${escHtml(s.name)}</div>
          <div class="gsr-sub">${s.category} • ${s.status}</div>
        </div>
        <div class="gsr-price">${formatTRY(monthlyTRY)}/ay</div>
      </div>`;
    }).join('');
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openAddModal(); }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); document.getElementById('global-search').focus(); }
    }
    if (e.key === '1') showPage('dashboard');
    if (e.key === '2') showPage('subscriptions');
    if (e.key === '3') showPage('analytics');
    if (e.key === '4') showPage('budget');
    if (e.key === '5') showPage('alerts');
  });
}

function requestNotifPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(perm => {
      checkBrowserNotifPermission();
      if (perm === 'granted') {
        showToast('Bildirimler etkinleştirildi!', 'success');
        scheduleNotifications();
      }
    });
  } else {
    showToast('Bu tarayıcı bildirimleri desteklemiyor.', 'error');
  }
}
function checkBrowserNotifPermission() {
  if ('Notification' in window) {
    const status = document.getElementById('notif-perm-status');
    const btn = document.getElementById('notif-perm-btn');
    if (Notification.permission === 'granted') {
      status.textContent = '✅ Bildirimler aktif';
      btn.textContent = '✅ Bildirimler Açık';
      btn.disabled = true;
    } else if (Notification.permission === 'denied') {
      status.textContent = '❌ Bildirimler engellendi (tarayıcı ayarlarından açın)';
    }
  }
}
function scheduleNotifications() {
  const upcoming = getUpcomingRenewals(settings.alertDays);
  upcoming.forEach(s => {
    const days = getDaysUntilRenewal(s.renewalDate);
    if (days <= 1 && Notification.permission === 'granted') {
      new Notification(`⚠️ ${s.name} yenileniyor!`, {
        body: `${days === 0 ? 'Bugün' : 'Yarın'} ${formatCurrency(s.amount, s.currency)} ödemeniz gerekiyor.`,
        icon: '📋'
      });
    }
  });
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showPage(item.dataset.page);
      if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  const titles = { dashboard:'Dashboard', subscriptions:'Aboneliklerim', calendar:'Takvim', analytics:'Analiz', budget:'Bütçe Yönetimi', alerts:'Uyarılar', currencies:'Döviz Kurları', report:'Harcama Raporu' };
  document.getElementById('page-title').textContent = titles[page] || page;
  if (page === 'analytics') setTimeout(() => renderAnalytics(), 50);
}

function setAlertDays(days, btn) {
  settings.alertDays = days;
  saveSettings();
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAlerts();
  showToast(`Uyarı ${days} gün olarak ayarlandı.`, 'success');
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    settings.theme = newTheme;
    saveSettings();
    applyTheme(newTheme);
  });
}
function applyTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  document.body.classList.toggle('theme-light', theme === 'light');
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${escHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'toast-out 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function setGreeting() {
  const h = new Date().getHours();
  const g = h < 6 ? 'Gece geç saatlerde! 🌙' : h < 12 ? 'Günaydın! ☀️' : h < 17 ? 'İyi günler! 👋' : h < 21 ? 'İyi akşamlar! 🌆' : 'İyi geceler! 🌙';
  document.getElementById('greeting-text').textContent = g;
}
function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}
function closeOnboarding() {
  document.getElementById('onboarding-overlay').style.display = 'none';
  localStorage.setItem(FIRST_VISIT_KEY, '1');
}

class MiniPieChart {
  constructor(canvas, labels, values, colors) {
    this.canvas = canvas; this._destroyed = false;
    this.canvas.width = 150; this.canvas.height = 150;
    const ctx = canvas.getContext('2d');
    const cx = 75, cy = 75, r = 67;
    const total = values.reduce((a, b) => a + b, 0);
    let angle = -Math.PI / 2;
    values.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath(); ctx.fillStyle = colors[i]; ctx.fill();
      angle += slice;
    });

    const bg = document.body.classList.contains('theme-light') ? '#ffffff' : '#111827';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = bg; ctx.fill();
  }
  destroy() { this._destroyed = true; }
}

class MiniBarChart {
  constructor(canvas, labels, values, color) {
    this.canvas = canvas; this._destroyed = false;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement?.clientWidth || 600, H = 200;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const pad = { top:20, right:16, bottom:38, left:68 };
    const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;
    const max = Math.max(...values) || 1;
    const bW = (cW / values.length) * 0.55;
    const gap = (cW / values.length) - bW;
    ctx.font = `${11 * Math.min(1, W/600)}px Inter, sans-serif`;

    for (let i = 0; i <= 4; i++) {
      const y = pad.top + cH - (i / 4) * cH;
      ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
      ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.7)'; ctx.textAlign = 'right';
      const val = Math.round((i / 4) * max);
      ctx.fillText(val >= 1000 ? '₺' + (val/1000).toFixed(1) + 'K' : '₺' + val, pad.left - 6, y + 4);
    }
    values.forEach((v, i) => {
      const x = pad.left + i * (cW / values.length) + gap / 2;
      const bH = (v / max) * cH;
      const y = pad.top + cH - bH;
      const grad = ctx.createLinearGradient(0, y, 0, y + bH);
      grad.addColorStop(0, color); grad.addColorStop(1, color + '44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, bW, bH, [4,4,0,0]);
      else ctx.rect(x, y, bW, bH);
      ctx.fill();
      ctx.fillStyle = 'rgba(148,163,184,0.7)'; ctx.textAlign = 'center'; ctx.font = '10px Inter, sans-serif';
      ctx.fillText(labels[i], x + bW / 2, H - pad.bottom + 14);
      if (v > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '9px Inter, sans-serif';
        ctx.fillText(v >= 1000 ? '₺' + (v/1000).toFixed(1) + 'K' : '₺' + v, x + bW / 2, y - 4);
      }
    });
  }
  destroy() { this._destroyed = true; }
}

(function loadDemoData() {
  if (subscriptions.length > 0) return;
  const today = new Date();
  const ad = (d) => { const x = new Date(today); x.setDate(x.getDate() + d); return x.toISOString().split('T')[0]; };
  subscriptions = [
    { id: generateId(), name:'Netflix', emoji:'🎬', category:'eğlence', amount:7.99, currency:'USD', period:'monthly', renewalDate:ad(2), status:'active', color:'#ef4444', note:'Aile planı', card:'Garanti Bonus', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'Spotify', emoji:'🎵', category:'müzik', amount:5.99, currency:'USD', period:'monthly', renewalDate:ad(8), status:'active', color:'#10b981', note:'', card:'Ziraat Bankası', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'ChatGPT Plus', emoji:'🤖', category:'yapay zeka', amount:20, currency:'USD', period:'monthly', renewalDate:ad(15), status:'active', color:'#10b981', note:'', card:'PayPal', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'Adobe Creative Cloud', emoji:'🎨', category:'yazılım', amount:54.99, currency:'USD', period:'monthly', renewalDate:ad(20), status:'ghost', color:'#ef4444', note:'Kullanmıyorum ama iptal etmedim', card:'Akbank Axess', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'iCloud 200GB', emoji:'☁️', category:'bulut', amount:2.99, currency:'USD', period:'monthly', renewalDate:ad(5), status:'active', color:'#3b82f6', note:'', card:'Apple ID', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'GitHub Copilot', emoji:'💻', category:'yazılım', amount:10, currency:'USD', period:'monthly', renewalDate:ad(12), status:'active', color:'#8b5cf6', note:'', card:'Ziraat Bankası', autoRenew:true, createdAt:new Date().toISOString() },
    { id: generateId(), name:'Gym', emoji:'🏋️', category:'spor', amount:450, currency:'TRY', period:'monthly', renewalDate:ad(3), status:'active', color:'#f59e0b', note:'Yıllık üyelik', card:'Nakit', autoRenew:false, createdAt:new Date().toISOString() },
    { id: generateId(), name:'Duolingo Plus', emoji:'🦜', category:'eğitim', amount:6.99, currency:'USD', period:'yearly', renewalDate:ad(90), status:'active', color:'#10b981', note:'Yıllık plan', card:'Garanti Bonus', autoRenew:true, createdAt:new Date().toISOString() },
  ];
  budgets = { toplam: 3000, 'eğlence': 800, 'yapay zeka': 1200 };
  saveData(); saveBudgets();
})();
