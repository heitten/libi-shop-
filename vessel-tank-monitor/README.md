# RAWABI 14 Tank Monitor

A sounding-based tank monitoring portal for the vessel RAWABI 14, styled after
the onboard VOYAGE IAMS tank monitor screen. Runs entirely in the browser —
no backend, no build step — data is stored in `localStorage`.

## Pages

- **index.html** — Overview + per-group tabs.
  - **Overview** is a ship-plan layout that mirrors the onboard IAMS screen:
    gauge widgets for the Fuel Oil / Drill Water-Ballast / Fresh Water tanks
    arranged in port (top) and starboard (bottom) strips around a colored
    ship-plan diagram (WG/DB/CEM compartments, Aft Peak bracket, Fwd Peak
    bow), with the Cement tanks and small MUD gauges in side columns and a
    draft/trim/heel indicator (click a draft or the heel row to edit).
  - **Fuel Oil / Drill Water-Ballast / Fresh Water / Cement-Mud / Other**
    tabs show the same tanks as gauge cards grouped by category — matching
    the bottom-nav tabs on the real IAMS screen (Other holds Foam,
    Detergent, Dirty Oil, Bilge, Hyd. Oil and Lub. Oil, which aren't on the
    real system's Overview screen but need somewhere to log readings).
  - All gauges are color-coded and flash red above 85% (high-level alarm).
- **sounding.html** — Daily Sounding Entry. Log today's (or any date's)
  reading per tank, either as **% Full** (works immediately),
  **Sounding (m)** for tanks with a factory calibration table, or
  **Volume (m³)** directly.
- **import.html** — Import Stability Sheet. Upload the vessel's stability
  calculation workbook (same format as `R14 Stab Calc ... .xlsx`) and it
  reads the **Sounding Report** sheet client-side (via a vendored copy of
  [SheetJS](js/vendor/xlsx.full.min.js), no server, no upload anywhere),
  matches each row's tank label to the internal tank list (tolerating the
  sheet's own typos, e.g. "DWAYBT" for "DW/BT"), previews matches, and
  writes them straight into the Dashboard as Volume-mode readings for the
  date found on the sheet. Only Fresh Water and Drill Water/Ballast tanks
  are on that report — Fuel Oil/Cement/Mud still need Daily Sounding.
- **settings.html** — Tank Setup & Calibration. Edit each tank's name,
  capacity, specific gravity, and Max Sounding depth; add multi-point
  sounding tables for non-linear tanks; export/restore a JSON backup.
- **history.html** — Logbook of past sounding rounds with computed totals.

## Tank data

Fuel Oil, Drill Water/Ballast, Fresh Water, Foam, Detergent, Dirty Oil and
Bilge Holding tank capacities and full 0.1 m sounding→volume→weight curves
are transcribed directly from the vessel's official stability calculation
workbook (`R14 Stab Calc, dep. Ras Tanura`) — the same tables the Chief
Officer's loading computer uses — so these are authoritative, not
estimates. Hyd. Oil, Lub. Oil and the 4 bulk Mud tanks carry over
capacities from an earlier capacity-plan photo (unchanged, still verified).

Four sets of tanks are **not** in the stability workbook and are flagged
`?` / "verify" on the dashboard and in Settings, with placeholder
capacities:
- **Cement (CMNT) tanks** — the IAMS screen photo's own readings give an
  exact density of 2.80 t/m³ across all three non-zero readings, so that
  part is solid; capacity is estimated at ~59.5 m³ from the 85% high-level
  alarm setpoint shown on screen against No.4 CMNT's alarmed reading.
- **Small MUD interface gauges** — density from the photo (2.50 t/m³)
  matches the bulk Mud tanks, but these are clearly separate, much smaller
  tanks; capacity is a rough placeholder above the highest reading seen.
- **DW FRC** — density from the photo (1.025 t/m³) matches ballast/drill
  water, but its capacity is unconfirmed.

Correct these in Settings once the real capacity plan for them is
available — saving there clears the tank's verify flag.

## Sounding → Volume conversion

- **Calibrated tanks** (marked "· calibrated" on the dashboard — all Fuel
  Oil, Drill Water/Ballast, Fresh Water, Foam, Detergent, Dirty Oil and
  Bilge Holding tanks) use the vessel's official stability-workbook
  sounding tables (`js/soundingTables.js`), 0.10 m increments, "No Trim, No
  Heel" departure condition. Entering a sounding in metres looks up /
  interpolates between these exact points.
- **Not yet calibrated** (Hyd. Oil, Lub. Oil, the 4 bulk Mud tanks, the 4
  Cement tanks, the 4 small MUD gauges, DW FRC): these use **% Full**
  (`Volume = (%/100) × Capacity`, no setup needed) until real sounding
  tables are supplied — upload them and they can be wired in the same way.
  A **Sounding (cm)** mode is also available per tank once a **Max
  Sounding depth** is set in Settings, interpolating linearly between
  empty and full.
- Any calibration (factory or your own) can be overridden per tank in
  Settings — edit the "Advanced calibration" points and Save.

## Draft / Trim / Heel

Click either draft readout (AFT / FWD) or the HEEL row on the Overview
page to enter a value manually. Trim is computed as `Aft draft − Fwd
draft` and shown on a −5…+5 m scale; Heel is stored as entered and shown
on its own −5…+5° scale. This is a simple manual read-out, not a live
draft-sensor feed.

## Backup

Settings → Download Backup exports all tank edits, sounding history and
draft/trim entries as JSON; Restore Backup loads it back (overwrites
current data).
