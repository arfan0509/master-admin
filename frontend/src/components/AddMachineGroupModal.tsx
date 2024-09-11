import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import { fetchMachineTypes } from "../utils/dropdownUtils"; // Assuming you have a utility for fetching machine types

interface AddMachineGroupModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AddMachineGroupModal: React.FC<AddMachineGroupModalProps> = ({
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    objecttype: "", // updated to match dropdown
    objectgroup: "",
    description: "",
    active: "Y", // default value to "Y"
  });

  const [machinetypes, setMachinetypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await fetchMachineTypes();
        setMachinetypes(types);
      } catch (error) {
        console.error("Error fetching machine types:", error);
      }
    };

    fetchData();
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

    // Format the data to be sent
    const message = JSON.stringify(
      {
        datacore: "MACHINE",
        folder: "MACHINEGROUP",
        command: "INSERT",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: formData.objecttype,
          objectgroup: formData.objectgroup,
          description: `'${formData.description}'`,
          active: formData.active,
        },
      },
      null,
      2
    );

    // Encrypt the message
    const encryptedMessage = encryptMessage(message);

    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      const response = await axios.post("/api", payload);

      alert("Machine group created successfully!");
      onUpdate(); // Fetch and update the machine groups list
      onClose(); // Close the modal after add
    } catch (error) {
      console.error("Error creating machine group:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine Group</h2>
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
              {machinetypes.map((type: any) => (
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
      </div>
    </div>
  );
};

export default AddMachineGroupModal;
