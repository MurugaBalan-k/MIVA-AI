// MIVA AI Governed Manufacturing Knowledge Base & Production Lines Seed Data
// Specifically authored for L&T Shop-Floor Operations

const PRODUCTION_LINES = [
  {
    id: "line-01",
    name: "Valve Manufacturing Line",
    code: "LINE 01",
    stages: ["CNC", "Machining", "Testing"],
    description: "High-pressure industrial gate, globe, and check valves manufacturing cell.",
    supervisor: "Muruga Balan",
    status: "Operational",
    machines: [
      { id: "m-01-1", name: "CNC Machine", code: "CNC-VALVE-01", status: "Running", temp: "68°C", vibration: "0.24 mm/s", lastService: "2026-08-14" },
      { id: "m-01-2", name: "Valve Machining Center", code: "VMC-400-A", status: "Running", temp: "74°C", vibration: "0.31 mm/s", lastService: "2026-09-02" },
      { id: "m-01-3", name: "Pressure Testing Unit", code: "PTU-500-BAR", status: "Standby", temp: "28°C", pressure: "350 bar", lastService: "2026-07-28" },
      { id: "m-01-4", name: "Inspection Station", code: "INSP-CMM-01", status: "Active", accuracy: "0.002 mm", lastService: "2026-09-10" }
    ]
  },
  {
    id: "line-02",
    name: "Pump Manufacturing Line",
    code: "LINE 02",
    stages: ["Machining", "Assembly", "Testing"],
    description: "Multistage centrifugal and slurry industrial pumps manufacturing line.",
    supervisor: "Pon SubbuRaj",
    status: "Operational",
    machines: [
      { id: "m-02-1", name: "Machining Center", code: "HMC-PUMP-02", status: "Running", temp: "71°C", vibration: "0.28 mm/s", lastService: "2026-08-19" },
      { id: "m-02-2", name: "Assembly Station", code: "ASM-PUMP-ST1", status: "Active", torque: "185 Nm", lastService: "2026-09-05" },
      { id: "m-02-3", name: "Pressure Testing Unit", code: "HYD-TEST-PUMP", status: "Running", temp: "32°C", pressure: "120 bar", lastService: "2026-08-30" }
    ]
  },
  {
    id: "line-03",
    name: "Gearbox Manufacturing Line",
    code: "LINE 03",
    stages: ["Gear Machining", "Assembly", "Testing"],
    description: "Heavy planetary and helical industrial reduction gearboxes production line.",
    supervisor: "Winson Immanuel",
    status: "Operational",
    machines: [
      { id: "m-03-1", name: "Gear Cutting Machine", code: "GEAR-HOB-03", status: "Running", speed: "1200 rpm", temp: "65°C", lastService: "2026-08-25" },
      { id: "m-03-2", name: "Assembly Station", code: "ASM-GB-ST2", status: "Active", backlash: "0.04 mm", lastService: "2026-09-12" },
      { id: "m-03-3", name: "Testing Station", code: "DYN-TEST-GB", status: "Running", load: "75 kW", temp: "88°C", lastService: "2026-09-01" }
    ]
  },
  {
    id: "line-04",
    name: "Heavy Fabrication Line",
    code: "LINE 04",
    stages: ["Cutting", "Welding", "Fabrication", "Inspection"],
    description: "Heavy structural pressure vessel shells and nuclear reactor cladding components.",
    supervisor: "Muruga Balan",
    status: "Operational",
    machines: [
      { id: "m-04-1", name: "Cutting Machine", code: "PLASMA-CNC-HD", status: "Running", current: "260 A", torchHeight: "3.5 mm", lastService: "2026-08-11" },
      { id: "m-04-2", name: "Welding Station", code: "SAW-SUBMERGED-01", status: "Running", voltage: "32 V", wireSpeed: "4.2 m/min", lastService: "2026-09-15" },
      { id: "m-04-3", name: "Fabrication Station", code: "HYD-PRESS-2000T", status: "Active", pressure: "1800 ton", lastService: "2026-08-04" },
      { id: "m-04-4", name: "Inspection Station", code: "NDT-XRAY-ST4", status: "Active", radiationLevel: "Nominal", lastService: "2026-09-20" }
    ]
  },
  {
    id: "line-05",
    name: "Electrical Panel / Control Systems Line",
    code: "LINE 05",
    stages: ["Panel Assembly", "Wiring", "Testing"],
    description: "Medium voltage switchgear, MCC panels, and automated PLC control enclosures.",
    supervisor: "Roshnica",
    status: "Operational",
    machines: [
      { id: "m-05-1", name: "Panel Assembly Station", code: "PNL-MECH-ASM", status: "Active", torqueLimit: "45 Nm", lastService: "2026-09-08" },
      { id: "m-05-2", name: "Wiring Station", code: "AUTO-HARNESS-W1", status: "Running", wireGauge: "1.5-16mm", lastService: "2026-09-18" },
      { id: "m-05-3", name: "Testing Station", code: "HV-DIELECTRIC-5KV", status: "Active", testVoltage: "5.0 kV", lastService: "2026-09-22" }
    ]
  }
];

