const { Schema, model } = require("mongoose");

// debit or credit cards tied to a specific account
const CardSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },

    cardNumber: { type: String, required: true, unique: true },

    expiryDate: { type: String, required: true },

    cvv: { type: String, required: true },

    type: { type: String, enum: ["debit", "credit"], required: true },
  },
  { timestamps: true }
);

module.exports = model("Card", CardSchema);
