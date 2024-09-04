// /middleware/encryptionMiddleware.js
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32-byte key for AES-256
const IV_LENGTH = 16; // AES block size

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const encryptMessage = (req, res, next) => {
  try {
    const { objecttype, description, active } = req.body;
    const privateMessage = {
      datacore: "MACHINE",
      folder: "MACHINETYPE",
      command: "INSERT",
      group: "XCYTUA",
      property: "PJLBBS",
      record: { objecttype, description, active },
    };

    const jsonString = JSON.stringify(privateMessage);
    const encryptedMessage = encrypt(jsonString);

    req.encryptedMessage = encryptedMessage;
    next();
  } catch (error) {
    console.error("Encryption error:", error);
    res.status(500).json({ error: "Encryption failed" });
  }
};