const GOVERNED_DOCUMENTS = [
  // LINE 01 - VALVE
  {
    document_id: "DOC-VLV-SOP-001",
    line_id: "line-01",
    machine_id: "m-01-2",
    title: "Valve Machining Center Cooling & Temperature Alarm Procedure",
    code: "WI_001_Temperature_Alarm.pdf",
    type: "Work Instruction",
    revision: "Rev 03",
    effective_date: "2026-04-01",
    status: "ACTIVE",
    file_url: "/uploads/WI_001_Temperature_Alarm.pdf",
    created_at: "2026-04-01T08:00:00Z",
    summary: "Standard operating actions to reduce temperature and inspect cooling pump for valve machining centers.",
    pages: [
      {
        page: 1,
        section: "1.0 Purpose & Scope",
        text: "This work instruction defines mandatory corrective actions when spindle or machining chamber temperature exceeds 70°C in the Valve Machining Center (VMC-400-A)."
      },
      {
        page: 2,
        section: "3.2 Temperature Reduction Procedure",
        text: "When valve machine temperature reaches or exceeds 75°C: 1. Check the coolant flow and inspect the cooling system. 2. Reduce the machine load and monitor the temperature. 3. Inspect coolant filters for swarf buildup and ensure reservoir level is above minimum line. 4. If temperature remains high, follow the approved cooling procedure and notify shop supervisor."
      },
      {
        page: 3,
        section: "4.1 Emergency Cool-Down Limit",
        text: "At 90°C thermal alarm trip, machine executes automatic spindle feed hold. Do not attempt manual bypass. Verify external auxiliary chiller circulation."
      }
    ],
    chunks: [
      {
        id: "chk-vlv-01",
        page: 2,
        section: "3.2",
        keywords: ["temperature", "reduce temperature", "cooling", "valve machine", "coolant flow", "overheating", "high temp"],
        text: "Check the coolant flow and inspect the cooling system. Reduce the machine load and monitor the temperature. If it remains high, follow the approved cooling procedure.",
        confidence: 0.98
      }
    ]
  },
  {
    document_id: "DOC-VLV-SOP-001-OLD",
    line_id: "line-01",
    machine_id: "m-01-2",
    title: "Valve Machining Center Cooling Procedure (Superseded)",
    code: "WI_001_Temperature_Alarm_v2.pdf",
    type: "Work Instruction",
    revision: "Rev 02",
    effective_date: "2024-01-15",
    status: "SUPERSEDED",
    file_url: "/uploads/WI_001_Temperature_Alarm_v2.pdf",
    created_at: "2024-01-15T08:00:00Z",
    summary: "Superseded cooling procedure - do not use for current operations.",
    pages: [
      {
        page: 1,
        section: "Legacy Cooling Protocol",
        text: "Old procedure: Turn off machine for 30 minutes. Deprecated as of Rev 03."
      }
    ],
    chunks: [
      {
        id: "chk-vlv-old",
        page: 1,
        section: "Legacy",
        keywords: ["cooling", "temperature", "old"],
        text: "Old superseded cooling method: idle spindle for 30 minutes.",
        confidence: 0.40
      }
    ]
  },
  {
    document_id: "DOC-VLV-SOP-002",
    line_id: "line-01",
    machine_id: "m-01-1",
    title: "CNC Valve Turning Lathe Startup & Calibration SOP",
    code: "SOP-CNC-START-01.pdf",
    type: "SOP",
    revision: "Rev 04",
    effective_date: "2026-02-10",
    status: "ACTIVE",
    file_url: "/uploads/SOP-CNC-START-01.pdf",
    created_at: "2026-02-10T09:30:00Z",
    summary: "Standard morning startup checklist and axis zeroing procedure for CNC Valve machine.",
    pages: [
      {
        page: 1,
        section: "2.1 Startup Sequence",
        text: "1. Turn on main isolator switch on rear cabinet. 2. Release emergency stop button and wait for CNC controller boot. 3. Perform home position reference return on X and Z axes. 4. Verify hydraulic pressure gauge reads 45 ± 2 bar before chuck clamping."
      }
    ],
    chunks: [
      {
        id: "chk-vlv-start",
        page: 1,
        section: "2.1",
        keywords: ["valve machine startup", "cnc startup", "startup procedure", "turn on valve machine"],
        text: "1. Switch on main isolator on rear panel.\n2. Release emergency stop and allow controller to initialize.\n3. Perform axis homing (X, Z).\n4. Check hydraulic pressure gauge displays 45 bar before loading workpiece.",
        confidence: 0.96
      }
    ]
  },
  {
    document_id: "DOC-VLV-WI-003",
    line_id: "line-01",
    machine_id: "m-01-2",
    title: "Valve Hydraulic Filter Replacement Work Instruction",
    code: "WI-VLV-FLT-09.pdf",
    type: "Work Instruction",
    revision: "Rev 02",
    effective_date: "2025-11-20",
    status: "ACTIVE",
    file_url: "/uploads/WI-VLV-FLT-09.pdf",
    created_at: "2025-11-20T10:00:00Z",
    summary: "Step-by-step instructions for hydraulic and coolant return filter cartridge replacement.",
    pages: [
      {
        page: 1,
        section: "Filter Replacement Protocol",
        text: "Isolate electrical feed (LOTO). Depressurize hydraulic reservoir via manual bleeder valve. Unscrew filter canister using tool wrench W-32. Inspect O-ring seal for nicks. Install replacement micron cartridge (Part V-FLT-88) and torque housing to 35 Nm."
      }
    ],
    chunks: [
      {
        id: "chk-vlv-flt",
        page: 1,
        section: "Procedure",
        keywords: ["valve filter", "replace valve filter", "filter replacement", "replacing valve filter"],
        text: "1. Apply Lockout/Tagout (LOTO) to hydraulic power pack.\n2. Depressurize the reservoir using the manual bleed valve.\n3. Remove filter bowl with wrench W-32 and extract old cartridge.\n4. Clean housing, lubricate new O-ring with hydraulic oil ISO VG 46.\n5. Insert new cartridge (Part V-FLT-88) and torque to 35 Nm.",
        confidence: 0.97
      }
    ]
  },
  {
    document_id: "DOC-VLV-TEST-004",
    line_id: "line-01",
    machine_id: "m-01-3",
    title: "High Pressure Hydrostatic Valve Shell Testing Protocol",
    code: "SOP-VLV-HYDRO-350.pdf",
    type: "SOP",
    revision: "Rev 03",
    effective_date: "2026-01-08",
    status: "ACTIVE",
    file_url: "/uploads/SOP-VLV-HYDRO-350.pdf",
    created_at: "2026-01-08T11:00:00Z",
    summary: "API 598 hydrostatic shell and seat leak testing standard parameters.",
    pages: [
      {
        page: 1,
        section: "Hydrostatic Testing Steps",
        text: "Clamp valve body securely in test fixture. Fill cavity with demineralized water ensuring air vent is open. Pressurize to 1.5x design rating (350 bar) and hold for 180 seconds. Check gland packing and body joint for zero visible leakage."
      }
    ],
    chunks: [
      {
        id: "chk-vlv-test",
        page: 1,
        section: "API 598",
        keywords: ["pressure test", "valve pressure testing", "hydrostatic test", "valve leak test"],
        text: "1. Secure valve body in the hydraulic test bench fixture.\n2. Fill completely with test water while venting entrapped air.\n3. Ramp pressure up to 350 bar at 10 bar/sec rate.\n4. Hold pressure for 180 seconds and inspect seal perimeter for zero seepage.",
        confidence: 0.95
      }
    ]
  },

  // LINE 02 - PUMP
  {
    document_id: "DOC-PMP-SOP-001",
    line_id: "line-02",
    machine_id: "m-02-3",
    title: "Centrifugal Pump Pressure & Flow Verification Protocol",
    code: "SOP-PUMP-TEST-01.pdf",
    type: "SOP",
    revision: "Rev 02",
    effective_date: "2026-03-01",
    status: "ACTIVE",
    file_url: "/uploads/SOP-PUMP-TEST-01.pdf",
    created_at: "2026-03-01T08:30:00Z",
    summary: "Standard method to check pump pressure, head, and cavitation thresholds.",
    pages: [
      {
        page: 1,
        section: "Pressure Check Instructions",
        text: "How should the pump pressure be checked: 1. Confirm suction isolation valve is 100% open to prevent cavitation. 2. Verify pressure gauge calibration sticker is within valid date. 3. Start motor and run at nominal speed for 2 minutes to stabilize. 4. Record discharge gauge reading across closed and open discharge throttling positions (nominal: 120 ± 5 bar)."
      }
    ],
    chunks: [
      {
        id: "chk-pmp-press",
        page: 1,
        section: "Verification",
        keywords: ["pump pressure", "how should the pump pressure be checked", "check pump pressure", "pump pressure checked"],
        text: "1. Ensure suction valve is fully open to avoid cavitation.\n2. Inspect calibrated digital manometer at discharge port.\n3. Run drive motor for 2 minutes at rated RPM to stabilize.\n4. Check discharge pressure reads 120 ± 5 bar across nominal flow.",
        confidence: 0.97
      }
    ]
  },
  {
    document_id: "DOC-PMP-WI-002",
    line_id: "line-02",
    machine_id: "m-02-2",
    title: "Pump Mechanical Seal & Impeller Alignment Guide",
    code: "WI-PMP-SEAL-05.pdf",
    type: "Work Instruction",
    revision: "Rev 01",
    effective_date: "2025-10-15",
    status: "ACTIVE",
    file_url: "/uploads/WI-PMP-SEAL-05.pdf",
    created_at: "2025-10-15T09:00:00Z",
    summary: "Assembly instructions for dual cartridge mechanical seals and impeller dial-indicator alignment.",
    pages: [
      {
        page: 1,
        section: "Impeller Alignment",
        text: "Mount dial indicator on shaft collar. Rotate shaft by hand and check radial runout is under 0.03 mm. Set seal spring compression using gauge spacer."
      }
    ],
    chunks: [
      {
        id: "chk-pmp-seal",
        page: 1,
        section: "Alignment",
        keywords: ["pump impeller", "pump seal", "pump assembly", "impeller alignment"],
        text: "1. Mount magnetic base dial indicator on drive shaft.\n2. Measure radial runout (< 0.03 mm allowed tolerance).\n3. Position cartridge seal clips and torque gland nuts evenly in criss-cross pattern.",
        confidence: 0.94
      }
    ]
  },

  // LINE 03 - GEARBOX
  {
    document_id: "DOC-GB-SOP-001",
    line_id: "line-03",
    machine_id: "m-03-3",
    title: "Industrial Gearbox Inspection & Dynamic Testing Procedure",
    code: "SOP_Gearbox_Maintenance.pdf",
    type: "SOP",
    revision: "Rev 03",
    effective_date: "2026-02-18",
    status: "ACTIVE",
    file_url: "/uploads/SOP_Gearbox_Maintenance.pdf",
    created_at: "2026-02-18T08:00:00Z",
    summary: "Comprehensive gearbox inspection, bearing acoustic measurement, and backlash verification.",
    pages: [
      {
        page: 1,
        section: "Gearbox Inspection Procedure",
        text: "What is the gearbox inspection procedure: 1. Isolate main drive motor and lock disconnect switch. 2. Visually inspect casing and split joints for lubricant seepage. 3. Check oil level via sight glass and examine magnetic drain plug for metal flakes. 4. Measure tooth contact pattern using Prussian blue and record backlash across 4 quadrants (tolerance: 0.035 - 0.050 mm). 5. Monitor bearing vibration and thermal profile during 30-minute no-load test."
      }
    ],
    chunks: [
      {
        id: "chk-gb-insp",
        page: 1,
        section: "Inspection",
        keywords: ["gearbox inspection", "gearbox inspection procedure", "what is the gearbox inspection procedure", "inspect gearbox"],
        text: "1. Isolate gearbox drive and engage safety lockout.\n2. Inspect casing seals and split joints for oil seepage.\n3. Check oil level in sight glass and inspect magnetic sump plug.\n4. Measure gear tooth backlash across 4 quadrants with dial gauge.\n5. Run test cycle to verify bearing acoustic vibration is under 1.8 mm/s.",
        confidence: 0.98
      }
    ]
  },
  {
    document_id: "DOC-GB-WI-002",
    line_id: "line-03",
    machine_id: "m-03-1",
    title: "Gearbox Auxiliary Cooling Pump Replacement Procedure",
    code: "WI-GB-PUMP-GCP204.pdf",
    type: "Work Instruction",
    revision: "Rev 02",
    effective_date: "2026-03-11",
    status: "ACTIVE",
    file_url: "/uploads/WI-GB-PUMP-GCP204.pdf",
    created_at: "2026-03-11T10:15:00Z",
    summary: "Replacement steps for Gearbox Cooling Pump (Part No. GCP-204).",
    pages: [
      {
        page: 1,
        section: "Cooling Pump Replacement",
        text: "Equipment: Gearbox Cooling Pump (Part No. GCP-204). Replacement procedure: 1. Isolate power supply and tag breaker. 2. Drain coolant into clean disposal drum. 3. Remove mounting flange bolts. 4. Install new replacement pump and check shaft coupling alignment. 5. Refill coolant to marked level and perform 10-minute leak-check run."
      }
    ],
    chunks: [
      {
        id: "chk-gb-pump",
        page: 1,
        section: "Replacement",
        keywords: ["cooling pump", "gearbox cooling pump", "gcp-204", "replace cooling pump", "gearbox pump replacement"],
        text: "This is the Gearbox Cooling Pump (Part No. GCP-204).\n\nReplacement procedure:\n1. Isolate power supply.\n2. Drain coolant into designated container.\n3. Remove mounting bolts.\n4. Install new pump and check alignment.\n5. Refill coolant and test run.",
        confidence: 0.99
      }
    ]
  },

  // LINE 04 - HEAVY FABRICATION
  {
    document_id: "DOC-FAB-SOP-001",
    line_id: "line-04",
    machine_id: "m-04-2",
    title: "Heavy Structural Welding PPE and Pre-Heating Standard (ASME Sec IX)",
    code: "SOP-WELD-PPE-04.pdf",
    type: "SOP",
    revision: "Rev 05",
    effective_date: "2026-01-20",
    status: "ACTIVE",
    file_url: "/uploads/SOP-WELD-PPE-04.pdf",
    created_at: "2026-01-20T08:45:00Z",
    summary: "Safety requirements, mandatory PPE, and preheat temperature verification for submerged arc welding.",
    pages: [
      {
        page: 1,
        section: "Mandatory PPE for Welding",
        text: "What PPE is required during welding: 1. Auto-darkening welding helmet (Shade DIN 10-12 minimum). 2. Flame-retardant split leather welding jacket and heavy-duty split cowhide gauntlet gloves. 3. Steel-toe safety boots with metatarsal heat guards (EN ISO 20345). 4. Clear safety glasses with UV side shields worn under the helmet. 5. Fume particulate respirator (P3/FFP3 rated) in confined fabrication bays."
      }
    ],
    chunks: [
      {
        id: "chk-fab-ppe",
        page: 1,
        section: "PPE",
        keywords: ["what ppe is required during welding", "ppe welding", "welding safety", "welding ppe", "ppe required during welding"],
        text: "1. Auto-darkening welding helmet (Shade DIN 10–12).\n2. Flame-retardant split leather jacket and gauntlet gloves.\n3. Steel-toe safety boots with metatarsal protection.\n4. Clear UV-filtering safety glasses worn beneath helmet.\n5. FFP3 fume extraction respirator in closed bays.",
        confidence: 0.98
      }
    ]
  },
  {
    document_id: "DOC-FAB-WI-002",
    line_id: "line-04",
    machine_id: "m-04-1",
    title: "CNC Plasma Torch Height & Bevel Cut Setting Calibration",
    code: "WI-PLASMA-CUT-02.pdf",
    type: "Work Instruction",
    revision: "Rev 02",
    effective_date: "2025-12-05",
    status: "ACTIVE",
    file_url: "/uploads/WI-PLASMA-CUT-02.pdf",
    created_at: "2025-12-05T11:00:00Z",
    summary: "Arc voltage control and pierce delay settings for 40mm carbon steel plates.",
    pages: [
      {
        page: 1,
        section: "Calibration",
        text: "Verify initial height sensor (IHS) ohmic contact. Set pierce height to 7.0 mm with 1.8 second delay before dropping to 3.5 mm cutting height at 260 Amps."
      }
    ],
    chunks: [
      {
        id: "chk-fab-plasma",
        page: 1,
        section: "Plasma Cut",
        keywords: ["plasma cutting", "cutting machine", "torch height", "heavy fabrication cutting"],
        text: "1. Calibrate ohmic initial height sensing probe.\n2. Set pierce height to 7.0 mm with 1.8s dwell time.\n3. Transition torch to 3.5 mm cutting distance at 260 A.",
        confidence: 0.93
      }
    ]
  },

  // LINE 05 - ELECTRICAL PANEL
  {
    document_id: "DOC-ELEC-SOP-001",
    line_id: "line-05",
    machine_id: "m-05-3",
    title: "Medium Voltage Electrical Panel Dielectric & Insulation Testing SOP",
    code: "SOP-ELEC-TEST-05.pdf",
    type: "SOP",
    revision: "Rev 03",
    effective_date: "2026-03-05",
    status: "ACTIVE",
    file_url: "/uploads/SOP-ELEC-TEST-05.pdf",
    created_at: "2026-03-05T09:15:00Z",
    summary: "Step-by-step dielectric high-potential (Hi-Pot) and insulation resistance testing standard (IEC 61439-1).",
    pages: [
      {
        page: 1,
        section: "Panel Testing Steps",
        text: "How should the electrical panel be tested: 1. Confirm panel main incomer breaker is racked out and disconnected. 2. Verify all sensitive electronic PLC cards and surge arresters are unplugged or bypassed. 3. Perform 1000V Megger insulation resistance test (must exceed 100 MΩ). 4. Apply 2.5 kV AC dielectric test between phases and earth for 60 seconds. 5. Discharge busbars completely to earth before handling."
      }
    ],
    chunks: [
      {
        id: "chk-elec-test",
        page: 1,
        section: "IEC 61439",
        keywords: ["how should the electrical panel be tested", "electrical panel tested", "test electrical panel", "panel testing"],
        text: "1. Rack out and lock the main incomer circuit breaker.\n2. Disconnect or bridge sensitive PLC controllers and surge suppressors.\n3. Conduct 1000V DC Megger test (minimum 100 MΩ requirement).\n4. Apply 2.5 kV AC Hi-Pot test for 60 seconds between phases and earth ground.\n5. Discharge all stored capacitive charge to ground before touching.",
        confidence: 0.98
      }
    ]
  },
  {
    document_id: "DOC-ELEC-WI-002",
    line_id: "line-05",
    machine_id: "m-05-2",
    title: "Control Panel Ferrule Numbering & Torque Markings Protocol",
    code: "WI-ELEC-WIRE-08.pdf",
    type: "Work Instruction",
    revision: "Rev 01",
    effective_date: "2025-09-14",
    status: "ACTIVE",
    file_url: "/uploads/WI-ELEC-WIRE-08.pdf",
    created_at: "2025-09-14T10:30:00Z",
    summary: "Terminal torque specs and wire identification markings for safety compliance.",
    pages: [
      {
        page: 1,
        section: "Torque Specs",
        text: "Torque M4 terminal screws to 1.2 Nm using calibrated torque driver. Apply yellow torque seal indicator stripe across screw head."
      }
    ],
    chunks: [
      {
        id: "chk-elec-torque",
        page: 1,
        section: "Torque",
        keywords: ["wiring torque", "electrical panel wiring", "ferrule", "terminal torque"],
        text: "1. Terminate ferruled conductor in spring/screw cage.\n2. Tighten M4 terminals to 1.2 Nm using certified torque screwdriver.\n3. Apply inspection seal witness mark across terminal head.",
        confidence: 0.92
      }
    ]
  }
];

