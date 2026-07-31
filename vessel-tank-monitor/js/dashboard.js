let activeTab = 'OVERVIEW';

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
  const tabs = [{ id: 'OVERVIEW', label: 'Overview' }, ...TANK_GROUPS.map(g => ({ id: g.id, label: g.label }))];
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

function tankCardHTML(tank, reading, entry, groupColor, compact) {
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
    ? `<span class="unverified" title="Capacity not yet confirmed against the vessel's official capacity plan — please verify">?</span>`
    : '';

  return `
    <div class="tank-card ${compact ? 'compact' : ''} ${alarmClass}">
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
      ${compact ? '' : `
      <div class="tk-meta">
        <span>Cap: ${fmt(tank.capacity, 1)} m³ ${tank.hasFactoryCalibration ? '· calibrated' : ''}</span>
        <span>${entry ? entry.date : ''}</span>
      </div>`}
    </div>
  `;
}

function tankWidget(tankId, tanksById, latest, compact) {
  const tank = tanksById[tankId];
  if (!tank) return '';
  const group = TANK_GROUPS.find(g => g.id === tank.group);
  const entry = latest[tank.id];
  const reading = entry ? computeReading(tank, entry.mode, entry.value) : null;
  return tankCardHTML(tank, reading, entry, group ? group.color : '#888', compact);
}

/* ---------- Ship-plan Overview (mirrors the onboard IAMS Overview screen) ---------- */

const OVERVIEW_TOP_ROW_1 = ['aft_pk_p', 'fo6_p', 'dw7_p', 'dw6_p', 'dw5_p', 'fo3_p', 'dw4_p', 'dw2_p', 'fo1_p', 'fw3_p'];
const OVERVIEW_TOP_ROW_2 = ['fo5_c', 'fw4_c', 'fo_db4_p', 'dw3_c', 'fo_day_p', 'fo_db2_p', 'dw1_db_c', 'fw_db2_p', 'fw1_p'];
const OVERVIEW_BOTTOM_ROW_1 = ['fo_db7_c', 'dw7_s', 'dw6_s', 'fo3_s', 'dw4_s', 'fo_day_s', 'fo_db2_s', 'fw_db2_s', 'fw1_s'];
const OVERVIEW_BOTTOM_ROW_2 = ['aft_pk_s', 'fo6_s', 'dw6_s', 'dw5_s', 'fw3_s', 'fw4_s', 'dw2_s', 'fo1_s'];
const OVERVIEW_CMNT_TOP = ['cmnt3', 'cmnt1'];
const OVERVIEW_CMNT_BOTTOM = ['cmnt4', 'cmnt2'];
const OVERVIEW_MUD_TOP = ['mudg_2p', 'mudg_1p'];
const OVERVIEW_MUD_BOTTOM = ['mudg_2s', 'mudg_1s'];

const SHIPPLAN_ROWS = [
  [['No.7-WG P', 'green'], ['No.6-WG P', 'green'], ['No.5-WG P', 'green'], ['No.4-WG P', 'green', 2], ['No.2-P', 'green'], ['No.3-WG P', 'blue']],
  [['No.6-P', 'orange'], ['No.2-P', 'maroon'], ['No.1-P', 'maroon'], ['No.3 P', 'orange', 2], ['DAY-P', 'maroon'], ['No.1 P', 'maroon'], ['No.2-DB P · CEM 2', 'blue'], ['No.1-WG P', 'blue']],
  [['No.5-C', 'orange'], ['No.4-DB C · CEM 4 / CEM 3', 'blue', 2], ['No.3 DB-C', 'green'], ['Dirty Oil', 'gray'], ['No.4 DB P', 'orange'], ['No.2 DB P', 'orange'], ['No.1 DB-C', 'orange'], ['Fwd Peak', 'green']],
  [['Sludge Oil', 'gray', 2], ['No.4 DB S', 'orange'], ['No.2 DB S', 'orange'], ['No.3 S', 'orange', 2], ['DAY-S', 'maroon'], ['No.1 S', 'maroon'], ['No.2-DB P · CEM 1', 'blue'], ['No.1-WG S', 'blue']],
  [['No.6-S', 'orange'], ['No.2-S', 'maroon'], ['No.1-S', 'maroon'], ['No.3 WG-S', 'blue']],
  [['No.7-WG S', 'green'], ['No.6-WG S', 'green'], ['No.5-WG S', 'green'], ['No.4-WG S', 'green', 2], ['No.2-S', 'green']],
];

function shipPlanHTML() {
  const rows = SHIPPLAN_ROWS.map(row => {
    const chips = row.map(([label, color, span]) =>
      `<div class="chip chip-${color}" style="${span ? `flex-grow:${span};` : ''}">${label}</div>`
    ).join('');
    return `<div class="shipplan-row">${chips}</div>`;
  }).join('');

  return `
    <div class="shipplan">
      <div class="aft-bracket">
        <div class="chip chip-green">AFT-P</div>
        <div class="chip chip-green">AFT-C</div>
        <div class="chip chip-green">AFT-S</div>
      </div>
      <div class="shipplan-grid">${rows}</div>
    </div>
  `;
}

