const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  replacedByToken: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken', default: null },
  ip: String,
  userAgent: String,
});

RefreshTokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt.getTime();
};

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
