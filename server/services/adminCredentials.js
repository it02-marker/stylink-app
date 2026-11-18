import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import AdminCredential from '../models/AdminCredential.js';

const scrypt = promisify(scryptCallback);
const HASH_BYTES = 64;

async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = await scrypt(password, salt, HASH_BYTES, { N: 16384, r: 8, p: 1 });
  return {
    salt,
    passwordHash: hash.toString('hex'),
    sessionVersion: randomBytes(16).toString('hex'),
  };
}

export async function getAdminCredential() {
  let credential = await AdminCredential.findById('admin');
  if (credential) return credential;

  const initialPassword = process.env.ADMIN_PASSWORD;
  if (!initialPassword) {
    throw new Error('Admin password is not initialized; configure ADMIN_PASSWORD for initial setup');
  }

  const passwordData = await hashPassword(initialPassword);
  try {
    credential = await AdminCredential.findOneAndUpdate(
      { _id: 'admin' },
      { $setOnInsert: { ...passwordData } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    credential = await AdminCredential.findById('admin');
  }

  if (!credential) throw new Error('Could not initialize admin password');
  return credential;
}

export async function verifyAdminPassword(credential, password) {
  const candidate = await scrypt(password, credential.salt, HASH_BYTES, { N: 16384, r: 8, p: 1 });
  const stored = Buffer.from(credential.passwordHash, 'hex');
  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}

export async function replaceAdminPassword(credential, newPassword) {
  const passwordData = await hashPassword(newPassword);
  const updated = await AdminCredential.findOneAndUpdate(
    {
      _id: 'admin',
      passwordHash: credential.passwordHash,
      salt: credential.salt,
      sessionVersion: credential.sessionVersion,
    },
    { $set: passwordData },
    { new: true, runValidators: true }
  );
  return updated;
}
