import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils"; // Menggunakan enkripsi yang sama

interface MachineGroup {
  id: number;
  objecttype_id: number;
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
    objecttype_id: machineGroup.objecttype_id,
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
        const response = await axios.get("/api/machinetype");
        setObjectTypes(response.data);
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

    // Format JSON data yang akan dienkripsi
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEGROUP",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype_id: formData.objecttype_id,
        objectgroup: formData.objectgroup,
        description: formData.description,
        active: formData.active,
      },
      condition: {
        id: machineGroup.id,
      },
    };

    // Pretty print JSON
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Encrypt JSON data
    const encryptedMessage = encryptMessage(jsonString);

    // Payload yang akan dikirimkan ke backend
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14),
      localdb: "N",
      message: encryptedMessage,
    };

    setOriginalJson(jsonString); // JSON asli sebelum enkripsi
    setEncryptedMessage(JSON.stringify(payload, null, 2)); // Pretty printed encrypted payload

    try {
      // PUT request ke backend
      const response = await axios.put(
        `/api/machinegroup/${machineGroup.id}`,
        payload
      );
      console.log("Response from backend:", response.data);

      alert("Machine group updated successfully!");
      onUpdate(); // Update list machine group
      onClose(); // Close modal setelah update
    } catch (error) {
      console.error("Error updating machine group:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Machine Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Object Type</label>
            <select
              name="objecttype_id"
              value={formData.objecttype_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Type</option>
              {objectTypes.map((type) => (
                <option key={type.id} value={type.id}>
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
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="flex space-x-4 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  checked={formData.active === "Y"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="N"
                  checked={formData.active === "N"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
          >
            Cancel
          </button>
        </form>

        {originalJson && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Original JSON</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {originalJson}
            </pre>
          </div>
        )}

        {encryptedMessage && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Encrypted Message</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {encryptedMessage}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMachineGroupModal;
