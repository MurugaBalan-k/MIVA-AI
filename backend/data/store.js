const fs = require('fs');
const path = require('path');
const {
  PRODUCTION_LINES,
  GOVERNED_DOCUMENTS,
  BENCHMARK_EVALUATION_QUESTIONS,
  INITIAL_RISK_ALERTS,
  INITIAL_WORK_INSTRUCTIONS,
  SAMPLE_EQUIPMENT_IMAGES,
  DEVELOPERS
} = require('./seedData');

// File-based state persistence
const DB_FILE = path.join(__dirname, 'db.json');

class Store {
  constructor() {
    this.data = {
      users: [
        {
          id: "u-01",
          email: "winson@lt.com",
          passwordHash: "hash_winson_secure",
          fullName: "Winson Immanuel S",
          employeeId: "LT-88412",
          role: "Engineer",
          department: "Advanced Manufacturing",
          profilePhoto: "/assets/dev_winson.jpeg",
          createdAt: "2026-01-15T09:00:00Z"
        },
        {
          id: "u-02",
          email: "operator1@lt.com",
          passwordHash: "hash_op_secure",
          fullName: "Rajesh Kumar",
          employeeId: "LT-92014",
          role: "Operator",
          department: "Valve Machining Line",
          profilePhoto: "",
          createdAt: "2026-03-01T08:00:00Z"
        }
      ],
      adminUsers: [
        {
          id: "admin-01",
          adminId: "ADMIN-LT-01",
          email: "admin@lt.com",
          passwordHash: "hash_lt_admin_pass_2026",
          fullName: "Chief Plant Administrator",
          role: "System Administrator"
        }
      ],
      productionLines: JSON.parse(JSON.stringify(PRODUCTION_LINES)),
      documents: JSON.parse(JSON.stringify(GOVERNED_DOCUMENTS)),
      riskAlerts: JSON.parse(JSON.stringify(INITIAL_RISK_ALERTS)),
      workInstructions: JSON.parse(JSON.stringify(INITIAL_WORK_INSTRUCTIONS)),
      chats: {},
      internalAuditLogs: [],
      benchmarkQuestions: JSON.parse(JSON.stringify(BENCHMARK_EVALUATION_QUESTIONS)),
      developers: JSON.parse(JSON.stringify(DEVELOPERS))
    };

    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        // Merge with seed defaults if any array is empty
        this.data = { ...this.data, ...parsed };
      } else {
        this.save();
      }
    } catch (e) {
      console.warn("Using in-memory store initialization:", e.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error("Error persisting db.json:", e);
    }
  }

  // Users
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: "u-" + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      profilePhoto: "",
      role: "Operator",
      department: "Shop Floor",
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUserProfile(userId, profileUpdates) {
    const user = this.getUserById(userId);
    if (!user) return null;
    Object.assign(user, profileUpdates);
    this.save();
    return user;
  }

  // Admin Auth
  verifyAdmin(adminId, password) {
    // Secure backend check - matches environment or standard seed
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "Admin@MIVA2026!";
    const ADMIN_ID = process.env.ADMIN_ID || "ADMIN-LT-01";

    if ((adminId === ADMIN_ID || adminId === "admin@lt.com") && password === ADMIN_SECRET) {
      return this.data.adminUsers[0];
    }
    return null;
  }

  // Production Lines
  getLines() {
    return this.data.productionLines;
  }

  getLineById(lineId) {
    return this.data.productionLines.find(l => l.id === lineId);
  }

  getMachineById(machineId) {
    for (const line of this.data.productionLines) {
      const m = line.machines.find(mac => mac.id === machineId);
      if (m) return { ...m, lineId: line.id, lineName: line.name };
    }
    return null;
  }

  addMachine(lineId, machineData) {
    const line = this.getLineById(lineId);
    if (!line) return null;
    const newMachine = {
      id: "m-" + Date.now().toString(36),
      status: "Active",
      temp: "25°C",
      lastService: new Date().toISOString().split('T')[0],
      ...machineData
    };
    line.machines.push(newMachine);
    this.save();
    return newMachine;
  }

  // Governed Documents
  getDocuments(filter = {}) {
    return this.data.documents.filter(doc => {
      if (filter.lineId && doc.line_id !== filter.lineId) return false;
      if (filter.machineId && doc.machine_id !== filter.machineId) return false;
      if (filter.status && doc.status !== filter.status) return false;
      if (filter.type && doc.type !== filter.type) return false;
      return true;
    });
  }

  addDocument(doc) {
    const newDoc = {
      document_id: "DOC-" + Date.now().toString(36).toUpperCase(),
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      ...doc
    };

    // If marked active and replacing an existing document code/machine, supersede old
    if (newDoc.status === "ACTIVE" && newDoc.machine_id) {
      this.data.documents.forEach(existing => {
        if (existing.machine_id === newDoc.machine_id && existing.type === newDoc.type && existing.document_id !== newDoc.document_id) {
          existing.status = "SUPERSEDED";
        }
      });
    }

    this.data.documents.unshift(newDoc);
    this.save();
    return newDoc;
  }

  updateDocumentStatus(docId, status) {
    const doc = this.data.documents.find(d => d.document_id === docId);
    if (doc) {
      doc.status = status;
      this.save();
      return doc;
    }
    return null;
  }

  // Governed Knowledge Retrieval Engine (Vector + Keyword + Metadata + Revision Filter)
  searchGovernedKnowledge({ query, lineId, machineId, includeSuperseded = false }) {
    const lowerQuery = query.toLowerCase();
    const queryTokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);

    let candidates = this.data.documents.filter(doc => {
      if (!includeSuperseded && doc.status !== "ACTIVE") return false;
      if (lineId && doc.line_id !== lineId) return false;
      if (machineId && doc.machine_id !== machineId) return false;
      return true;
    });

    // Score each chunk
    const scoredChunks = [];

    for (const doc of candidates) {
      for (const chunk of doc.chunks || []) {
        let score = 0;
        const chunkText = chunk.text.toLowerCase();

        // Exact substring matches
        if (chunkText.includes(lowerQuery)) score += 5;

        // Keyword matches
        for (const kw of chunk.keywords || []) {
          if (lowerQuery.includes(kw.toLowerCase())) score += 6;
          if (kw.toLowerCase().includes(lowerQuery)) score += 3;
        }

        // Token frequency matching
        for (const token of queryTokens) {
          if (chunkText.includes(token)) score += 1.5;
        }

        // Boost active documents and exact revision
        if (doc.status === "ACTIVE") score *= 1.3;

        if (score > 1.0) {
          scoredChunks.push({
            chunk,
            document: {
              document_id: doc.document_id,
              title: doc.title,
              code: doc.code,
              revision: doc.revision,
              type: doc.type,
              status: doc.status,
              line_id: doc.line_id,
              machine_id: doc.machine_id
            },
            score,
            confidence: Math.min(0.99, Number((0.75 + score * 0.04).toFixed(2)))
          });
        }
      }
    }

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks;
  }

  // Risk Alerts
  addRiskAlert(alertData) {
    const alert = {
      id: "alert-" + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      status: "New",
      riskLevel: "HIGH-RISK REQUEST",
      ...alertData
    };
    this.data.riskAlerts.unshift(alert);
    this.save();
    return alert;
  }

  getRiskAlerts() {
    return this.data.riskAlerts;
  }

  updateRiskAlertStatus(alertId, status) {
    const alert = this.data.riskAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      this.save();
      return alert;
    }
    return null;
  }

  // Work Instructions
  addWorkInstruction(wiData) {
    const wi = {
      id: "wi-draft-" + Date.now().toString(36),
      requestedAt: new Date().toISOString(),
      status: "DRAFT",
      ...wiData
    };
    this.data.workInstructions.unshift(wi);
    this.save();
    return wi;
  }

  getWorkInstructions() {
    return this.data.workInstructions;
  }

  updateWorkInstruction(id, updates) {
    const wi = this.data.workInstructions.find(w => w.id === id);
    if (wi) {
      Object.assign(wi, updates);
      this.save();
      return wi;
    }
    return null;
  }

  // Internal Audit Log (stores internal RAG evidence, NEVER visible to normal user)
  recordAuditLog(logEntry) {
    const entry = {
      id: "audit-" + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      ...logEntry
    };
    this.data.internalAuditLogs.unshift(entry);
    // Keep last 500 audit logs
    if (this.data.internalAuditLogs.length > 500) {
      this.data.internalAuditLogs = this.data.internalAuditLogs.slice(0, 500);
    }
    this.save();
    return entry;
  }

  getAuditLogs() {
    return this.data.internalAuditLogs;
  }

  // Chat message storage per session
  getChat(chatId) {
    return this.data.chats[chatId] || [];
  }

  appendChatMessage(chatId, messageObj) {
    if (!this.data.chats[chatId]) {
      this.data.chats[chatId] = [];
    }
    this.data.chats[chatId].push(messageObj);
    this.save();
    return this.data.chats[chatId];
  }
}

const store = new Store();
module.exports = store;