const BENCHMARK_EVALUATION_QUESTIONS = [
  {
    id: "eval-01",
    lineId: "line-01",
    category: "Valve Line",
    question: "What is the valve machine startup procedure?",
    expectedKeyTerms: ["main isolator", "emergency stop", "axis homing", "hydraulic pressure 45 bar"],
    targetDoc: "SOP-CNC-START-01.pdf"
  },
  {
    id: "eval-02",
    lineId: "line-01",
    category: "Valve Line",
    question: "How can I reduce the temperature in the valve machine?",
    expectedKeyTerms: ["coolant flow", "cooling system", "reduce machine load", "cooling procedure"],
    targetDoc: "WI_001_Temperature_Alarm.pdf"
  },
  {
    id: "eval-03",
    lineId: "line-02",
    category: "Pump Line",
    question: "How should the pump pressure be checked?",
    expectedKeyTerms: ["suction valve fully open", "discharge manometer", "run 2 minutes", "120 bar"],
    targetDoc: "SOP-PUMP-TEST-01.pdf"
  },
  {
    id: "eval-04",
    lineId: "line-03",
    category: "Gearbox Line",
    question: "What is the gearbox inspection procedure?",
    expectedKeyTerms: ["isolate drive motor", "seepage", "oil level sight glass", "backlash", "bearing vibration"],
    targetDoc: "SOP_Gearbox_Maintenance.pdf"
  },
  {
    id: "eval-05",
    lineId: "line-04",
    category: "Heavy Fabrication",
    question: "What PPE is required during welding?",
    expectedKeyTerms: ["welding helmet shade 10-12", "leather jacket", "gauntlet gloves", "safety boots", "ffp3 respirator"],
    targetDoc: "SOP-WELD-PPE-04.pdf"
  },
  {
    id: "eval-06",
    lineId: "line-05",
    category: "Electrical Panel",
    question: "How should the electrical panel be tested?",
    expectedKeyTerms: ["rack out incomer breaker", "disconnect plc", "1000v megger 100 megohms", "2.5 kv hi-pot", "discharge to ground"],
    targetDoc: "SOP-ELEC-TEST-05.pdf"
  },
  {
    id: "eval-07",
    lineId: "line-03",
    category: "Multimodal Image",
    question: "Identify the component shown in the cooling pump image.",
    isImageQuestion: true,
    imageRef: "cooling_pump",
    expectedKeyTerms: ["Gearbox Cooling Pump", "Part No. GCP-204", "replacement procedure"],
    targetDoc: "WI-GB-PUMP-GCP204.pdf"
  },
  {
    id: "eval-08",
    lineId: "line-01",
    category: "Revision Filtering",
    question: "Check cooling temperature procedure for valve machine (testing superseded vs active handling).",
    expectedKeyTerms: ["Rev 03 ACTIVE prioritized", "Superseded Rev 02 excluded"],
    targetDoc: "WI_001_Temperature_Alarm.pdf"
  }
];

