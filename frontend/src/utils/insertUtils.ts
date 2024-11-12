// utils/insertUtils.ts

import axios from "axios";
import { encryptMessage } from "./encryptionUtils";

// Fungsi untuk memformat JSON data untuk INSERT
export const formatInsertJsonData = (
  folder: string,
  record: Record<string, string>
) => {
  return {
    datacore: "MACHINE",
    folder,
    command: "INSERT",
    group: "XCYTUA",
    property: "PJLBBS",
    record,
  };
};

// Fungsi untuk mengirim request insert dengan data terenkripsi
export const sendInsertRequest = async (
  folder: string,
  record: Record<string, string>
) => {
  const jsonData = formatInsertJsonData(folder, record);
  const encryptedMessage = encryptMessage(JSON.stringify(jsonData, null, 2));

  const payload = {
    apikey: import.meta.env.VITE_API_KEY,
    uniqueid: import.meta.env.VITE_UNIQUE_ID,
    timestamp: new Date().toISOString(),
    localdb: "N",
    message: encryptedMessage,
  };

  try {
    const response = await axios.post("/api", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      await axios.post(
        "http://3.0.78.128/notify",
        {
          event: "data_inserted",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`${folder} inserted successfully!`);
    }
  } catch (error) {
    console.error(`Error inserting ${folder}:`, error);
    throw error;
  }
};
