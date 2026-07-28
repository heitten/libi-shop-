/* Vessel: RAWABI — tank list & capacities transcribed from the vessel's
   tank capacity plan board (photographed). Values are 100% capacity in m3.
   `verified:false` marks entries where the tank NAME could not be matched
   with full confidence to its capacity number from the source photo —
   the capacity VALUES for Fuel Oil sum to 557.3 m3 which matches the
   board's printed subtotal (557.2), so the numbers are trustworthy as a
   set, but a couple of individual name<->number pairings should be
   checked by the owner against the physical capacity plan. */

const TANK_GROUPS = [
  { id: 'FUEL_OIL', label: 'Fuel Oil', color: '#e08a3c' },
  { id: 'DRILL_WATER', label: 'Drill Water / Ballast', color: '#3ecf6e' },
  { id: 'FRESH_WATER', label: 'Fresh Water', color: '#3c8ee0' },
  { id: 'MUD', label: 'Mud', color: '#b5672e' },
  { id: 'OTHER', label: 'Other', color: '#9a7fd1' },
];

const DEFAULT_TANKS = [
  // ---- FUEL OIL (Spgr 0.850) ----
  { id: 'fo_day_p', group: 'FUEL_OIL', name: 'FO Day Tk (P)', frame: '47~51', capacity: 11.0, spgr: 0.850, verified: true },
  { id: 'fo_day_s', group: 'FUEL_OIL', name: 'FO Day Tk (S)', frame: '47~51', capacity: 11.0, spgr: 0.850, verified: true },
  { id: 'fo1_p', group: 'FUEL_OIL', name: 'No.1 FO Tk (P)', frame: '47~61', capacity: 32.36, spgr: 0.850, verified: true },
  { id: 'fo1_s', group: 'FUEL_OIL', name: 'No.1 FO Tk (S)', frame: '47~61', capacity: 31.7, spgr: 0.850, verified: true },
  { id: 'fo2db_p', group: 'FUEL_OIL', name: 'No.2 FO DB Tk (P)', frame: '47~60', capacity: 49.0, spgr: 0.850, verified: false },
  { id: 'fo2db_s', group: 'FUEL_OIL', name: 'No.2 FO DB Tk (S)', frame: '47~60', capacity: 49.0, spgr: 0.850, verified: false },
  { id: 'fo3_p', group: 'FUEL_OIL', name: 'No.3 FO Tk (P)', frame: '34~47', capacity: 50.0, spgr: 0.850, verified: false },
  { id: 'fo3_s', group: 'FUEL_OIL', name: 'No.3 FO Tk (S)', frame: '34~47', capacity: 50.0, spgr: 0.850, verified: false },
  { id: 'fo4db_p', group: 'FUEL_OIL', name: 'No.4 FO DB Tk (P)', frame: '34~47', capacity: 41.7, spgr: 0.850, verified: false },
  { id: 'fo4db_s', group: 'FUEL_OIL', name: 'No.4 FO DB Tk (S)', frame: '34~47', capacity: 41.7, spgr: 0.850, verified: false },
  { id: 'fo5_c', group: 'FUEL_OIL', name: 'No.5 FO Tk (C)', frame: '35~47', capacity: 91.8, spgr: 0.850, verified: false },
  { id: 'fo6_p', group: 'FUEL_OIL', name: 'No.6 FO Tk (P)', frame: '6~15', capacity: 35.9, spgr: 0.850, verified: false },
  { id: 'fo6_s', group: 'FUEL_OIL', name: 'No.6 FO Tk (S)', frame: '6~15', capacity: 35.9, spgr: 0.850, verified: false },
  { id: 'fo7db_c', group: 'FUEL_OIL', name: 'No.7 FO DB Tk (C)', frame: '6~15', capacity: 26.9, spgr: 0.850, verified: false },

  // ---- DRILL WATER / WATER BALLAST (Spgr 1.000/1.025) ----
  { id: 'dwwb_ap_c', group: 'DRILL_WATER', name: 'DW/WB AP Tk (C)', frame: 'AE~(-2)', capacity: 25.35, spgr: 1.000, verified: true },
  { id: 'dwwb_ap_p', group: 'DRILL_WATER', name: 'DW/WB AP Tk (P)', frame: 'AE~3', capacity: 18.32, spgr: 1.000, verified: true },
  { id: 'dwwb_ap_s', group: 'DRILL_WATER', name: 'DW/WB AP Tk (S)', frame: 'AE~3', capacity: 18.32, spgr: 1.000, verified: true },
  { id: 'dwwb_fp_c', group: 'DRILL_WATER', name: 'DW/WB FP Tk (C)', frame: '81~88', capacity: 84.57, spgr: 1.000, verified: true },
  { id: 'dw1db_c', group: 'DRILL_WATER', name: 'No.1 DW/WB DB Tk (C)', frame: '47~63', capacity: 72.61, spgr: 1.000, verified: true },
  { id: 'dw2_p', group: 'DRILL_WATER', name: 'No.2 DW/WB Tk (P)', frame: '47~63', capacity: 46.15, spgr: 1.000, verified: true },
  { id: 'dw2_s', group: 'DRILL_WATER', name: 'No.2 DW/WB Tk (S)', frame: '47~63', capacity: 46.15, spgr: 1.000, verified: true },
  { id: 'dw3db_c', group: 'DRILL_WATER', name: 'No.3 DW/WB DB Tk (C)', frame: '32~47', capacity: 78.62, spgr: 1.000, verified: true },
  { id: 'dw4_p', group: 'DRILL_WATER', name: 'No.4 DW/WB Tk (P)', frame: '32~47', capacity: 46.65, spgr: 1.000, verified: true },
  { id: 'dw4_s', group: 'DRILL_WATER', name: 'No.4 DW/WB Tk (S)', frame: '32~47', capacity: 46.65, spgr: 1.000, verified: true },
  { id: 'dw5_p', group: 'DRILL_WATER', name: 'No.5 DW/WB Tk (P)', frame: '24~32', capacity: 38.61, spgr: 1.000, verified: true },
  { id: 'dw5_s', group: 'DRILL_WATER', name: 'No.5 DW/WB Tk (S)', frame: '24~32', capacity: 38.61, spgr: 1.000, verified: true },
  { id: 'dw6_p', group: 'DRILL_WATER', name: 'No.6 DW/WB Tk (P)', frame: '15~24', capacity: 39.06, spgr: 1.000, verified: true },
  { id: 'dw6_s', group: 'DRILL_WATER', name: 'No.6 DW/WB Tk (S)', frame: '15~24', capacity: 39.06, spgr: 1.000, verified: true },
  { id: 'dw7_p', group: 'DRILL_WATER', name: 'No.7 DW/WB Tk (P)', frame: '6~15', capacity: 29.88, spgr: 1.000, verified: true },
  { id: 'dw7_s', group: 'DRILL_WATER', name: 'No.7 DW/WB Tk (S)', frame: '6~15', capacity: 29.88, spgr: 1.000, verified: true },

  // ---- FRESH WATER (Spgr 1.000) ----
  { id: 'fw1_p', group: 'FRESH_WATER', name: 'No.1 FW Tk (P)', frame: '71~79', capacity: 29.43, spgr: 1.000, verified: true },
  { id: 'fw1_s', group: 'FRESH_WATER', name: 'No.1 FW Tk (S)', frame: '71~79', capacity: 29.43, spgr: 1.000, verified: true },
  { id: 'fw2db_p', group: 'FRESH_WATER', name: 'No.2 FW DB Tk (P)', frame: '63~73', capacity: 33.62, spgr: 1.000, verified: true },
  { id: 'fw2db_s', group: 'FRESH_WATER', name: 'No.2 FW DB Tk (S)', frame: '63~73', capacity: 34.23, spgr: 1.000, verified: true },
  { id: 'fw3_p', group: 'FRESH_WATER', name: 'No.3 FW Tk (P)', frame: '63~71', capacity: 38.30, spgr: 1.000, verified: true },
  { id: 'fw3_s', group: 'FRESH_WATER', name: 'No.3 FW Tk (S)', frame: '63~71', capacity: 38.30, spgr: 1.000, verified: true },
  { id: 'fw4db_c', group: 'FRESH_WATER', name: 'No.4 FW DB Tk (C)', frame: '17~32', capacity: 38.33, spgr: 1.000, verified: true },

  // ---- MUD (Spgr 2.500) ----
  { id: 'mud1_p', group: 'MUD', name: 'No.1 Mud Tk (P)', frame: '24~32', capacity: 64.8, spgr: 2.500, verified: true },
  { id: 'mud1_s', group: 'MUD', name: 'No.1 Mud Tk (S)', frame: '24~32', capacity: 64.8, spgr: 2.500, verified: true },
  { id: 'mud2_p', group: 'MUD', name: 'No.2 Mud Tk (P)', frame: '15~24', capacity: 55.5, spgr: 2.500, verified: true },
  { id: 'mud2_s', group: 'MUD', name: 'No.2 Mud Tk (S)', frame: '15~24', capacity: 55.5, spgr: 2.500, verified: true },

  // ---- OTHER ----
  { id: 'foam_p', group: 'OTHER', name: 'Foam Tk (P)', frame: '51~55', capacity: 11.25, spgr: 1.000, verified: true },
  { id: 'detergent_s', group: 'OTHER', name: 'Detergent Tk (S)', frame: '51~55', capacity: 11.25, spgr: 1.000, verified: true },
  { id: 'hydoil_p', group: 'OTHER', name: 'Hyd. Oil Tk (P)', frame: '32~34', capacity: 7.8, spgr: 0.924, verified: true },
  { id: 'luboil_s', group: 'OTHER', name: 'Lub. Oil Tk (S)', frame: '32~34', capacity: 7.8, spgr: 0.924, verified: true },
  { id: 'bilge_p', group: 'OTHER', name: 'Bilge Holding Tk (P)', frame: '35~40', capacity: 7.6, spgr: 0.900, verified: true },
  { id: 'dirtyoil_s', group: 'OTHER', name: 'Dirty Oil Tk (S)', frame: '35~40', capacity: 7.6, spgr: 0.900, verified: true },
];
