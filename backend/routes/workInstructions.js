const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get all work instructions (Admin & User)
router.get('/', (req, res) => {
  res.json({ workInstructions: store.getWorkInstructions() });
});

// Admin Review: Approve or Reject draft work instruction
router.post('/:id/review', (req, res) => {
  const { action, comments, approvedBy = 'Chief Plant Administrator' } = req.body;

  if (!['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ error: 'Action must be APPROVE or REJECT' });
  }

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  const updated = store.updateWorkInstruction(req.params.id, {
    status: newStatus,
    reviewedBy: approvedBy,
    reviewedAt: new Date().toISOString(),
    reviewComments: comments || (action === 'APPROVE' ? 'Approved for shop-floor distribution.' : 'Requires safety parameter revision.')
  });

  if (!updated) return res.status(404).json({ error: 'Work instruction not found.' });

  // If approved, automatically promote to official governed document in Knowledge Base!
  if (newStatus === 'APPROVED') {
    store.addDocument({
      title: updated.title.replace('Draft Work Instruction: ', 'SOP: '),
      code: `SOP-APP-${Date.now().toString(36).toUpperCase()}.pdf`,
      line_id: 'line-01',
      type: 'Work Instruction',
      revision: 'Rev 01',
      effective_date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      summary: updated.purpose,
      pages: [
        {
          page: 1,
          section: 'Approved Sequence',
          text: updated.procedure.join(' ')
        }
      ],
      chunks: [
        {
          id: `chk-wi-${Date.now()}`,
          page: 1,
          section: 'Procedure',
          keywords: updated.title.toLowerCase().split(/\s+/),
          text: updated.procedure.map((p, i) => `${i + 1}. ${p}`).join('\n'),
          confidence: 0.99
        }
      ]
    });
  }

  res.json({ message: `Work instruction marked as ${newStatus}`, workInstruction: updated });
});

module.exports = router;
