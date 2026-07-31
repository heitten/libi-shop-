/* Vessel: RAWABI 14 (R14) -- tank list & capacities.
   Fuel Oil, Drill Water/Ballast, Fresh Water, Foam, Detergent, Dirty Oil and
   Bilge Holding tank capacities and full 0.1m sounding->volume->weight curves
   are transcribed directly from the vessel's official stability calculation
   workbook (R14 Stab Calc, dep. Ras Tanura) -- the same tables the ship's Chief
   Officer uses -- so these are authoritative, not estimates.

   Cement (CMNT) tanks and the four small 'MUD' interface gauges seen on the
   onboard IAMS Overview screen are NOT in the stability workbook, so their
   capacities below are placeholders (verified:false):
     - CMNT tanks: the screen photo's own readings give an exact density of
       2.80 t/m3 (141.620 MT / 50.579 m3, 16.848 / 6.017, 2.735 / 0.977 -- all
       2.80) -- that part is solid. No.4 CMNT was in 'High Level Alarm' at the
       85% setpoint shown on screen, so its capacity is estimated at
       50.579 / 0.85 = ~59.5 m3; the same placeholder is used for all four CMNT
       tanks since their true individual capacities aren't available yet.
     - Small MUD gauges: density from the photo is exactly 2.50 t/m3 (matches
       the existing Mud tanks' spgr), but these are clearly much smaller,
       separate tanks (interface/sample, not bulk mud storage) -- capacity is
       a rough 0.30 m3 placeholder, above the highest reading seen (0.190 m3).
     - DW FRC: density from the photo (3.419/3.336 = 1.025 t/m3) matches
       ballast/drill water, but its capacity is an unconfirmed placeholder.
   Please correct these four sets of numbers in Settings once you have the
   real capacity plan for them -- doing so clears their 'verify' flag.
*/

const TANK_GROUPS = [
  { id: 'FUEL_OIL', label: 'Fuel Oil', color: '#e08a3c' },
  { id: 'DRILL_WATER', label: 'Drill Water / Ballast', color: '#3ecf6e' },
  { id: 'FRESH_WATER', label: 'Fresh Water', color: '#3c8ee0' },
  { id: 'CEMENT_MUD', label: 'Cement / Mud', color: '#b5672e' },
  { id: 'OTHER', label: 'Other', color: '#9a7fd1' },
];

