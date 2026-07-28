/* Sounding -> Volume/Weight/Level conversion */

function interpolateVolume(calibration, soundingCm) {
  const pts = calibration.slice().sort((a, b) => a.sounding - b.sounding);
  if (soundingCm <= pts[0].sounding) return pts[0].volume;
  if (soundingCm >= pts[pts.length - 1].sounding) return pts[pts.length - 1].volume;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (soundingCm >= a.sounding && soundingCm <= b.sounding) {
      const frac = (soundingCm - a.sounding) / (b.sounding - a.sounding);
      return a.volume + frac * (b.volume - a.volume);
    }
  }
  return pts[pts.length - 1].volume;
}

/* Returns { volume, weight, percent, level } or null if not enough
   calibration data to compute a cm-based reading. */
function computeReading(tank, mode, value) {
  if (value == null || isNaN(value)) return null;

  let volume;
  if (mode === 'percent') {
    const pct = Math.max(0, Math.min(100, value));
    volume = (pct / 100) * tank.capacity;
  } else if (mode === 'cm') {
    if (tank.calibration && tank.calibration.length >= 2) {
      volume = interpolateVolume(tank.calibration, value);
    } else if (tank.maxSounding) {
      const frac = Math.max(0, Math.min(1, value / tank.maxSounding));
      volume = frac * tank.capacity;
    } else {
      return null; // cm mode selected but no calibration set up yet
    }
  } else {
    return null;
  }

  volume = Math.max(0, Math.min(tank.capacity, volume));
  const weight = volume * tank.spgr;
  const percent = tank.capacity > 0 ? (volume / tank.capacity) * 100 : 0;
  const level = mode === 'cm' ? value / 100 : (tank.maxSounding ? (percent / 100) * (tank.maxSounding / 100) : null);

  return { volume, weight, percent, level };
}

function levelColor(percent) {
  if (percent == null) return '#5a6472';
  if (percent < 2) return '#5a6472';       // empty / gray
  if (percent >= 85) return '#e0483c';     // high level alarm
  return null; // caller applies group color
}
