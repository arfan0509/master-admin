import axios from "axios";
import { encryptMessage, decryptMessage } from "./encryptionUtils"; // Sesuaikan dengan lokasi sebenarnya

// Fungsi umum untuk mengambil data dari server dengan parameter yang berbeda
const fetchDropdownData = async (folder: string, fields: string, condition: any): Promise<any[]> => {
  const requestPayload = {
    datacore: "MACHINE",
    folder,
    command: "SELECT",
    group: "XCYTUA",
    property: "PJLBBS",
    fields,
    pageno: "0",
    recordperpage: "20",
    condition,
  };

  const message = JSON.stringify(requestPayload, null, 2);
  const encryptedMessage = encryptMessage(message);
  const payload = {
    apikey: "06EAAA9D10BE3D4386D10144E267B681",
    uniqueid: "JFKlnUZyyu0MzRqj",
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

    const decryptedMessage = decryptMessage(response.data.message);
    const result = JSON.parse(decryptedMessage);

    if (Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("Data yang diterima bukan array:", result);
      return [];
    }
  } catch (err) {
    console.error("Error fetching dropdown data:", err);
    return [];
  }
};

// Fungsi untuk mengambil data machinetypes
export const fetchMachineTypes = async (): Promise<any[]> => {
  return fetchDropdownData("MACHINETYPE", "id, objecttype, description, active", {
    active: {
      operator: "eq",
      value: "Y",
    },
  });
};

// Fungsi untuk mengambil data machinegroups
export const fetchMachineGroups = async (): Promise<any[]> => {
  return fetchDropdownData("MACHINEGROUP", "id, objecttype, objectgroup, description, active", {
    active: {
      operator: "eq",
      value: "Y",
    },
  });
};

// Fungsi untuk mengambil data machineid
export const fetchMachineIds = async (): Promise<any[]> => {
  return fetchDropdownData(
    "MACHINEID",
    "id, objecttype, objectgroup, objectid, objectname, active",
    {
      active: {
        operator: "eq",
        value: "Y",
      },
    }
  );
};

// Fungsi untuk mengambil data machinedetail
export const fetchMachineDetails = async (): Promise<any[]> => {
  return fetchDropdownData(
    "MACHINEDETAIL",
    "id, objecttype, objectgroup, objectid, objectcode, objectname, active",
    {
      active: {
        operator: "eq",
        value: "Y",
      },
    }
  );
};
