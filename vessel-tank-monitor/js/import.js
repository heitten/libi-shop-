/* Import readings from an uploaded Stability Calculation workbook
   (e.g. "R14 Stab Calc ... Dep./Arr. <port>.xlsx"), by reading its
   "Sounding Report" sheet -- the same report the Chief Officer fills in
   for Fresh Water and Drill Water/Ballast tanks, with columns
   No./Tank/Location/MAX sounding/MAX volume/Sounding/Volume.

   Fuel Oil, Cement and Mud tanks aren't on that report, so they aren't
   touched by an import -- keep logging those by hand on Daily Sounding. */

/* normalized tank label -> internal tank id. Normalization strips every
   non-alphanumeric character and uppercases, so "1 FW(P)", "1FW(P)" and
   "1-FW-P" all collapse to the same key -- and known OCR/typo variants
   (e.g. "DWAYBT" for "DW/BT") are listed explicitly. */
const IMPORT_TANK_ALIASES = {
  '1FWP': 'fw1_p', '1FWS': 'fw1_s',
  '2FWP': 'fw_db2_p', '2FWS': 'fw_db2_s',
  '3FWP': 'fw3_p', '3FWS': 'fw3_s',
  '4FWC': 'fw4_c',
  'FPT': 'dw_fp_c',
  '1DWWBTC': 'dw1_db_c',
  '2DWWBTP': 'dw2_p', '2DWBTP': 'dw2_p',
  '2DWBTS': 'dw2_s', '2DWWBTS': 'dw2_s',
  '3DWBTC': 'dw3_c', '3DWWBTC': 'dw3_c',
  '4DWBTP': 'dw4_p', '4DWWBTP': 'dw4_p',
  '4DWBTS': 'dw4_s', '4DWWBTS': 'dw4_s',
  '5DWBTP': 'dw5_p', '5DWWBTP': 'dw5_p',
  '5DWBTS': 'dw5_s', '5DWWBTS': 'dw5_s',
  '6DWBTP': 'dw6_p', '6DWAYBTP': 'dw6_p', '6DWWBTP': 'dw6_p',
  '6DWBTS': 'dw6_s', '6DWWBTS': 'dw6_s',
  '7DWBTP': 'dw7_p', '7DWAYBTP': 'dw7_p', '7DWWBTP': 'dw7_p',
  '7DWBTS': 'dw7_s', '7DWWBTS': 'dw7_s',
  'APDWWBTP': 'aft_pk_p', 'APDWBTP': 'aft_pk_p',
  'APDWWBTS': 'aft_pk_s', 'APDWBTS': 'aft_pk_s',
  'APDWWBTC': 'aft_pk_c', 'APDWBTC': 'aft_pk_c',
};

function normalizeTankLabel(s) {
  return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

let parsedRows = null; // [{ raw, tankId, name, sounding, volume, matched }]
let parsedDate = null;
let parsedVesselHint = null;

function findHeaderRow(rows) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r].map(c => String(c || '').trim().toLowerCase());
    if (row.includes('tank') && (row.includes('volume') || row.includes('sounding'))) {
      return r;
    }
  }
  return -1;
}

function findSheetName(workbook) {
  const preferred = workbook.SheetNames.find(n => n.trim().toLowerCase() === 'sounding report');
  if (preferred) return preferred;
  const loose = workbook.SheetNames.find(n => /sounding/i.test(n) && /report/i.test(n));
  return loose || null;
}

function findDateHint(rows) {
  for (const row of rows.slice(0, 6)) {
    for (let c = 0; c < row.length; c++) {
      if (String(row[c] || '').trim().toLowerCase() === 'date:') {
        const val = row[c + 1];
        if (val instanceof Date) return val;
        if (typeof val === 'number') {
          // Excel serial date
          return new Date(Math.round((val - 25569) * 86400 * 1000));
        }
      }
    }
  }
  return null;
}

function findVesselHint(rows) {
  const first = (rows[0] || []).map(c => String(c || '').trim()).filter(Boolean);
  return first.length ? first[0] : null;
}

