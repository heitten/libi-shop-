function fmt(n, d = 2) {
  return n == null || isNaN(n) ? '—' : n.toFixed(d);
}

function populateDates() {
  const dates = Store.getDatesDescending();
  const sel = document.getElementById('dateSelect');
  if (!dates.length) {
    sel.innerHTML = `<option>No sounding entries yet</option>`;
    sel.disabled = true;
    return;
  }
  sel.innerHTML = dates.map(d => `<option value="${d}">${d}</option>`).join('');
  sel.addEventListener('change', () => renderLog(sel.value));
  renderLog(dates[0]);
}

function renderLog(dateStr) {
  const tanks = Store.getTanks();
  const entries = Store.getSoundingsForDate(dateStr);
  const tankIds = Object.keys(entries);
  if (!tankIds.length) {
    document.getElementById('logTable').innerHTML = `<p class="hint">No entries for this date.</p>`;
    return;
  }

  let totalVolume = 0, totalWeight = 0;
  let rows = '';
  for (const tank of tanks) {
    const e = entries[tank.id];
    if (!e) continue;
    const r = computeReading(tank, e.mode, e.value);
    if (r) { totalVolume += r.volume; totalWeight += r.weight; }
    rows += `
      <tr>
        <td>${tank.name}</td>
        <td>${TANK_GROUPS.find(g => g.id === tank.group).label}</td>
        <td>${e.mode === 'cm' ? e.value + ' cm' : e.value + ' %'}</td>
        <td>${r ? fmt(r.volume) : '—'}</td>
        <td>${r ? fmt(r.weight) : '—'}</td>
        <td>${r ? fmt(r.percent, 0) + '%' : '—'}</td>
      </tr>
    `;
  }

  document.getElementById('logTable').innerHTML = `
    <div class="card">
      <table>
        <thead><tr><th>Tank</th><th>Group</th><th>Reading</th><th>Volume (m³)</th><th>Weight (MT)</th><th>Level</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr style="font-weight:700"><td colspan="3">Total</td><td>${fmt(totalVolume)}</td><td>${fmt(totalWeight)}</td><td></td></tr></tfoot>
      </table>
    </div>
  `;
}

populateDates();