const INITIAL_RISK_ALERTS = [
  {
    id: "alert-101",
    user: "Winson Immanuel",
    userId: "u-01",
    question: "How to break this machine?",
    line: "Valve Manufacturing",
    machine: "CNC Machine",
    timestamp: "2026-09-27T14:12:00Z",
    riskLevel: "HIGH-RISK REQUEST",
    status: "New",
    details: "Harmful intent to damage equipment detected by safety classifier. System provided safe refusal."
  },
  {
    id: "alert-102",
    user: "Karthik R",
    userId: "u-08",
    question: "Bypass electrical interlock and disable emergency safety trip switch",
    line: "Electrical Panel / Control Systems",
    machine: "Testing Station",
    timestamp: "2026-09-26T16:45:00Z",
    riskLevel: "HIGH-RISK REQUEST",
    status: "Under Review",
    details: "Attempted safety interlock bypass instruction. Blocked and logged."
  }
];

const INITIAL_WORK_INSTRUCTIONS = [
  {
    id: "wi-draft-201",
    title: "Draft Work Instruction: Valve Filter Cartridge Replacement",
    user: "Winson Immanuel",
    requestedAt: "2026-09-27T10:15:00Z",
    line: "Valve Manufacturing Line",
    machine: "Valve Machining Center (VMC-400-A)",
    status: "DRAFT",
    purpose: "Routine replacement of return-line hydraulic filter element to ensure uninterrupted coolant filtration.",
    requiredTools: ["Filter canister wrench W-32", "Torque wrench (0-50 Nm)", "Clean lint-free catch pan", "ISO VG 46 lubricating fluid"],
    safety: ["Isolate electrical power and apply Lockout/Tagout (LOTO).", "Verify hydraulic gauge indicates 0 bar residual pressure.", "Wear nitrile protective gloves and safety spectacles."],
    procedure: [
      "Position collection tray directly beneath filter housing.",
      "Open manual depressurization valve to vent tank pressure.",
      "Unthread filter canister using wrench W-32.",
      "Extract depleted filter element and inspect housing bowl for swarf particulates.",
      "Lubricate replacement seal ring with clean ISO VG 46 oil and fit new cartridge (V-FLT-88).",
      "Hand-tighten canister until sealed, then torque to exactly 35 Nm."
    ],
    inspection: ["Perform 5-minute pressure cycle test and inspect canister mating seam for weeping.", "Check oil reservoir level."],
    completion: ["Log cartridge batch code in machine logbook and remove LOTO tag."]
  }
];

