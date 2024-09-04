import { decryptMessage } from "./encryptionUtils.js";

// Fungsi untuk memproses data terenkripsi dan mengembalikan hasil yang sesuai
export function processEncryptedMessage(encryptedMessage) {
  try {
    // Dekripsi pesan
    const decryptedMessage = decryptMessage(encryptedMessage);

    // Parse JSON dari pesan yang sudah didekripsi
    const jsonResult = JSON.parse(decryptedMessage);

    return jsonResult;
  } catch (err) {
    console.error("Error while processing encrypted message:", err);
    throw new Error("Failed to process encrypted message");
  }
}
