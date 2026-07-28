# RAWABI Tank Monitor

A sounding-based tank monitoring portal for the vessel RAWABI, styled after
the onboard VOYAGE IAMS tank monitor. Runs entirely in the browser —
no backend, no build step — data is stored in `localStorage`.

## Pages

- **index.html** — Dashboard. Tanks grouped into Fuel Oil, Drill Water/
  Ballast, Fresh Water, Mud, and Other, each shown as a bar-gauge card with
  Volume (m³), Weight (MT), and Level (%), color-coded and flashing red
  above 85% (high-level alarm), matching the reference IAMS screen.
- **sounding.html** — Daily Sounding Entry. Log today's (or any date's)
  reading per tank, either as **% Full** (works immediately) or
  **Sounding (cm)** once that tank has been calibrated.
- **settings.html** — Tank Setup & Calibration. Edit each tank's name,
  capacity, specific gravity, and Max Sounding depth; add multi-point
  sounding tables for non-linear tanks; export/restore a JSON backup.
- **history.html** — Logbook of past sounding rounds with computed totals.

## Tank data

All tank names and 100% capacities were transcribed from the vessel's
tank capacity plan (photographed). Capacity **values** were cross-checked
against the printed subtotal on each table (Drill Water/Ballast, Fresh
Water, Mud, Fuel Oil all match within rounding). A handful of Fuel Oil
tanks (No.2 through No.7) are flagged with a red **"?"** badge on the
dashboard and a **"verify"** status in Settings because the photo of that
section was angled and the exact name↔capacity pairing for those specific
rows isn't fully certain — please confirm them against the physical
capacity plan and re-save in Settings, which clears the flag.

## Sounding → Volume conversion

- **% Full** needs no setup: `Volume = (%/100) × Capacity`.
- **Sounding (cm)** needs a **Max Sounding depth** (or a full multi-point
  calibration curve) entered per tank in Settings — until then, cm mode
  is disabled for that tank. With only a Max Sounding depth, volume is
  interpolated **linearly** between empty and full, which is an
  approximation for tanks with sloped or curved surfaces (peak tanks,
  double bottoms). Add real sounding-table points in the "Advanced
  calibration" field per tank for an exact piecewise-linear curve instead.

## Backup

Settings → Download Backup exports all tank edits and sounding history as
JSON; Restore Backup loads it back (overwrites current data).
