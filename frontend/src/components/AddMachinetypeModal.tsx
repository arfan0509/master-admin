import React, { useState } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";

const AddMachinetypeModal: React.FC<{
  onClose: () => void;
  onAdd: () => void;
}> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    objecttype: "",
    description: "",
    active: "Y", // Default value to "Y"
  });

  const [originalJSON, setOriginalJSON] = useState<string | null>(null);
  const [encryptedJSON, setEncryptedJSON] = useState<string | null>(null);

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

    // Format data
    const message = JSON.stringify(
      {
        datacore: "MACHINE",
        folder: "MACHINETYPE",
        command: "INSERT",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: formData.objecttype,
          description: formData.description,
          active: formData.active,
        },
      },
      null,
      2
    ); // Pretty print the JSON with indentation

    // Set original JSON to state
    setOriginalJSON(message);

    // Encrypt the message
    const encryptedMessage = encryptMessage(message);

    // Set encrypted JSON to state
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    setEncryptedJSON(JSON.stringify(payload, null, 2));

    try {
      await axios.post("/api/machinetype", payload);
      alert("Machinetype added successfully!");
      onAdd(); // Fetch and update the machinetypes list
      onClose(); // Close the modal after add
    } catch (error) {
      console.error("Error adding machinetype:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Machinetype</h2>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
        {originalJSON && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Original JSON</h3>
            <pre
              className="bg-gray-100 p-4 rounded-md overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              {originalJSON}
            </pre>
          </div>
        )}
        {encryptedJSON && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Encrypted JSON</h3>
            <pre
              className="bg-gray-100 p-4 rounded-md overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              {encryptedJSON}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMachinetypeModal;
