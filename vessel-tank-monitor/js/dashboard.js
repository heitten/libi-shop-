let activeTab = 'ALL';

function fmt(n, d = 2) {
  return n == null || isNaN(n) ? '—' : n.toFixed(d);
}

function renderClock() {
  const el = document.getElementById('clock');
  const now = new Date();
  el.textContent = now.toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  const tabs = [{ id: 'ALL', label: 'Overview' }, ...TANK_GROUPS.map(g => ({ id: g.id, label: g.label }))];
  tabsEl.innerHTML = tabs.map(t =>
    `<button class="tab-btn ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');
  tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderTabs();
      renderContent();
    });
  });
}

function tankCardHTML(tank, reading, entry, groupColor) {
  const percent = reading ? reading.percent : null;
  let fillColor = groupColor;
  let alarmClass = '';
  if (percent != null) {
    if (percent < 2) fillColor = 'var(--empty)';
    if (percent >= 85) { alarmClass = 'alarm'; }
  }
  const heightPct = percent != null ? Math.max(2, Math.min(100, percent)) : 0;

  const noData = !entry;
  const verifyBadge = tank.verified === false
    ? `<span class="unverified" title="Name/capacity pairing not fully confirmed from source photo — please verify">?</span>`
    : '';

  return `
    <div class="tank-card ${alarmClass}">
      <div class="tk-name"><span>${tank.name}</span>${verifyBadge}</div>
      <div class="tk-body">
        <div class="gauge">
          <div class="fill" style="height:${heightPct}%; background:${fillColor};"></div>
        </div>
        <div class="tk-stats">
          ${noData
            ? `<div class="stat" style="color:var(--text-dim)">No sounding logged yet</div>`
            : `
              <div class="stat"><b>${fmt(reading.volume)} m³</b>Volume</div>
              <div class="stat"><b>${fmt(reading.weight)} MT</b>Weight</div>
              <div class="stat"><b>${percent != null ? fmt(percent, 0) + '%' : '—'}</b>Level</div>
            `}
        </div>
      </div>
      <div class="tk-meta">
        <span>Cap: ${fmt(tank.capacity, 1)} m³ ${tank.hasFactoryCalibration ? '· calibrated' : ''}</span>
        <span>${entry ? entry.date : ''}</span>
      </div>
    </div>
  `;
}

function renderContent() {
  const tanks = Store.getTanks();
  const latest = Store.getLatestSoundings();
  const groups = activeTab === 'ALL' ? TANK_GROUPS : TANK_GROUPS.filter(g => g.id === activeTab);

  let html = '';
  for (const group of groups) {
    const groupTanks = tanks.filter(t => t.group === group.id);
    if (!groupTanks.length) continue;
    html += `<div class="group-title">${group.label}</div><div class="tank-grid">`;
    for (const tank of groupTanks) {
      const entry = latest[tank.id];
      const reading = entry ? computeReading(tank, entry.mode, entry.value) : null;
      html += tankCardHTML(tank, reading, entry, group.color);
    }
    html += `</div>`;
  }
  document.getElementById('content').innerHTML = html || `<p class="hint">No tanks in this group.</p>`;

  const unverifiedCount = tanks.filter(t => t.verified === false).length;
  document.getElementById('unverifiedNotice').innerHTML = unverifiedCount
    ? `<div class="card" style="border-color:var(--red)">
         <b style="color:var(--red)">⚠ ${unverifiedCount} tank(s) need verification</b>
         <p class="hint">Some Fuel Oil tank names were transcribed from an angled photo and the exact name↔capacity pairing isn't fully certain (the capacity numbers themselves check out against the board's printed subtotal). Please confirm against your capacity plan in <a href="settings.html" style="color:var(--accent)">Settings</a>.</p>
       </div>`
    : '';
}

renderClock();
setInterval(renderClock, 30000);
renderTabs();
renderContent();
