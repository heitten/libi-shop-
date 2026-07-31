function fmt(n, d = 2) {
  return n == null || isNaN(n) ? '—' : n.toFixed(d);
}

function currentDate() {
  return document.getElementById('soundingDate').value || todayStr();
}

function rowResultText(tank, mode, value) {
  const reading = computeReading(tank, mode, value);
  if (!reading) {
    if (mode === 'cm') return 'Set Max Sounding in Settings to use cm mode';
    return '';
  }
  return `${fmt(reading.volume)} m³ · ${fmt(reading.weight)} MT · ${fmt(reading.percent, 0)}%`;
}

function renderGroups() {
  const dateStr = currentDate();
  const tanks = Store.getTanks();
  const existing = Store.getSoundingsForDate(dateStr);
  let html = '';

  for (const group of TANK_GROUPS) {
    const groupTanks = tanks.filter(t => t.group === group.id);
    if (!groupTanks.length) continue;
    html += `<div class="card"><div class="group-title" style="margin-top:0">${group.label}</div>`;
    for (const tank of groupTanks) {
      const e = existing[tank.id];
      const mode = (e && e.mode) || tank.mode || 'percent';
      const cmAvailable = !!(tank.maxSounding || (tank.calibration && tank.calibration.length >= 2));
      html += `
        <div class="sounding-row" data-tank="${tank.id}">
          <div>
            <div class="name">${tank.name}</div>
            <div class="cap">Cap ${fmt(tank.capacity, 1)} m³ · Spgr ${tank.spgr}</div>
          </div>
          <select class="mode-select">
            <option value="percent" ${mode === 'percent' ? 'selected' : ''}>% Full</option>
            <option value="cm" ${mode === 'cm' ? 'selected' : ''} ${cmAvailable ? '' : 'disabled'}>Sounding (cm)</option>
            <option value="volume" ${mode === 'volume' ? 'selected' : ''}>Volume (m³)</option>
          </select>
          <input type="number" class="value-input" step="0.001" placeholder="${mode === 'cm' ? 'cm' : mode === 'volume' ? 'm³' : '%'}" value="${e ? e.value : ''}">
          <div class="result">${e ? rowResultText(tank, mode, e.value) : ''}</div>
        </div>
      `;
    }
    html += `</div>`;
  }
  document.getElementById('groups').innerHTML = html;

  document.querySelectorAll('.sounding-row').forEach(row => {
    const tankId = row.dataset.tank;
    const tank = tanks.find(t => t.id === tankId);
    const select = row.querySelector('.mode-select');
    const input = row.querySelector('.value-input');
    const result = row.querySelector('.result');

    function update() {
      const mode = select.value;
      input.placeholder = mode === 'cm' ? 'cm' : mode === 'volume' ? 'm³' : '%';
      const val = parseFloat(input.value);
      result.textContent = isNaN(val) ? '' : rowResultText(tank, mode, val);
    }
    select.addEventListener('change', update);
    input.addEventListener('input', update);
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function saveAll() {
  const dateStr = currentDate();
  let count = 0;
  document.querySelectorAll('.sounding-row').forEach(row => {
    const tankId = row.dataset.tank;
    const mode = row.querySelector('.mode-select').value;
    const raw = row.querySelector('.value-input').value;
    if (raw === '') return;
    const value = parseFloat(raw);
    if (isNaN(value)) return;
    Store.saveSoundingEntry(dateStr, tankId, mode, value);
    count++;
  });
  showToast(`Saved ${count} tank reading(s) for ${dateStr}`);
  renderGroups();
}

document.getElementById('soundingDate').value = todayStr();
document.getElementById('soundingDate').addEventListener('change', renderGroups);
document.getElementById('saveBtn').addEventListener('click', saveAll);
renderGroups();