const SAMPLE_EQUIPMENT_IMAGES = [
  {
    id: "img-01",
    title: "Gearbox Cooling Pump (GCP-204)",
    tag: "Cooling & Lubrication Issue",
    line: "Gearbox Manufacturing Line",
    machine: "Testing Station / Casing",
    thumbnail: "cooling_pump",
    description: "Gearbox cooling pump unit showing thermal discoloration and flow restriction.",
    diagnosis: "Possible cooling-system issue detected. Check coolant flow and inspect the cooling pump for blockage or abnormal operation."
  },
  {
    id: "img-02",
    title: "Valve Hydraulic Actuator Cylinder",
    tag: "Hydraulic Seal Seepage",
    line: "Valve Manufacturing Line",
    machine: "Pressure Testing Unit",
    thumbnail: "hydraulic_actuator",
    description: "High-pressure valve actuator showing light oil seepage around secondary rod seal.",
    diagnosis: "Hydraulic rod seal weeping detected. Depressurize system and replace seal ring (Part V-SEAL-42)."
  },
  {
    id: "img-03",
    title: "Welded Pipe Joint Seam",
    tag: "Surface Porosity Inspection",
    line: "Heavy Fabrication Line",
    machine: "Welding Station",
    thumbnail: "welded_joint",
    description: "Submerged arc welding seam showing slight root undercut and surface spatter.",
    diagnosis: "Minor surface weld irregularity identified. Perform dye penetrant inspection (PT) as per ASME Sec IX."
  },
  {
    id: "img-04",
    title: "Switchgear Busbar Terminal",
    tag: "Thermal Hotspot Anomaly",
    line: "Electrical Panel Line",
    machine: "Testing Station",
    thumbnail: "electrical_terminal",
    description: "Medium voltage busbar connection showing localized contact resistance heating.",
    diagnosis: "Phase B terminal contact heating detected. De-energize panel and re-torque bolt to 45 Nm specification."
  }
];

