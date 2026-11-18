import mongoose from 'mongoose';

const adminCredentialSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'admin' },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    sessionVersion: { type: String, required: true },
  },
  { collection: 'adminCredentials', timestamps: true, versionKey: false }
);

export default mongoose.model('AdminCredential', adminCredentialSchema);
