import React, { useState } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook } from "@phosphor-icons/react";

interface Machinetype {
  id: number;
  objecttype: string;
  description: string;
  active: string;
}

interface EditMachinetypeModalProps {
  machinetype: Machinetype;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachinetypeModal: React.FC<EditMachinetypeModalProps> = ({
  machinetype,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    objecttype: machinetype.objecttype,
    description: machinetype.description,
    active: machinetype.active,
  });

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Masukkan atau perbarui Object Type (maks 6 karakter) jika diperlukan.",
    },
    {
      selector: ".description-input",
      content:
        "Masukkan atau perbarui deskripsi (maks 50 karakter) jika diperlukan.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine Type ini aktif/nonaktif.",
    },
    {
      selector: ".submit-button",
      content: "Klik 'Update' untuk menyimpan perubahan pada tipe mesin.",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format JSON data untuk Machine Type
    const jsonDataMachinetype = {
      datacore: "MACHINE",
      folder: "MACHINETYPE",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype: `'${formData.objecttype}'`,
        description: `'${formData.description}'`,
        active: `'${formData.active}'`,
      },
      condition: {
        id: {
          operator: "eq",
          value: machinetype.id,
        },
      },
    };

    // Encrypt JSON data untuk Machine Type
    const encryptedMessageMachinetype = encryptMessage(
      JSON.stringify(jsonDataMachinetype, null, 2)
    );

    // Prepare payload untuk Machine Type
    const payloadMachinetype = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessageMachinetype,
    };

    try {
      // Send PUT request untuk Machine Type
      await axios.post(`/api`, payloadMachinetype);

      // Format JSON data untuk Machine Group
      const jsonDataMachineGroup = {
        datacore: "MACHINE",
        folder: "MACHINEGROUP",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: `'${formData.objecttype}'`,
        },
        condition: {
          objecttype: {
            operator: "eq",
            value: machinetype.objecttype,
          },
        },
      };

      // Encrypt JSON data untuk Machine Group
      const encryptedMessageMachineGroup = encryptMessage(
        JSON.stringify(jsonDataMachineGroup, null, 2)
      );

      // Prepare payload untuk Machine Group
      const payloadMachineGroup = {
        apikey: "06EAAA9D10BE3D4386D10144E267B681",
        uniqueid: "JFKlnUZyyu0MzRqj",
        timestamp: new Date().toISOString(),
        localdb: "N",
        message: encryptedMessageMachineGroup,
      };

      // Send PUT request untuk Machine Group
      await axios.post(`/api`, payloadMachineGroup);

      // Format JSON data untuk Machine ID
      const jsonDataMachineID = {
        datacore: "MACHINE",
        folder: "MACHINEID",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: `'${formData.objecttype}'`,
        },
        condition: {
          objecttype: {
            operator: "eq",
            value: machinetype.objecttype,
          },
        },
      };

      // Encrypt JSON data untuk Machine ID
      const encryptedMessageMachineID = encryptMessage(
        JSON.stringify(jsonDataMachineID, null, 2)
      );

      // Prepare payload untuk Machine ID
      const payloadMachineID = {
        apikey: "06EAAA9D10BE3D4386D10144E267B681",
        uniqueid: "JFKlnUZyyu0MzRqj",
        timestamp: new Date().toISOString(),
        localdb: "N",
        message: encryptedMessageMachineID,
      };

      // Send PUT request untuk Machine ID
      await axios.post(`/api`, payloadMachineID);

      // Format JSON data untuk Machine Detail
      const jsonDataMachineDetail = {
        datacore: "MACHINE",
        folder: "MACHINEDETAIL",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: `'${formData.objecttype}'`,
        },
        condition: {
          objecttype: {
            operator: "eq",
            value: machinetype.objecttype,
          },
        },
      };

      // Encrypt JSON data untuk Machine Detail
      const encryptedMessageMachineDetail = encryptMessage(
        JSON.stringify(jsonDataMachineDetail, null, 2)
      );

      // Prepare payload untuk Machine Detail
      const payloadMachineDetail = {
        apikey: "06EAAA9D10BE3D4386D10144E267B681",
        uniqueid: "JFKlnUZyyu0MzRqj",
        timestamp: new Date().toISOString(),
        localdb: "N",
        message: encryptedMessageMachineDetail,
      };

      // Send PUT request untuk Machine Detail
      await axios.post(`/api`, payloadMachineDetail);

      // Format JSON data untuk Machine Profile
      const jsonDataMachineProfile = {
        datacore: "MACHINE",
        folder: "MACHINEPROFILE",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: `'${formData.objecttype}'`,
        },
        condition: {
          objecttype: {
            operator: "eq",
            value: machinetype.objecttype,
          },
        },
      };

      // Encrypt JSON data untuk Machine Profile
      const encryptedMessageMachineProfile = encryptMessage(
        JSON.stringify(jsonDataMachineProfile, null, 2)
      );

      // Prepare payload untuk Machine Profile
      const payloadMachineProfile = {
        apikey: "06EAAA9D10BE3D4386D10144E267B681",
        uniqueid: "JFKlnUZyyu0MzRqj",
        timestamp: new Date().toISOString(),
        localdb: "N",
        message: encryptedMessageMachineProfile,
      };

      // Send PUT request untuk Machine Profile
      await axios.post(`/api`, payloadMachineProfile);

      alert("Machine type and associated machine groups updated successfully!");
      onUpdate(); // Fetch and update the machine types list
      onClose(); // Close the modal after update
    } catch (error) {
      console.error("Error updating machinetype or related tables:", error);
    }
  };

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)} // Tutup tur saat selesai
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold mb-4">Edit Machine Type</h2>
          <button onClick={handleStartTour} className="p-2">
            <Notebook size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Object Type</label>
            <input
              name="objecttype"
              value={formData.objecttype}
              onChange={handleChange}
              className="objecttype-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={6}
            />
          </div>
          <div>
            <label className="block">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="description-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={50}
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="active-radio flex items-center mt-5 space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  checked={formData.active === "Y"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-[#385878] peer-checked:border-transparent transition duration-200 ease-in-out">
                  <div className="w-3 h-3 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  value="N"
                  checked={formData.active === "N"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-[#385878] peer-checked:border-transparent transition duration-200 ease-in-out">
                  <div className="w-3 h-3 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachinetypeModal;