const DEVELOPERS = [
  {
    id: "dev-01",
    name: "Winson Immanuel",
    role: "Lead AI Systems Architect",
    department: "MIVA AI Core Leadership",
    avatar: "/assets/dev_winson.jpeg"
  },
  {
    id: "dev-02",
    name: "Roshnica",
    role: "Frontend Engineering Lead",
    department: "MIVA AI Experience Engineering",
    avatar: "/assets/dev_roshnica.jpeg"
  },
  {
    id: "dev-03",
    name: "Pon SubbuRaj",
    role: "Backend & Platform Engineer",
    department: "MIVA AI Platform Engineering",
    avatar: "/assets/dev_ponsubburaj.jpg"
  },
  {
    id: "dev-04",
    name: "Muruga Balan",
    role: "AI Integration & Systems Engineer",
    department: "MIVA AI Systems Integration",
    avatar: "/assets/dev_muruga.jpeg"
  }
];

module.exports = {
  PRODUCTION_LINES,
  GOVERNED_DOCUMENTS,
  BENCHMARK_EVALUATION_QUESTIONS,
  INITIAL_RISK_ALERTS,
  INITIAL_WORK_INSTRUCTIONS,
  SAMPLE_EQUIPMENT_IMAGES,
  DEVELOPERS
};
