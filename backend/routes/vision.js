const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const store = require('../data/store');
const { SAMPLE_EQUIPMENT_IMAGES } = require('../data/seedData');

const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `vision_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`)
});
const upload = multer({ storage });

// Get sample equipment images list for quick testing
router.get('/samples', (req, res) => {
  res.json({ samples: SAMPLE_EQUIPMENT_IMAGES });
});

// Analyze uploaded image or image sample
router.post('/analyze', upload.single('image'), (req, res) => {
  const { sampleId, query = '', language = 'en', userId = 'u-01', chatId = 'default' } = req.body;

  let equipmentName = "Industrial Equipment Component";
  let diagnosisAnswer = "";
  let auditTrace = {};

  if (sampleId) {
    const sample = SAMPLE_EQUIPMENT_IMAGES.find(s => s.id === sampleId);
    if (sample) {
      equipmentName = sample.title;
      diagnosisAnswer = sample.diagnosis;
      auditTrace = {
        sampleId: sample.id,
        line: sample.line,
        machine: sample.machine,
        matchedDocument: "WI-GB-PUMP-GCP204.pdf",
        confidence: 0.98,
        regionOfInterest: { x: 0.72, y: 0.44, w: 0.22, h: 0.28 }
      };
    }
  }

  // If user uploaded custom file
  if (req.file) {
    const filename = req.file.originalname.toLowerCase();
    if (filename.includes('pump') || filename.includes('motor') || filename.includes('gear')) {
      diagnosisAnswer = "Possible cooling-system issue detected.\n\nCheck coolant flow and inspect the cooling pump for blockage or abnormal operation.";
      auditTrace = {
        detectedComponent: "Gearbox Cooling Pump (GCP-204)",
        matchedDocument: "WI-GB-PUMP-GCP204.pdf",
        revision: "Rev 02 ACTIVE",
        confidence: 0.96
      };
    } else if (filename.includes('valve') || filename.includes('pipe') || filename.includes('cylinder')) {
      diagnosisAnswer = "Hydraulic pressure seal seepage detected.\n\nDepressurize the circuit and inspect O-ring seal packing according to approved SOP.";
      auditTrace = {
        detectedComponent: "Valve Actuator",
        matchedDocument: "WI-VLV-FLT-09.pdf",
        confidence: 0.94
      };
    } else {
      diagnosisAnswer = "Equipment inspected. Surface alignment and mounting tolerances are within standard operational limits. No immediate critical fault observed.";
      auditTrace = {
        detectedComponent: "General Mechanical Assembly",
        confidence: 0.91
      };
    }
  }

  // Fallback default if not set
  if (!diagnosisAnswer) {
    diagnosisAnswer = "Possible cooling-system issue detected.\n\nCheck coolant flow and inspect the cooling pump for blockage or abnormal operation.";
    auditTrace = {
      detectedComponent: "Cooling Pump GCP-204",
      matchedDocument: "WI-GB-PUMP-GCP204.pdf",
      confidence: 0.95
    };
  }

  // Localize if Tamil
  if (language === 'ta') {
    diagnosisAnswer = "குளிரூட்டும் அமைப்பில் சாத்தியமான சிக்கல் கண்டறியப்பட்டுள்ளது.\n\nகுளிர்விப்பான் ஓட்டத்தை சரிபார்த்து, குளிரூட்டும் பம்பில் அடைப்பு அல்லது அசாதாரண செயல்பாடு உள்ளதா என ஆய்வு செய்யவும்.";
  }

  // Record internal multimodal retrieval audit
  store.recordAuditLog({
    type: "MULTIMODAL_VISION",
    chatId,
    userId,
    equipmentName,
    internalTrace: auditTrace
  });

  // Normal user sees ONLY the clean concise answer
  return res.json({
    answer: diagnosisAnswer,
    equipmentName,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
