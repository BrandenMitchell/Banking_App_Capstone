const { Schema, model } = require("mongoose");

// single bank account (checking or savings)
const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    accountType: { type: String, enum: ["checking", "savings", "credit"], required: true },

    balance: { type: Number, default: 0 },

    accountNumber: { type: String, unique: true, required: true },

    // Plaid-specific fields
    plaidAccessToken: { type: String },
    plaidItemId: { type: String },
    plaidAccountId: { type: String },
    institutionName: { type: String },
    institutionId: { type: String },
    mask: { type: String }, // last 4 digits of account
    officialName: { type: String }, // full account name from bank
    subtype: { type: String }, // checking, savings, credit card, etc.
    availableBalance: { type: Number },
    currentBalance: { type: Number },
    lastSynced: { type: Date },
  },
  { timestamps: true }
);

module.exports = model("Account", AccountSchema);
