const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Classifier for harmful / destructive requests
function evaluateHarmfulIntent(query) {
  const destructivePatterns = [
    /\b(break|damage|destroy|sabotage|tamper|disable\s+safety|bypass\s+safety|overload\s+motor|blow\s+up|burn\s+down|smash)\b/i,
    /how\s+to\s+break/i,
    /how\s+to\s+destroy/i,
    /how\s+to\s+damage/i,
    /turn\s+off\s+safety\s+interlock/i,
    /bypass\s+emergency\s+stop/i
  ];

  for (const pattern of destructivePatterns) {
    if (pattern.test(query)) {
      return true;
    }
  }
  return false;
}

// Conversational greetings and general queries.
// These are intentionally handled before manufacturing retrieval so everyday questions
// never get routed into the governed shop-floor knowledge layer.
function getIndiaDateTime() {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now);
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(now);
  const day = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  }).format(now);
  const year = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric'
  }).format(now);
  return { date, time, day, year };
}

function getCasualResponse(query, lang = 'en') {
  const trimmed = query.trim().toLowerCase().replace(/[!?.,]+$/g, '');
  const isTa = lang === 'ta';
  const { date, time, day, year } = getIndiaDateTime();

  if (/^(hi|hello|hey|hii|heyy|yo|sup|vanakkam)\b/i.test(trimmed)) {
    return isTa
      ? "வணக்கம்! நான் MIVA AI. இன்று உங்களுக்கு எப்படி உதவலாம்?"
      : "Hello! I'm MIVA AI. How can I help you today?";
  }

  if (/^(good\s+morning|morning)\b/i.test(trimmed)) {
    return isTa ? "காலை வணக்கம்! MIVA AI உதவ தயாராக உள்ளது." : "Good morning! MIVA AI is ready to help.";
  }
  if (/^(good\s+afternoon|afternoon)\b/i.test(trimmed)) {
    return isTa ? "மதிய வணக்கம்! இன்று நான் உங்களுக்கு உதவ தயாராக இருக்கிறேன்." : "Good afternoon! I'm ready to help.";
  }
  if (/^(good\s+evening|evening)\b/i.test(trimmed)) {
    return isTa ? "மாலை வணக்கம்! MIVA AI உங்களுக்கு உதவ தயாராக உள்ளது." : "Good evening! MIVA AI is ready to assist.";
  }
  if (/^(good\s+night|night)\b/i.test(trimmed)) {
    return isTa ? "இனிய இரவு! பாதுகாப்பாக இருங்கள்." : "Good night! Stay safe.";
  }

  if (/^(how\s+are\s+you|how're\s+you|how\s+r\s+u|how\s+are\s+u)$/i.test(trimmed)) {
    return isTa
      ? "நான் நன்றாக இருக்கிறேன்! உங்களுக்கு உதவ தயாராக இருக்கிறேன்."
      : "I'm doing great! I'm ready to help you.";
  }

  if (/^(who\s+are\s+you|what\s+are\s+you)$/i.test(trimmed)) {
    return isTa
      ? "நான் MIVA AI — Manufacturing Intelligence & Vision Assistant. பணிமனை அறிவு, நடைமுறைகள் மற்றும் உபகரணப் படங்களைப் புரிந்துகொள்ள உதவும் AI உதவியாளர்."
      : "I'm MIVA AI — Manufacturing Intelligence & Vision Assistant, an AI assistant for shop-floor knowledge, procedures and equipment vision.";
  }

  if (/^(what('?s|\s+is)\s+your\s+name|your\s+name|what\s+is\s+your\s+name)$/i.test(trimmed)) {
    return isTa ? "என் பெயர் MIVA AI." : "My name is MIVA AI.";
  }

  if (/\b(who\s+(created|built|made|developed)|who\s+is\s+behind\s+miva|who\s+are\s+the\s+developers?)\b/i.test(trimmed)) {
    return isTa
      ? "MIVA AI-யை Winson Immanuel தலைமையிலான core team உருவாக்கியது. Roshnica frontend, Pon SubbuRaj backend & platform, Muruga Balan AI integration & systems ஆகிய பொறுப்புகளை மேற்கொள்கிறார்கள்."
      : "MIVA AI was developed by our core team led by Winson Immanuel. Roshnica leads frontend engineering, Pon SubbuRaj handles backend and platform engineering, and Muruga Balan handles AI integration and systems engineering.";
  }

  if (/\b(who\s+is\s+(the\s+)?lead|who\s+leads\s+miva|miva\s+lead)\b/i.test(trimmed)) {
    return isTa ? "MIVA AI-யின் Lead AI Systems Architect: Winson Immanuel." : "Winson Immanuel is the Lead AI Systems Architect for MIVA AI.";
  }

  if (/\b(what\s+can\s+you\s+do|what\s+do\s+you\s+do|your\s+capabilit|your\s+features|how\s+can\s+you\s+help)\b/i.test(trimmed)) {
    return isTa
      ? "நான் governed manufacturing knowledge-ஐ தேடலாம், SOP மற்றும் நடைமுறைகளை வழங்கலாம், உபகரணப் படங்களை ஆய்வு செய்யலாம் மற்றும் பாதுகாப்பான shop-floor guidance வழங்கலாம்."
      : "I can retrieve governed manufacturing knowledge, answer from SOPs and procedures, analyze equipment images, and provide safety-focused shop-floor guidance.";
  }

  if (/\b(what\s+is\s+miva|tell\s+me\s+about\s+miva|what\s+does\s+miva\s+stand\s+for)\b/i.test(trimmed)) {
    return isTa
      ? "MIVA என்பது Manufacturing Intelligence & Vision Assistant. இது உற்பத்தி பணிமனை அறிவு மற்றும் பார்வை அடிப்படையிலான உதவிக்காக வடிவமைக்கப்பட்டுள்ளது."
      : "MIVA stands for Manufacturing Intelligence & Vision Assistant. It is designed to support manufacturing knowledge and vision-based shop-floor assistance.";
  }

  if (/\b(are\s+you\s+(an\s+)?ai|are\s+you\s+artificial\s+intelligence|are\s+you\s+a\s+robot)\b/i.test(trimmed)) {
    return isTa ? "ஆம். நான் MIVA AI, ஒரு செயற்கை நுண்ணறிவு உதவியாளர்." : "Yes. I'm MIVA AI, an artificial intelligence assistant.";
  }

  if (/\b(what\s+is\s+your\s+purpose|why\s+were\s+you\s+created|what\s+are\s+you\s+for)\b/i.test(trimmed)) {
    return isTa
      ? "பணிமனை குழுக்களுக்கு சரிபார்க்கப்பட்ட manufacturing knowledge, நடைமுறைகள் மற்றும் vision assistance வழங்குவதே என் நோக்கம்."
      : "My purpose is to help shop-floor teams access governed manufacturing knowledge, procedures and vision assistance.";
  }

  if (/\b(how\s+do\s+you\s+work|how\s+does\s+miva\s+work)\b/i.test(trimmed)) {
    return isTa
      ? "நான் உங்கள் கேள்வியை புரிந்து கொண்டு, தேவையான governed knowledge அல்லது vision workflow-ஐ பயன்படுத்தி பதிலை உருவாக்குகிறேன்."
      : "I understand your question, then use the appropriate governed knowledge or vision workflow to produce a response.";
  }

  if (/\b(where\s+do\s+you\s+get\s+(your\s+)?information|where\s+does\s+your\s+information\s+come\s+from|what\s+sources\s+do\s+you\s+use)\b/i.test(trimmed)) {
    return isTa
      ? "என் manufacturing answers governed SOPs, work instructions, manuals மற்றும் approved knowledge sources-லிருந்து பெறப்படுகின்றன."
      : "My manufacturing answers come from governed SOPs, work instructions, manuals and approved knowledge sources in the system.";
  }

  if (/\b(can\s+you\s+answer\s+general\s+questions|can\s+you\s+answer\s+questions|can\s+you\s+help\s+me|help\s+me|help)$/i.test(trimmed)) {
    return isTa
      ? "ஆம். உங்கள் கேள்வியை கேளுங்கள். Manufacturing, procedures, maintenance, safety அல்லது MIVA பற்றிய உதவியை வழங்குகிறேன்."
      : "Yes. Ask your question. I can help with manufacturing, procedures, maintenance, safety, or MIVA-related questions.";
  }

  if (/\b(what('?s)?\s+(the\s+)?date\s+and\s+time|today('?s)?\s+date\s+and\s+time|date\s+and\s+time\s+today)\b/i.test(trimmed)) {
    return isTa ? `இன்றைய தேதி ${date}; இந்திய நேரப்படி ${time}.` : `Today's date is ${date}; the current time in India is ${time}.`;
  }

  if (/\b(today('?s)?\s+(date|day)|what\s+date\s+is\s+it|what\s+is\s+(the\s+)?date\s+today|date\s+today|today\s+date)\b/i.test(trimmed)) {
    return isTa ? `இன்றைய தேதி ${date}.` : `Today's date is ${date}.`;
  }

  if (/\b(what\s+(day|weekday)\s+is\s+(it|today)|what\s+day\s+is\s+today|which\s+day\s+is\s+today|today\s+day)\b/i.test(trimmed)) {
    return isTa ? `இன்று ${day}.` : `Today is ${day}.`;
  }

  if (/\b(what\s+time\s+is\s+it|current\s+time|time\s+now|what('?s)?\s+the\s+time|what\s+time\s+is\s+it\s+now)\b/i.test(trimmed)) {
    return isTa ? `இந்திய நேரப்படி தற்போதைய நேரம் ${time}.` : `The current time in India is ${time}.`;
  }

  if (/\b(what\s+year\s+is\s+it|current\s+year|what('?s)?\s+the\s+year)\b/i.test(trimmed)) {
    return isTa ? `தற்போதைய ஆண்டு ${year}.` : `The current year is ${year}.`;
  }

  if (/^(thanks|thank\s+you|thankyou|thx|ty)$/i.test(trimmed)) {
    return isTa ? "மகிழ்ச்சி! வேறு ஏதாவது உதவி வேண்டுமா?" : "You're welcome! Need anything else?";
  }

  if (/^(bye|goodbye|see\s+you|see\s+ya|take\s+care)$/i.test(trimmed)) {
    return isTa ? "விடைபெறுகிறேன்! பாதுகாப்பாக இருங்கள்." : "Goodbye! Stay safe.";
  }

  if (/^(nice|cool|great|awesome|okay|ok|perfect)$/i.test(trimmed)) {
    return isTa ? "சரி! நான் தயாராக இருக்கிறேன்." : "Sounds good. I'm ready when you are.";
  }

  if (/\b(tell\s+me\s+a\s+joke|say\s+a\s+joke|joke)\b/i.test(trimmed)) {
    return isTa
      ? "ஒரு quick joke: Maintenance engineer ஏன் calm-ஆ இருப்பார்? ஏனெனில் அவர் எல்லா alarms-க்கும் ஒரு procedure வைத்திருப்பார்! 😄"
      : "Quick one: Why was the maintenance engineer calm? Because every alarm had a procedure! 😄";
  }

  return null;
}

// Intent & Production Line/Machine classifier
function detectLineAndMachine(query) {
  const lower = query.toLowerCase();
  let lineId = null;
  let machineId = null;

  if (lower.includes('valve') || lower.includes('temperature') || lower.includes('vmc') || lower.includes('turning')) {
    lineId = 'line-01';
    if (lower.includes('temperature') || lower.includes('coolant') || lower.includes('vmc')) {
      machineId = 'm-01-2';
    } else if (lower.includes('startup') || lower.includes('cnc')) {
      machineId = 'm-01-1';
    }
  } else if (lower.includes('pump') || lower.includes('impeller') || lower.includes('cavitation')) {
    lineId = 'line-02';
    if (lower.includes('pressure') || lower.includes('flow')) {
      machineId = 'm-02-3';
    } else if (lower.includes('seal') || lower.includes('assembly')) {
      machineId = 'm-02-2';
    }
  } else if (lower.includes('gearbox') || lower.includes('gear') || lower.includes('gcp-204') || lower.includes('backlash')) {
    lineId = 'line-03';
    if (lower.includes('cooling pump') || lower.includes('gcp')) {
      machineId = 'm-03-1';
    } else if (lower.includes('inspection') || lower.includes('testing')) {
      machineId = 'm-03-3';
    }
  } else if (lower.includes('welding') || lower.includes('fabrication') || lower.includes('plasma') || lower.includes('ppe')) {
    lineId = 'line-04';
    if (lower.includes('welding') || lower.includes('ppe')) {
      machineId = 'm-04-2';
    } else if (lower.includes('plasma') || lower.includes('cutting')) {
      machineId = 'm-04-1';
    }
  } else if (lower.includes('electrical') || lower.includes('panel') || lower.includes('hi-pot') || lower.includes('dielectric') || lower.includes('megger')) {
    lineId = 'line-05';
    if (lower.includes('testing') || lower.includes('hi-pot') || lower.includes('dielectric')) {
      machineId = 'm-05-3';
    } else if (lower.includes('wiring') || lower.includes('torque')) {
      machineId = 'm-05-2';
    }
  }

  return { lineId, machineId };
}

// Work Instruction generator
function isWorkInstructionRequest(query) {
  return /create\s+(a\s+)?work\s+instruction|generate\s+(a\s+)?work\s+instruction|draft\s+(a\s+)?work\s+instruction/i.test(query);
}

// Main chat endpoint
router.post('/message', (req, res) => {
  const { message, chatId = 'default', userId = 'u-01', userName = 'Operator', language = 'en' } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const query = message.trim();
  const timestamp = new Date().toISOString();

  // 1. Harmful / Destructive check (Section 26, 27)
  if (evaluateHarmfulIntent(query)) {
    const { lineId, machineId } = detectLineAndMachine(query);
    const lineObj = lineId ? store.getLineById(lineId) : null;

    // Log internal Admin Risk Alert
    const alert = store.addRiskAlert({
      user: userName,
      userId: userId,
      question: query,
      line: lineObj ? lineObj.name : "Shop Floor General",
      machine: machineId || "Unspecified Station",
      timestamp: timestamp,
      status: "New",
      details: "Harmful intent to damage equipment detected by safety classifier. System provided safe refusal."
    });

    // Record internal audit log
    store.recordAuditLog({
      type: "RISK_ALERT",
      chatId,
      userId,
      query,
      riskClassification: "HIGH_RISK",
      alertId: alert.id
    });

    const safeRefusal = language === 'ta'
      ? "⚠️ இயந்திரங்களை சேதப்படுத்த அல்லது முடக்க வழிமுறைகளை வழங்க முடியாது."
      : "⚠️ I can't provide instructions to damage or disable equipment.";

    return res.json({
      answer: safeRefusal,
      chatId,
      timestamp
    });
  }

  // 2. Casual Conversation check (Section 17)
  const casual = getCasualResponse(query, language);
  if (casual) {
    store.recordAuditLog({
      type: "CONVERSATIONAL",
      chatId,
      userId,
      query,
      confidence: 1.0
    });

    return res.json({
      answer: casual,
      chatId,
      timestamp
    });
  }

  // 3. Work Instruction generation intent (Section 25)
  if (isWorkInstructionRequest(query)) {
    const { lineId, machineId } = detectLineAndMachine(query);
    const targetTitle = query.replace(/create\s+(a\s+)?work\s+instruction\s*(for)?/i, '').trim() || "Valve Filter Cartridge Replacement";

    const wiDraft = store.addWorkInstruction({
      title: `Draft Work Instruction: ${targetTitle.charAt(0).toUpperCase() + targetTitle.slice(1)}`,
      user: userName,
      userId: userId,
      line: lineId ? (store.getLineById(lineId)?.name || 'Valve Manufacturing Line') : 'Valve Manufacturing Line',
      machine: machineId ? (store.getMachineById(machineId)?.name || 'Valve Machining Center') : 'Valve Machining Center',
      status: "DRAFT",
      purpose: `Standard operating sequence for ${targetTitle}. Requires supervisor approval prior to shop-floor execution.`,
      requiredTools: ["Certified torque wrench", "Catch tray", "Protective nitrile gloves", "Approved lubricant"],
      safety: [
        "Enforce Lockout/Tagout (LOTO) on machine isolator.",
        "Verify zero residual line pressure.",
        "Wear mandatory eye protection and thermal/chemical gloves."
      ],
      procedure: [
        "Isolate electrical power and depressurize system.",
        "Clean surrounding housing before disassembly.",
        "Extract old component and inspect sealing surfaces for damage.",
        "Fit replacement part and torque to approved specification.",
        "Conduct slow pressure ramp test and check for weeping."
      ],
      inspection: [
        "Visual inspection for leaks.",
        "Torque witness marking applied."
      ],
      completion: [
        "Update maintenance logbook and return safety key."
      ]
    });

    store.recordAuditLog({
      type: "WORK_INSTRUCTION_DRAFT",
      chatId,
      userId,
      query,
      draftId: wiDraft.id,
      status: "DRAFT"
    });

    const wiResponse = language === 'ta'
      ? `WORK INSTRUCTION (வரைவு - DRAFT)\n\nதலைப்பு: ${wiDraft.title}\nநிலை: DRAFT (நிர்வாக ஒப்புதலுக்கு உட்பட்டது)\n\nபடிநிலைகள்:\n1. முதன்மை மின் விநியோகத்தை துண்டித்து LOTO நடைமுறையை பின்பற்றவும்.\n2. அழுத்தத்தை குறைத்து பழைய பாகத்தை பாதுகாப்பாக மாற்றவும்.\n3. புதிய பாகத்தை பொருத்தி நிர்ணயிக்கப்பட்ட அளவுக்கு இறுக்கவும்.\n4. சோதனை ஓட்டம் செய்து கசிவு உள்ளதா என சரிபார்க்கவும்.`
      : `WORK INSTRUCTION (DRAFT)\n\nTitle: ${wiDraft.title}\nStatus: DRAFT (Pending Expert Approval)\n\n1. Apply Lockout/Tagout (LOTO) to isolate electrical and hydraulic power.\n2. Depressurize the reservoir using the manual bleed valve.\n3. Remove filter bowl and replace with approved cartridge.\n4. Torque housing to 35 Nm and perform 5-minute leak check.\n\nNote: This draft has been sent to the shop supervisor for formal approval.`;

    return res.json({
      answer: wiResponse,
      chatId,
      timestamp,
      workInstructionId: wiDraft.id
    });
  }

  // 4. Governed Manufacturing Knowledge Base Retrieval (Section 18, 19, 33)
  const { lineId, machineId } = detectLineAndMachine(query);

  // Search ACTIVE governed documents (Revision filtering: ACTIVE prioritized)
  const searchResults = store.searchGovernedKnowledge({
    query,
    lineId,
    machineId,
    includeSuperseded: false // Exclude SUPERSEDED documents
  });

  let answer = "";
  let auditTrace = null;

  if (searchResults.length > 0) {
    const topResult = searchResults[0];

    // Response must be concise, short, action-oriented (2-5 lines or 1. 2. 3. 4.)
    answer = topResult.chunk.text;

    // Tamil translation if requested
    if (language === 'ta') {
      if (query.toLowerCase().includes('temperature')) {
        answer = "குளிர்விப்பான் ஓட்டத்தை சரிபார்த்து குளிரூட்டும் அமைப்பை ஆய்வு செய்யவும்.\nஇயந்திரத்தின் சுமையை குறைத்து வெப்பநிலையை கண்காணிக்கவும்.\nவெப்பநிலை தொடர்ந்து அதிகமாக இருந்தால், அங்கீகரிக்கப்பட்ட குளிரூட்டும் நடைமுறையை பின்பற்றவும்.";
      } else if (query.toLowerCase().includes('pump pressure')) {
        answer = "1. வெற்றிட வால்வு முழுமையாக திறக்கப்பட்டுள்ளதா என உறுதி செய்யவும்.\n2. வெளியேற்ற போர்ட்டில் அளவீட்டை ஆய்வு செய்யவும்.\n3. மோட்டாரை 2 நிமிடங்கள் இயக்கி அழுத்தத்தை நிலைப்படுத்தவும்.\n4. அழுத்தம் 120 ± 5 bar உள்ளதா என சரிபார்க்கவும்.";
      }
    }

    // CRITICAL: Stored INTERNALLY for audit, NEVER returned to user UI
    auditTrace = {
      documentId: topResult.document.document_id,
      title: topResult.document.title,
      code: topResult.document.code,
      revision: topResult.document.revision,
      status: topResult.document.status,
      page: topResult.chunk.page,
      section: topResult.chunk.section,
      chunkId: topResult.chunk.id,
      score: topResult.score,
      confidence: topResult.confidence
    };
  } else {
    // Fallback: Manufacturing best-practice answer without exposing backend
    if (query.toLowerCase().includes('valve')) {
      answer = "Check the coolant flow and inspect the cooling system. Reduce the machine load and monitor the temperature. If it remains high, follow the approved cooling procedure.";
    } else {
      answer = "Inspect the machine operating parameters and ensure coolant and lubrication levels are within normal limits. If values exceed tolerance, initiate standard shop-floor inspection.";
    }

    auditTrace = {
      fallback: true,
      confidence: 0.85
    };
  }

  // Save audit log internally in the store (Admins can review, normal users cannot see)
  store.recordAuditLog({
    type: "KNOWLEDGE_RETRIEVAL",
    chatId,
    userId,
    query,
    lineId,
    machineId,
    internalTrace: auditTrace
  });

  // RETURN ONLY THE CLEAN ANSWER TO THE NORMAL USER
  return res.json({
    answer: answer,
    chatId,
    timestamp
  });
});

module.exports = router;
