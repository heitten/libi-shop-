function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function calibrationToText(cal) {
  if (!cal || !cal.length) return '';
  return cal.map(p => `${p.sounding},${p.volume}`).join('\n');
}

function textToCalibration(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const pts = [];
  for (const line of lines) {
    const [s, v] = line.split(',').map(x => parseFloat(x.trim()));
    if (!isNaN(s) && !isNaN(v)) pts.push({ sounding: s, volume: v });
  }
  return pts.length >= 2 ? pts : null;
}

function renderTables() {
  const tanks = Store.getTanks();
  let html = '';
  for (const group of TANK_GROUPS) {
    const groupTanks = tanks.filter(t => t.group === group.id);
    if (!groupTanks.length) continue;
    html += `<div class="card"><div class="group-title" style="margin-top:0">${group.label}</div>
      <table><thead><tr>
        <th>Tank</th><th>Frame</th><th>Capacity (m³)</th><th>Spgr</th>
        <th>Max Sounding (cm)</th><th>Status</th><th></th>
      </tr></thead><tbody>`;
    for (const tank of groupTanks) {
      html += `
        <tr data-tank="${tank.id}">
          <td><input type="text" class="f-name" value="${tank.name}"></td>
          <td><input type="text" class="f-frame" value="${tank.frame || ''}" style="width:80px"></td>
          <td><input type="number" step="0.1" class="f-capacity" value="${tank.capacity}" style="width:90px"></td>
          <td><input type="number" step="0.001" class="f-spgr" value="${tank.spgr}" style="width:80px"></td>
          <td><input type="number" step="1" class="f-maxsounding" value="${tank.maxSounding != null ? tank.maxSounding : ''}" style="width:90px" placeholder="not set"></td>
          <td>${tank.verified === false ? '<span class="badge-verify">verify</span>' : '<span class="badge-ok">ok</span>'}</td>
          <td><button class="secondary save-row-btn">Save</button></td>
        </tr>
        <tr data-tank-cal="${tank.id}">
          <td colspan="7" style="padding-top:0">
            <details>
              <summary class="hint" style="cursor:pointer">Advanced: calibration points (sounding cm, volume m³) — one pair per line, overrides Max Sounding when 2+ points given</summary>
              <textarea class="f-calibration" rows="3" style="width:100%; margin-top:6px; background:var(--panel-2); color:var(--text); border:1px solid var(--border); border-radius:6px; padding:6px;">${calibrationToText(tank.calibration)}</textarea>
            </details>
          </td>
        </tr>
      `;
    }
    html += `</tbody></table></div>`;
  }
  document.getElementById('tankTables').innerHTML = html;

  document.querySelectorAll('.save-row-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tr = btn.closest('tr');
      const tankId = tr.dataset.tank;
      const calTextarea = document.querySelector(`tr[data-tank-cal="${tankId}"] .f-calibration`);
      const name = tr.querySelector('.f-name').value.trim();
      const frame = tr.querySelector('.f-frame').value.trim();
      const capacity = parseFloat(tr.querySelector('.f-capacity').value);
      const spgr = parseFloat(tr.querySelector('.f-spgr').value);
      const maxSoundingRaw = tr.querySelector('.f-maxsounding').value;
      const maxSounding = maxSoundingRaw === '' ? null : parseFloat(maxSoundingRaw);
      const calibration = textToCalibration(calTextarea.value);

      Store.updateTank(tankId, {
        name, frame, capacity, spgr, maxSounding, calibration, verified: true,
      });
      showToast(`${name} updated`);
      renderTables();
    });
  });
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([Store.exportBackup()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rawabi14-tank-monitor-backup-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (!confirm('This will overwrite current tank edits and sounding history with the backup file. Continue?')) return;
    Store.importBackup(reader.result);
    showToast('Backup restored');
    renderTables();
  };
  reader.readAsText(file);
});

renderTables();
