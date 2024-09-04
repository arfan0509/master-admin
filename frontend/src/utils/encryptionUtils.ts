import CryptoJS from 'crypto-js';

// Ambil nilai dari environment variables atau hardcode
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; 
const IV = import.meta.env.VITE_IV; 
// Fungsi untuk enkripsi
export function encryptMessage(message: string): string {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);

    const encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
}

// Fungsi untuk dekripsi
export function decryptMessage(encryptedMessage: string): string {
    const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV); // Menggunakan Hex parse untuk IV yang berbentuk hex

    const encryptedHex = CryptoJS.enc.Hex.parse(encryptedMessage);
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedHex);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}