function draftWidgetHTML() {
  const d = Store.getDrafts();
  const trim = (d.fwd != null && d.aft != null) ? (d.aft - d.fwd) : null;
  const heel = d.heel != null ? d.heel : 0;
  return `
    <div class="draft-widget">
      <div class="draft-readouts">
        <div class="draft-value" data-field="aft" title="Click to edit Aft draft">${d.aft != null ? fmt(d.aft) + ' M' : '— M'}<span class="draft-label">AFT</span></div>
        <div class="draft-value" data-field="fwd" title="Click to edit Fwd draft">${d.fwd != null ? fmt(d.fwd) + ' M' : '— M'}<span class="draft-label">FWD</span></div>
      </div>
      <div class="draft-ship-icon">🚢</div>
      <div class="draft-scales">
        <div class="scale-row">
          <span class="scale-name">TRIM</span>
          <div class="scale-bar"><div class="scale-marker" style="left:${scalePct(trim)}%"></div></div>
          <span class="scale-val">${trim != null ? fmt(trim) : '—'}</span>
        </div>
        <div class="scale-row" data-field="heel" title="Click to edit Heel">
          <span class="scale-name">HEEL</span>
          <div class="scale-bar"><div class="scale-marker" style="left:${scalePct(heel)}%"></div></div>
          <span class="scale-val">${fmt(heel)}</span>
        </div>
      </div>
    </div>
  `;
}

function scalePct(v) {
  if (v == null) return 50;
  const clamped = Math.max(-5, Math.min(5, v));
  return ((clamped + 5) / 10) * 100;
}

function bindDraftWidget() {
  document.querySelectorAll('.draft-value[data-field]').forEach(el => {
    el.addEventListener('click', () => {
      const field = el.dataset.field;
      const d = Store.getDrafts();
      const raw = prompt(`${field.toUpperCase()} draft (metres):`, d[field] != null ? d[field] : '');
      if (raw === null) return;
      const val = raw.trim() === '' ? null : parseFloat(raw);
      d[field] = isNaN(val) ? null : val;
      Store.setDrafts(d);
      renderContent();
    });
  });
  const heelRow = document.querySelector('.scale-row[data-field="heel"]');
  if (heelRow) {
    heelRow.addEventListener('click', () => {
      const d = Store.getDrafts();
      const raw = prompt('Heel (degrees, +stbd / -port):', d.heel != null ? d.heel : '');
      if (raw === null) return;
      const val = raw.trim() === '' ? null : parseFloat(raw);
      d.heel = isNaN(val) ? null : val;
      Store.setDrafts(d);
      renderContent();
    });
  }
}

function renderOverview() {
  const tanks = Store.getTanks();
  const tanksById = Object.fromEntries(tanks.map(t => [t.id, t]));
  const latest = Store.getLatestSoundings();
  const w = (id, compact = true) => tankWidget(id, tanksById, latest, compact);
  const strip = ids => `<div class="gauge-strip">${ids.map(id => w(id)).join('')}</div>`;
  const col = ids => `<div class="gauge-col">${ids.map(id => w(id)).join('')}</div>`;

  document.getElementById('content').innerHTML = `
    <div class="overview">
      <div class="ov-top">
        <div class="ov-top-strips">
          ${strip(OVERVIEW_TOP_ROW_1)}
          ${strip(OVERVIEW_TOP_ROW_2)}
        </div>
        <div class="ov-cmnt-col">
          ${strip(OVERVIEW_CMNT_TOP)}
        </div>
      </div>
      <div class="ov-middle">
        <div class="ov-left-col">${col(['aft_pk_c'])}</div>
        ${shipPlanHTML()}
        <div class="ov-right-col">
          ${col(['dw_frc'])}
          ${draftWidgetHTML()}
        </div>
      </div>
      <div class="ov-bottom">
        <div class="ov-bottom-strips">
          ${strip(OVERVIEW_BOTTOM_ROW_1)}
          ${strip(OVERVIEW_BOTTOM_ROW_2)}
        </div>
        <div class="ov-mud-col">
          ${strip(OVERVIEW_MUD_TOP)}
          ${strip(OVERVIEW_MUD_BOTTOM)}
        </div>
      </div>
    </div>
  `;
  bindDraftWidget();
}

function renderGroupTab(group) {
  const tanks = Store.getTanks();
  const latest = Store.getLatestSoundings();
  const groupTanks = tanks.filter(t => t.group === group.id);

  let html = `<div class="group-title">${group.label}</div><div class="tank-grid">`;
  for (const tank of groupTanks) {
    const entry = latest[tank.id];
    const reading = entry ? computeReading(tank, entry.mode, entry.value) : null;
    html += tankCardHTML(tank, reading, entry, group.color, false);
  }
  html += `</div>`;
  document.getElementById('content').innerHTML = html || `<p class="hint">No tanks in this group.</p>`;
}

function renderContent() {
  if (activeTab === 'OVERVIEW') {
    renderOverview();
  } else {
    const group = TANK_GROUPS.find(g => g.id === activeTab);
    if (group) renderGroupTab(group);
  }

  const tanks = Store.getTanks();
  const unverifiedCount = tanks.filter(t => t.verified === false).length;
  document.getElementById('unverifiedNotice').innerHTML = unverifiedCount
    ? `<div class="card" style="border-color:var(--red)">
         <b style="color:var(--red)">⚠ ${unverifiedCount} tank(s) need verification</b>
         <p class="hint">Cement, small MUD-gauge, and DW FRC capacities aren't in the vessel's
         stability workbook yet, so placeholder values are used (see the note at the top of
         <code>js/data.js</code> for how each was estimated). Please confirm against your
         capacity plan in <a href="settings.html" style="color:var(--accent)">Settings</a>.</p>
       </div>`
    : '';
}

renderClock();
setInterval(renderClock, 30000);
renderTabs();
renderContent();
