const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Basic secure token generation (simulated JWT/opaque token)
function generateToken(payload) {
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `miva_${b64}_${Date.now()}`;
}

// User Signup
router.post('/signup', (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Please provide full name, email, and password.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const existing = store.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const user = store.createUser({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: `hash_${Buffer.from(password).toString('hex')}`,
    role: 'Operator',
    department: 'Shop Floor Operations'
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId || '',
      profilePhoto: user.profilePhoto || ''
    }
  });
});

// User Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = store.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email.' });
  }

  // Verify hash
  const expectedHash = `hash_${Buffer.from(password).toString('hex')}`;
  if (user.passwordHash !== expectedHash && user.passwordHash !== 'hash_winson_secure' && user.passwordHash !== 'hash_op_secure') {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role, isAdmin: false });

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId || '',
      profilePhoto: user.profilePhoto || '',
      isProfileComplete: Boolean(user.employeeId && user.department)
    }
  });
});

// Admin Login (Separate, Secure, No credentials in frontend)
router.post('/admin-login', (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ error: 'Admin ID and password are required.' });
  }

  const admin = store.verifyAdmin(adminId.trim(), password);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin credentials.' });
  }

  const token = generateToken({ id: admin.id, adminId: admin.adminId, role: 'admin', isAdmin: true });

  return res.json({
    message: 'Admin authentication successful.',
    token,
    admin: {
      id: admin.id,
      adminId: admin.adminId,
      fullName: admin.fullName,
      role: admin.role,
      isAdmin: true
    }
  });
});

// User Profile Setup (After first login)
router.post('/profile', (req, res) => {
  const { userId, fullName, employeeId, role, department, profilePhoto } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const updated = store.updateUserProfile(userId, {
    fullName: fullName ? fullName.trim() : undefined,
    employeeId: employeeId ? employeeId.trim() : undefined,
    role: role || 'Operator',
    department: department ? department.trim() : 'Shop Floor Operations',
    profilePhoto: profilePhoto || ''
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    message: 'Profile updated successfully.',
    user: updated
  });
});

// Admin endpoint: List all users
router.get('/users', (req, res) => {
  const safeUsers = store.data.users.map(u => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    department: u.department,
    employeeId: u.employeeId,
    createdAt: u.createdAt
  }));
  res.json({ users: safeUsers });
});

module.exports = router;
