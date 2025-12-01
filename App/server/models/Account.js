const { Schema, model } = require("mongoose");

// single bank account (checking or savings)
const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    accountType: { type: String, enum: ["checking", "savings"], required: true },

    balance: { type: Number, default: 0 },

    accountNumber: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

module.exports = model("Account", AccountSchema);
