import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import { fetchMachineTypes } from "../utils/dropdownUtils";

interface MachineGroup {
  id: number;
  objecttype: string; // Tipe objek
  objectgroup: string;
  description: string;
  active: string;
}

interface EditMachineGroupModalProps {
  machineGroup: MachineGroup;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineGroupModal: React.FC<EditMachineGroupModalProps> = ({
  machineGroup,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    id: machineGroup.id,
    objecttype: machineGroup.objecttype,
    objectgroup: machineGroup.objectgroup,
    description: machineGroup.description,
    active: machineGroup.active,
  });

  const [objectTypes, setObjectTypes] = useState<
    { id: number; objecttype: string }[]
  >([]);

  const [originalJson, setOriginalJson] = useState<string | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjectTypes = async () => {
      try {
        const response = await fetchMachineTypes();
        setObjectTypes(response);
      } catch (error) {
        console.error("Error fetching object types:", error);
      }
    };

    fetchObjectTypes();
  }, []);

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

    // Format JSON data untuk Machine Group
    const jsonDataMachineGroup = {
      datacore: "MACHINE",
      folder: "MACHINEGROUP",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objectgroup: `'${formData.objectgroup}'`,
        description: `'${formData.description}'`,
        active: `'${formData.active}'`,
      },
      condition: {
        id: {
          operator: "eq",
          value: formData.id,
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
      timestamp: new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14),
      localdb: "N",
      message: encryptedMessageMachineGroup,
    };

    try {
      // Send POST request untuk Machine Group
      await axios.post("/api", payloadMachineGroup);

      // Format JSON data untuk Machine ID
      const jsonDataMachineID = {
        datacore: "MACHINE",
        folder: "MACHINEID",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objectgroup: `'${formData.objectgroup}'`,
        },
        condition: {
          objectgroup: {
            operator: "eq",
            value: machineGroup.objectgroup, // Menyesuaikan dengan objectgroup yang dipilih
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
        timestamp: new Date()
          .toISOString()
          .replace(/[-:.TZ]/g, "")
          .slice(0, 14),
        localdb: "N",
        message: encryptedMessageMachineID,
      };

      // Send POST request untuk Machine ID
      await axios.post("/api", payloadMachineID);

      // Format JSON data untuk Machine Detail
      const jsonDataMachineDetail = {
        datacore: "MACHINE",
        folder: "MACHINEDETAIL",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objectgroup: `'${formData.objectgroup}'`,
        },
        condition: {
          objectgroup: {
            operator: "eq",
            value: machineGroup.objectgroup, // Menyesuaikan dengan objectgroup yang dipilih
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
        timestamp: new Date()
          .toISOString()
          .replace(/[-:.TZ]/g, "")
          .slice(0, 14),
        localdb: "N",
        message: encryptedMessageMachineDetail,
      };

      // Send POST request untuk Machine Detail
      await axios.post("/api", payloadMachineDetail);

      // Format JSON data untuk Machine Profile
      const jsonDataMachineProfile = {
        datacore: "MACHINE",
        folder: "MACHINEPROFILE",
        command: "UPDATE",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objectgroup: `'${formData.objectgroup}'`,
        },
        condition: {
          objectgroup: {
            operator: "eq",
            value: machineGroup.objectgroup, // Menyesuaikan dengan objectgroup yang dipilih
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
        timestamp: new Date()
          .toISOString()
          .replace(/[-:.TZ]/g, "")
          .slice(0, 14),
        localdb: "N",
        message: encryptedMessageMachineProfile,
      };

      // Send POST request untuk Machine Profile
      await axios.post("/api", payloadMachineProfile);

      alert("Machine group and associated records updated successfully!");
      onUpdate(); // Update list machine group
      onClose(); // Close modal setelah update
    } catch (error) {
      console.error("Error updating machine group or related tables:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Object Type</label>
            <select
              name="objecttype"
              value={formData.objecttype}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Type</option>
              {objectTypes.map((type) => (
                <option key={type.id} value={type.objecttype}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Group</label>
            <input
              name="objectgroup"
              value={formData.objectgroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={50}
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="flex items-center mt-5 space-x-6">
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
              className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachineGroupModal;
