import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const algorithm = "aes-256-cbc";
const key = process.env.SECRET_KEY;
const iv = process.env.IV; // Ganti dengan kunci rahasia yang aman

// Fungsi untuk enkripsi
export function encryptMessage(message) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted.toUpperCase(); // Menghasilkan output dalam format heksadesimal
}

// Fungsi untuk dekripsi
export function decryptMessage(encryptedMessage) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
