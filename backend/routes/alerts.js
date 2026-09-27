const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get all risk alerts
router.get('/', (req, res) => {
  res.json({ alerts: store.getRiskAlerts() });
});

// Update alert status (New -> Under Review -> Resolved)
router.patch('/:id/status', (req, res) => {
  const { status, resolvedBy, resolutionNotes } = req.body;
  if (!['New', 'Under Review', 'Resolved'].includes(status)) {
    return res.status(400).json({ error: 'Status must be New, Under Review, or Resolved' });
  }

  const alert = store.updateRiskAlertStatus(req.params.id, status);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  if (resolvedBy) alert.resolvedBy = resolvedBy;
  if (resolutionNotes) alert.resolutionNotes = resolutionNotes;
  store.save();

  res.json({ alert });
});

module.exports = router;
