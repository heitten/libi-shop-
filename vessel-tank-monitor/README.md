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

- **Calibrated tanks** (marked "· calibrated" on the dashboard, 26 of 47
  tanks — all 7 Fresh Water tanks, all 16 Drill Water/Ballast tanks, Foam,
  Detergent, and No.1 Fuel Oil (P)) use the vessel's real, official
  **Tank Sounding Tables (R14)** — exact 0.10m-increment sounding→volume
  points transcribed from `Sounding_table_R14_part_1.pdf` /
  `_part_2.pdf`, stored in `js/soundingTables.js`. Entering a sounding in
  metres for these tanks looks up/interpolates between the real printed
  points — the same numbers your paper sounding table would give. Tables
  are at "No Trim, No Heel" except FO1.P, which is at "Trim: aft 2.000m"
  (the only Fuel Oil trim condition available so far).
- **Not yet calibrated** (Fuel Oil tanks other than No.1 P, all 4 Mud
  tanks, Bilge Holding, Dirty Oil, Hyd. Oil, Lub. Oil): the source PDFs'
  table of contents shows the full booklet runs 200+ pages, with each
  Fuel Oil tank alone spanning ~16 pages across multiple trim conditions,
  and Mud/Bilge/Dirty/Hyd/Lub tanks aren't in the two uploaded files at
  all. These tanks use **% Full** (`Volume = (%/100) × Capacity`, no
  setup needed) until real sounding-table pages for them are provided —
  upload them and I'll wire them in the same way. A **Sounding (cm)**
  mode is also available per tank once you set a **Max Sounding depth**
  in Settings, which interpolates **linearly** between empty and full —
  a reasonable approximation, not an exact curve.
- Any calibration (factory or your own) can be overridden per tank in
  Settings — edit the "Advanced calibration" points and Save.

## Backup

Settings → Download Backup exports all tank edits and sounding history as
JSON; Restore Backup loads it back (overwrites current data).