function toDateStr(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseWorkbook(workbook, sheetNameOverride) {
  const sheetName = sheetNameOverride || findSheetName(workbook);
  if (!sheetName) return { error: 'No "Sounding Report" sheet found in this workbook.' };

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null });

  const headerIdx = findHeaderRow(rows);
  if (headerIdx === -1) return { error: `Sheet "${sheetName}" doesn't look like a Sounding Report (no Tank/Volume header row found).` };

  const header = rows[headerIdx].map(c => String(c || '').trim().toLowerCase());
  const col = {
    tank: header.indexOf('tank'),
    sounding: header.indexOf('sounding'),
    volume: header.indexOf('volume'),
    maxVolume: header.indexOf('max volume'),
  };
  if (col.tank === -1 || col.volume === -1) {
    return { error: `Sheet "${sheetName}" is missing Tank/Volume columns.` };
  }

  const tanks = Store.getTanks();
  const tanksById = Object.fromEntries(tanks.map(t => [t.id, t]));

  const out = [];
  for (let r = headerIdx + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const tankLabel = row[col.tank];
    if (tankLabel == null || String(tankLabel).trim() === '') continue;
    if (/^total$/i.test(String(tankLabel).trim())) continue;

    const volume = row[col.volume];
    if (typeof volume !== 'number') continue;

    const key = normalizeTankLabel(tankLabel);
    const tankId = IMPORT_TANK_ALIASES[key] || null;
    const tank = tankId ? tanksById[tankId] : null;

    out.push({
      raw: String(tankLabel).trim(),
      tankId,
      name: tank ? tank.name : null,
      sounding: typeof row[col.sounding] === 'number' ? row[col.sounding] : null,
      volume,
      capacity: tank ? tank.capacity : null,
      matched: !!tank,
    });
  }

  return {
    sheetName,
    rows: out,
    dateHint: findDateHint(rows),
    vesselHint: findVesselHint(rows),
  };
}

function renderPreview() {
  const box = document.getElementById('previewBox');
  if (!parsedRows) { box.innerHTML = ''; return; }

  const matchedCount = parsedRows.filter(r => r.matched).length;

  const rowsHtml = parsedRows.map(r => `
    <tr>
      <td>${r.raw}</td>
      <td>${r.matched ? r.name : '<span class="badge-verify">not recognized</span>'}</td>
      <td>${r.sounding != null ? r.sounding + ' cm' : '—'}</td>
      <td>${r.volume.toFixed(3)} m³</td>
      <td>${r.capacity != null ? r.capacity.toFixed(1) + ' m³' : '—'}</td>
    </tr>
  `).join('');

  box.innerHTML = `
    <div class="card">
      <b>${matchedCount} of ${parsedRows.length} rows matched</b>
      <p class="hint">
        This report only covers Fresh Water and Drill Water/Ballast tanks —
        Fuel Oil, Cement and Mud tanks aren't on it and won't change.
        Unmatched rows are shown below for your reference; they're skipped
        on import.
      </p>
      <table>
        <thead><tr><th>Sheet label</th><th>Matched tank</th><th>Sounding</th><th>Volume</th><th>Capacity</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
    <div class="card">
      <button id="applyImportBtn">Import ${matchedCount} reading(s) to Dashboard</button>
    </div>
  `;

  document.getElementById('applyImportBtn').addEventListener('click', () => {
    const dateStr = document.getElementById('importDate').value || todayStr();
    let count = 0;
    for (const r of parsedRows) {
      if (!r.matched) continue;
      Store.saveSoundingEntry(dateStr, r.tankId, 'volume', r.volume, `Imported from stability sheet`);
      count++;
    }
    showToast(`Imported ${count} tank reading(s) for ${dateStr}`);
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function handleFile(file) {
  const status = document.getElementById('fileStatus');
  status.textContent = `Reading ${file.name}…`;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const result = parseWorkbook(workbook);
      if (result.error) {
        status.textContent = result.error;
        parsedRows = null;
        renderPreview();
        return;
      }
      parsedRows = result.rows;
      const dateStr = result.dateHint ? toDateStr(result.dateHint) : todayStr();
      document.getElementById('importDate').value = dateStr;
      status.textContent = `Sheet "${result.sheetName}"${result.vesselHint ? ' — ' + result.vesselHint : ''} — ${parsedRows.length} tank row(s) found.`;
      renderPreview();
    } catch (e) {
      status.textContent = `Could not read this file: ${e.message}`;
      parsedRows = null;
      renderPreview();
    }
  };
  reader.readAsArrayBuffer(file);
}

document.getElementById('fileInput').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (file) handleFile(file);
});

document.getElementById('importDate').value = todayStr();
