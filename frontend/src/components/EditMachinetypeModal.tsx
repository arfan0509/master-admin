import React, { useState } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";

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

  const [originalJson, setOriginalJson] = useState<string | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

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

    // Format JSON data sesuai dengan format yang diharapkan backend
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINETYPE",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        description: formData.description,
        active: formData.active,
      },
      condition: {
        objecttype: {
          operator: "eq",
          value: formData.objecttype,
        },
      },
    };

    // Convert JSON data to pretty-printed string
    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print JSON with indentation

    // Encrypt JSON data
    const encryptedMessage = encryptMessage(jsonString);

    // Prepare payload with pretty-printed JSON
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

    // Set state for original JSON and encrypted message (pretty-printed payload)
    setOriginalJson(JSON.stringify(jsonData, null, 2)); // Pretty print original JSON
    setEncryptedMessage(JSON.stringify(payload, null, 2)); // Pretty print the encrypted payload

    try {
      // Send PUT request with encrypted payload
      const response = await axios.put(
        `/api/machinetype/${machinetype.id}`, // PUT request
        payload
      );
      console.log("Response from backend:", response.data);

      alert("Machinetype updated successfully!");
      onUpdate(); // Fetch and update the machinetypes list
      onClose(); // Close the modal after update
    } catch (error) {
      console.error("Error updating machinetype:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Update Machinetype</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Object Type</label>
            <input
              name="objecttype"
              value={formData.objecttype}
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
            Submit
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

export default EditMachinetypeModal;