const DEFAULT_TANKS = [
  // ---- FUEL OIL ----
  { id: 'fo1_p', group: 'FUEL_OIL', name: 'FO 1.P', frame: '47~61', capacity: 32.37, spgr: 0.85, verified: true },
  { id: 'fo1_s', group: 'FUEL_OIL', name: 'FO 1.S', frame: '47~61', capacity: 32.36, spgr: 0.85, verified: true },
  { id: 'fo_db2_p', group: 'FUEL_OIL', name: 'FO DB2.P', frame: '47~60', capacity: 49.97, spgr: 0.85, verified: true },
  { id: 'fo_db2_s', group: 'FUEL_OIL', name: 'FO DB2.S', frame: '47~60', capacity: 49.97, spgr: 0.85, verified: true },
  { id: 'fo3_p', group: 'FUEL_OIL', name: 'FO 3.P', frame: '34~47', capacity: 50.98, spgr: 0.85, verified: true },
  { id: 'fo3_s', group: 'FUEL_OIL', name: 'FO 3.S', frame: '34~47', capacity: 50.98, spgr: 0.85, verified: true },
  { id: 'fo_db4_p', group: 'FUEL_OIL', name: 'FO DB4.P', frame: '34~47', capacity: 42.52, spgr: 0.85, verified: true },
  { id: 'fo_db4_s', group: 'FUEL_OIL', name: 'FO DB4.S', frame: '34~47', capacity: 42.52, spgr: 0.85, verified: true },
  { id: 'fo5_c', group: 'FUEL_OIL', name: 'FO 5.C', frame: '35~47', capacity: 93.65, spgr: 0.85, verified: true },
  { id: 'fo6_p', group: 'FUEL_OIL', name: 'FO 6.P', frame: '6~15', capacity: 36.66, spgr: 0.85, verified: true },
  { id: 'fo6_s', group: 'FUEL_OIL', name: 'FO 6.S', frame: '6~15', capacity: 36.66, spgr: 0.85, verified: true },
  { id: 'fo_db7_c', group: 'FUEL_OIL', name: 'FO DB7.C', frame: '6~15', capacity: 27.45, spgr: 0.85, verified: true },
  { id: 'fo_day_p', group: 'FUEL_OIL', name: 'FO DAY.P', frame: '47~51', capacity: 11.25, spgr: 0.85, verified: true },
  { id: 'fo_day_s', group: 'FUEL_OIL', name: 'FO DAY.S', frame: '47~51', capacity: 11.25, spgr: 0.85, verified: true },
  // ---- DRILL WATER / BALLAST ----
  { id: 'dw_fp_c', group: 'DRILL_WATER', name: 'Fwd Peak (C)', frame: '81~88', capacity: 84.57, spgr: 1.025, verified: true },
  { id: 'dw1_db_c', group: 'DRILL_WATER', name: 'DW1 DB.C', frame: '47~63', capacity: 72.61, spgr: 1.025, verified: true },
  { id: 'dw2_p', group: 'DRILL_WATER', name: 'DW2.P', frame: '47~63', capacity: 46.15, spgr: 1.025, verified: true },
  { id: 'dw2_s', group: 'DRILL_WATER', name: 'DW2.S', frame: '47~63', capacity: 46.15, spgr: 1.025, verified: true },
  { id: 'dw3_c', group: 'DRILL_WATER', name: 'DW 3.C', frame: '32~47', capacity: 78.62, spgr: 1.025, verified: true },
  { id: 'dw4_p', group: 'DRILL_WATER', name: 'DW 4.P', frame: '32~47', capacity: 46.65, spgr: 1.025, verified: true },
  { id: 'dw4_s', group: 'DRILL_WATER', name: 'DW 4.S', frame: '32~47', capacity: 46.65, spgr: 1.025, verified: true },
  { id: 'dw5_p', group: 'DRILL_WATER', name: 'DW 5.P', frame: '24~32', capacity: 38.61, spgr: 1.025, verified: true },
  { id: 'dw5_s', group: 'DRILL_WATER', name: 'DW 5.S', frame: '24~32', capacity: 38.61, spgr: 1.025, verified: true },
  { id: 'dw6_p', group: 'DRILL_WATER', name: 'DW 6.P', frame: '15~24', capacity: 39.06, spgr: 1.025, verified: true },
  { id: 'dw6_s', group: 'DRILL_WATER', name: 'DW 6.S', frame: '15~24', capacity: 39.06, spgr: 1.025, verified: true },
  { id: 'dw7_p', group: 'DRILL_WATER', name: 'DW 7.P', frame: '6~15', capacity: 29.88, spgr: 1.025, verified: true },
  { id: 'dw7_s', group: 'DRILL_WATER', name: 'DW 7.S', frame: '6~15', capacity: 29.88, spgr: 1.025, verified: true },
  { id: 'aft_pk_p', group: 'DRILL_WATER', name: 'AFT PK.P', frame: 'AE~3', capacity: 18.32, spgr: 1.025, verified: true },
  { id: 'aft_pk_s', group: 'DRILL_WATER', name: 'AFT PK.S', frame: 'AE~3', capacity: 18.32, spgr: 1.025, verified: true },
  { id: 'aft_pk_c', group: 'DRILL_WATER', name: 'AFT PK.C', frame: 'AE~(-2)', capacity: 25.35, spgr: 1.025, verified: true },
  { id: 'dw_frc', group: 'DRILL_WATER', name: 'DW FRC', frame: null, capacity: 6.0, spgr: 1.025, verified: false },
  // ---- FRESH WATER ----
  { id: 'fw1_p', group: 'FRESH_WATER', name: 'FW 1.P', frame: '71~79', capacity: 29.43, spgr: 1, verified: true },
  { id: 'fw1_s', group: 'FRESH_WATER', name: 'FW 1.S', frame: '71~79', capacity: 29.43, spgr: 1, verified: true },
  { id: 'fw_db2_p', group: 'FRESH_WATER', name: 'FW DB 2.P', frame: '63~73', capacity: 33.62, spgr: 1, verified: true },
  { id: 'fw_db2_s', group: 'FRESH_WATER', name: 'FW DB 2.S', frame: '63~73', capacity: 34.23, spgr: 1, verified: true },
  { id: 'fw3_p', group: 'FRESH_WATER', name: 'FW 3.P', frame: '63~71', capacity: 38.3, spgr: 1, verified: true },
  { id: 'fw3_s', group: 'FRESH_WATER', name: 'FW 3.S', frame: '63~71', capacity: 38.3, spgr: 1, verified: true },
  { id: 'fw4_c', group: 'FRESH_WATER', name: 'FW 4.C', frame: '17~32', capacity: 38.33, spgr: 1, verified: true },
  // ---- CEMENT / MUD ----
  { id: 'mud1_p', group: 'CEMENT_MUD', name: 'No.1 Mud Tk (P)', frame: '24~32', capacity: 64.8, spgr: 2.5, verified: true },
  { id: 'mud1_s', group: 'CEMENT_MUD', name: 'No.1 Mud Tk (S)', frame: '24~32', capacity: 64.8, spgr: 2.5, verified: true },
  { id: 'mud2_p', group: 'CEMENT_MUD', name: 'No.2 Mud Tk (P)', frame: '15~24', capacity: 55.5, spgr: 2.5, verified: true },
  { id: 'mud2_s', group: 'CEMENT_MUD', name: 'No.2 Mud Tk (S)', frame: '15~24', capacity: 55.5, spgr: 2.5, verified: true },
  { id: 'cmnt1', group: 'CEMENT_MUD', name: 'No.1 CMNT', frame: null, capacity: 59.5, spgr: 2.8, verified: false },
  { id: 'cmnt2', group: 'CEMENT_MUD', name: 'No.2 CMNT', frame: null, capacity: 59.5, spgr: 2.8, verified: false },
  { id: 'cmnt3', group: 'CEMENT_MUD', name: 'No.3 CMNT', frame: null, capacity: 59.5, spgr: 2.8, verified: false },
  { id: 'cmnt4', group: 'CEMENT_MUD', name: 'No.4 CMNT', frame: null, capacity: 59.5, spgr: 2.8, verified: false },
  { id: 'mudg_1p', group: 'CEMENT_MUD', name: 'No.1(P) MUD', frame: null, capacity: 0.3, spgr: 2.5, verified: false },
  { id: 'mudg_1s', group: 'CEMENT_MUD', name: 'No.1(S) MUD', frame: null, capacity: 0.3, spgr: 2.5, verified: false },
  { id: 'mudg_2p', group: 'CEMENT_MUD', name: 'No.2(P) MUD', frame: null, capacity: 0.3, spgr: 2.5, verified: false },
  { id: 'mudg_2s', group: 'CEMENT_MUD', name: 'No.2(S) MUD', frame: null, capacity: 0.3, spgr: 2.5, verified: false },
  // ---- OTHER ----
  { id: 'dirty_oil_s', group: 'OTHER', name: 'Dirty Oil (S)', frame: '35~40', capacity: 7.59, spgr: 0.9, verified: true },
  { id: 'bilge_p', group: 'OTHER', name: 'Bilge Holding (P)', frame: '35~40', capacity: 7.59, spgr: 0.9, verified: true },
  { id: 'foam_p', group: 'OTHER', name: 'Foam (P)', frame: '51~55', capacity: 11.25, spgr: 1, verified: true },
  { id: 'detergent_s', group: 'OTHER', name: 'Detergent (S)', frame: '51~55', capacity: 11.25, spgr: 1, verified: true },
  { id: 'hydoil_p', group: 'OTHER', name: 'Hyd. Oil (P)', frame: '32~34', capacity: 7.8, spgr: 0.924, verified: true },
  { id: 'luboil_s', group: 'OTHER', name: 'Lub. Oil (S)', frame: '32~34', capacity: 7.8, spgr: 0.924, verified: true },
];
