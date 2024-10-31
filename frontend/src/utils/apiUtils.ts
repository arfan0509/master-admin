// utils/apiUtils.ts

import axios from "axios";
import { encryptMessage } from "./encryptionUtils";

// Fungsi untuk memformat JSON data berdasarkan folder dan data
export const formatJsonData = (
  folder: string,
  record: Record<string, string>,
  condition: Record<string, any>
) => {
  return {
    datacore: "MACHINE",
    folder,
    command: "UPDATE",
    group: "XCYTUA",
    property: "PJLBBS",
    record,
    condition,
  };
};

// Fungsi untuk mengirim request dengan data terenkripsi
export const sendEncryptedRequest = async (
  folder: string,
  record: Record<string, string>,
  condition: Record<string, any>
) => {
  const jsonData = formatJsonData(folder, record, condition);
  const encryptedMessage = encryptMessage(JSON.stringify(jsonData, null, 2));

  const payload = {
    apikey: "06EAAA9D10BE3D4386D10144E267B681",
    uniqueid: "JFKlnUZyyu0MzRqj",
    timestamp: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
    localdb: "N",
    message: encryptedMessage,
  };

  try {
    const response = await axios.post("/api", payload);
    
    // Cek apakah status respons adalah 200
    if (response.status === 200) {
      // Kirim notifikasi ke server lain
      await axios.post("https://intern-server-production.up.railway.app/notify", {
        event: "data_inserted",
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(`Notification sent for ${folder}`);
    }

    // console.log(`${folder} updated successfully!`);
  } catch (error) {
    console.error(`Error updating ${folder}:`, error);
    throw error;
  }
};