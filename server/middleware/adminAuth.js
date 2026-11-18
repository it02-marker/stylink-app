import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import {
  getAdminCredential,
  replaceAdminPassword,
  verifyAdminPassword,
} from '../services/adminCredentials.js';

const COOKIE_NAME = 'stylink_admin';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
let generatedSessionSecret;

function getSessionSecret() {
  if (!process.env.ADMIN_SESSION_SECRET && !generatedSessionSecret) {
    generatedSessionSecret = randomBytes(32).toString('hex');
    console.warn('ADMIN_SESSION_SECRET is not configured; generated a temporary session secret for this process');
  }

  return process.env.ADMIN_SESSION_SECRET || generatedSessionSecret;
}

function digest(value) {
  return createHash('sha256').update(value).digest();
}

function createSignature(expiresAt, credentialVersion, secret) {
  return createHmac('sha256', secret)
    .update(`${expiresAt}.${credentialVersion}`)
    .digest('hex');
}

function getCookie(req, name) {
  const cookies = req.headers.cookie?.split(';') ?? [];
  const cookie = cookies.find((entry) => entry.trim().startsWith(`${name}=`));
  return cookie ? cookie.trim().slice(name.length + 1) : '';
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: SESSION_DURATION_SECONDS * 1000,
  };
}

export async function loginAdmin(req, res) {
  let credential;
  try {
    credential = await getAdminCredential();
  } catch (error) {
    console.error('Could not load admin credentials:', error);
    return res.status(503).json({ error: 'Admin login is unavailable; check the server configuration' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password || !(await verifyAdminPassword(credential, password))) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const secret = getSessionSecret();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const credentialVersion = credential.sessionVersion;
  const token = `${expiresAt}.${credentialVersion}.${createSignature(expiresAt, credentialVersion, secret)}`;
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.set('Cache-Control', 'no-store');
  return res.json({ authenticated: true });
}

export async function changeAdminPassword(req, res) {
  const currentPassword = typeof req.body?.currentPassword === 'string'
    ? req.body.currentPassword
    : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }
  if (newPassword.length < 12) {
    return res.status(400).json({ error: 'New password must be at least 12 characters' });
  }
  if (newPassword.length > 1024) {
    return res.status(400).json({ error: 'New password is too long' });
  }

  try {
    const credential = req.adminCredential;
    if (!(await verifyAdminPassword(credential, currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const updatedCredential = await replaceAdminPassword(credential, newPassword);
    if (!updatedCredential) {
      return res.status(409).json({ error: 'Admin password changed in another session; sign in again' });
    }

    const secret = getSessionSecret();
    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    const credentialVersion = updatedCredential.sessionVersion;
    const token = `${expiresAt}.${credentialVersion}.${createSignature(expiresAt, credentialVersion, secret)}`;
    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.set('Cache-Control', 'no-store');
    return res.json({ changed: true });
  } catch (error) {
    console.error('Could not change admin password:', error);
    return res.status(500).json({ error: 'Could not change admin password' });
  }
}

export function logoutAdmin(req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.set('Cache-Control', 'no-store');
  return res.json({ authenticated: false });
}

export async function requireAdmin(req, res, next) {
  res.set('Cache-Control', 'no-store');
  try {
    const credential = await getAdminCredential();
    const token = getCookie(req, COOKIE_NAME);
    const tokenParts = token.split('.');
    const [expiresAtText, credentialVersion, signature] = tokenParts;
    const expiresAt = Number(expiresAtText);
    const now = Math.floor(Date.now() / 1000);
    const currentVersion = credential.sessionVersion;

    if (
      tokenParts.length !== 3 ||
      !Number.isSafeInteger(expiresAt) ||
      expiresAt <= now ||
      expiresAt > now + SESSION_DURATION_SECONDS ||
      credentialVersion !== currentVersion ||
      !signature
    ) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const expected = createSignature(expiresAt, credentialVersion, getSessionSecret());
    if (!timingSafeEqual(digest(signature), digest(expected))) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    req.adminCredential = credential;
    return next();
  } catch (error) {
    console.error('Could not verify admin session:', error);
    return res.status(503).json({ error: 'Admin access is temporarily unavailable' });
  }
}

export function requireSameOrigin(req, res, next) {
  const origin = req.get('origin');
  const requestHost = req.get('x-forwarded-host') || req.get('host');
  if (!origin || !requestHost) {
    return res.status(403).json({ error: 'Request origin could not be verified' });
  }

  try {
    if (new URL(origin).host !== requestHost) {
      return res.status(403).json({ error: 'Cross-origin request rejected' });
    }
  } catch {
    return res.status(403).json({ error: 'Request origin could not be verified' });
  }

  return next();
}
