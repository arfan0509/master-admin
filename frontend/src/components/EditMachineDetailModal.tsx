import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils"; // Menggunakan enkripsi yang sama

interface EditMachineDetailModalProps {
  machineDetail: {
    id: number;
    objecttype_id: number;
    objectgroup_id: number;
    objectid_id: number;
    objectcode: string;
    objectname: string;
    lat: string;
    long: string;
    active: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineDetailModal: React.FC<EditMachineDetailModalProps> = ({
  machineDetail,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(machineDetail);
  const [machineTypes, setMachineTypes] = useState<any[]>([]);
  const [machineGroups, setMachineGroups] = useState<any[]>([]);
  const [filteredMachineGroups, setFilteredMachineGroups] = useState<any[]>([]);
  const [machineIds, setMachineIds] = useState<any[]>([]);
  const [filteredMachineIds, setFilteredMachineIds] = useState<any[]>([]);
  const [originalJson, setOriginalJson] = useState<string | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, groupsResponse, idsResponse] = await Promise.all([
          axios.get("/api/machinetype"),
          axios.get("/api/machinegroup"),
          axios.get("/api/machineid"),
        ]);
        setMachineTypes(typesResponse.data);
        setMachineGroups(groupsResponse.data);
        setMachineIds(idsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.objecttype_id) {
      const filteredGroups = machineGroups.filter(
        (group) => group.objecttype_id === parseInt(formData.objecttype_id)
      );
      setFilteredMachineGroups(filteredGroups);
      if (formData.objectgroup_id) {
        const filteredIds = machineIds.filter(
          (id) => id.objectgroup_id === parseInt(formData.objectgroup_id)
        );
        setFilteredMachineIds(filteredIds);
      } else {
        setFilteredMachineIds([]);
      }
    } else {
      setFilteredMachineGroups([]);
      setFilteredMachineIds([]);
    }
  }, [
    formData.objecttype_id,
    formData.objectgroup_id,
    machineGroups,
    machineIds,
  ]);

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
      folder: "MACHINEDETAIL",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype_id: formData.objecttype_id,
        objectgroup_id: formData.objectgroup_id,
        objectid_id: formData.objectid_id,
        objectcode: formData.objectcode,
        objectname: formData.objectname,
        lat: formData.lat,
        long: formData.long,
        active: formData.active,
      },
      condition: {
        id: machineDetail.id,
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
        `/api/machinedetail/${machineDetail.id}`,
        payload
      );
      // console.log("Response from backend:", response.data);

      alert("Machine detail updated successfully!");
      onUpdate(); // Update list machine details
      onClose(); // Close modal setelah update
    } catch (error) {
      console.error("Error updating machine detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine Detail</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
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
              {machineTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Group</label>
            <select
              name="objectgroup_id"
              value={formData.objectgroup_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.objectgroup}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object ID</label>
            <select
              name="objectid_id"
              value={formData.objectid_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.map((id) => (
                <option key={id.id} value={id.id}>
                  {id.objectid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Code</label>
            <input
              type="text"
              name="objectcode"
              value={formData.objectcode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Object Name</label>
            <input
              type="text"
              name="objectname"
              value={formData.objectname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Latitude</label>
            <input
              name="lat"
              type="number"
              step="0.0000001"
              value={formData.lat}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Longitude</label>
            <input
              name="long"
              type="number"
              step="0.0000001"
              value={formData.long}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="mt-1 flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  checked={formData.active === "Y"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="active"
                  value="N"
                  checked={formData.active === "N"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
        {originalJson && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Original JSON Data:</h3>
            <pre className="bg-gray-100 p-2 rounded">{originalJson}</pre>
          </div>
        )}
        {encryptedMessage && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Encrypted Payload:</h3>
            <pre className="bg-gray-100 p-2 rounded">{encryptedMessage}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMachineDetailModal;
