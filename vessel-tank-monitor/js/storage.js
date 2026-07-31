/* localStorage data layer for the RAWABI tank monitor */

const LS_KEYS = {
  overrides: 'vtm_tank_overrides',   // per-tank edits: capacity, spgr, name, maxSounding, calibration, verified, mode
  soundings: 'vtm_soundings',        // { "YYYY-MM-DD": { tankId: { mode: 'percent'|'cm', value: number, note } } }
  drafts: 'vtm_drafts',              // { fwd: number|null, aft: number|null, heel: number|null }
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const Store = {
  getOverrides() {
    return readJSON(LS_KEYS.overrides, {});
  },

  getTanks() {
    const overrides = Store.getOverrides();
    return DEFAULT_TANKS.map(t => {
      const o = overrides[t.id] || {};
      const defaultCalibration = SOUNDING_TABLES[t.id]
        ? SOUNDING_TABLES[t.id].map(([sounding, volume]) => ({ sounding, volume }))
        : null;
      const calibration = o.calibration || defaultCalibration;
      return Object.assign({}, t, o, {
        mode: o.mode || (calibration ? 'cm' : 'percent'),
        maxSounding: o.maxSounding != null ? o.maxSounding : null,
        calibration, // [{sounding, volume}, ...]
        hasFactoryCalibration: !!defaultCalibration,
      });
    });
  },

  getTank(id) {
    return Store.getTanks().find(t => t.id === id);
  },

  updateTank(id, patch) {
    const overrides = Store.getOverrides();
    overrides[id] = Object.assign({}, overrides[id], patch);
    writeJSON(LS_KEYS.overrides, overrides);
  },

  resetTank(id) {
    const overrides = Store.getOverrides();
    delete overrides[id];
    writeJSON(LS_KEYS.overrides, overrides);
  },

  getAllSoundings() {
    return readJSON(LS_KEYS.soundings, {});
  },

  getSoundingsForDate(dateStr) {
    const all = Store.getAllSoundings();
    return all[dateStr] || {};
  },

  saveSoundingEntry(dateStr, tankId, mode, value, note) {
    const all = Store.getAllSoundings();
    if (!all[dateStr]) all[dateStr] = {};
    all[dateStr][tankId] = { mode, value, note: note || '', loggedAt: new Date().toISOString() };
    writeJSON(LS_KEYS.soundings, all);
  },

  getDatesDescending() {
    const all = Store.getAllSoundings();
    return Object.keys(all).sort((a, b) => (a < b ? 1 : -1));
  },

  /* Latest reading on or before the given date, per tank */
  getLatestSoundings(asOfDate) {
    const all = Store.getAllSoundings();
    const dates = Object.keys(all).filter(d => !asOfDate || d <= asOfDate).sort((a, b) => (a < b ? 1 : -1));
    const result = {};
    for (const tank of Store.getTanks()) {
      for (const d of dates) {
        if (all[d][tank.id]) {
          result[tank.id] = Object.assign({ date: d }, all[d][tank.id]);
          break;
        }
      }
    }
    return result;
  },

  getDrafts() {
    return readJSON(LS_KEYS.drafts, { fwd: null, aft: null, heel: null });
  },

  setDrafts(drafts) {
    writeJSON(LS_KEYS.drafts, drafts);
  },

  exportBackup() {
    return JSON.stringify({
      overrides: Store.getOverrides(),
      soundings: Store.getAllSoundings(),
      drafts: Store.getDrafts(),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  },

  importBackup(json) {
    const data = JSON.parse(json);
    if (data.overrides) writeJSON(LS_KEYS.overrides, data.overrides);
    if (data.soundings) writeJSON(LS_KEYS.soundings, data.soundings);
    if (data.drafts) writeJSON(LS_KEYS.drafts, data.drafts);
  },
};

function todayStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
