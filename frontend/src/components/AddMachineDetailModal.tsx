import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils"; // Pastikan enkripsi diimport

const AddMachineDetailModal: React.FC<AddMachineDetailModalProps> = ({
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    objecttype_id: "",
    objectgroup_id: "",
    objectid_id: "",
    objectcode: "",
    objectname: "",
    lat: "",
    long: "",
    active: "",
  });

  const [machineTypes, setMachineTypes] = useState<any[]>([]);
  const [machineGroups, setMachineGroups] = useState<any[]>([]);
  const [machineIds, setMachineIds] = useState<any[]>([]);
  const [filteredMachineGroups, setFilteredMachineGroups] = useState<any[]>([]);
  const [filteredMachineIds, setFilteredMachineIds] = useState<any[]>([]);

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
    } else {
      setFilteredMachineGroups([]);
      setFormData({ ...formData, objectgroup_id: "", objectid_id: "" });
    }
  }, [formData.objecttype_id, machineGroups]);

  useEffect(() => {
    if (formData.objecttype_id && formData.objectgroup_id) {
      const filteredIds = machineIds.filter(
        (id) =>
          id.objecttype_id === parseInt(formData.objecttype_id) &&
          id.objectgroup_id === parseInt(formData.objectgroup_id)
      );
      setFilteredMachineIds(filteredIds);
    } else {
      setFilteredMachineIds([]);
      setFormData({ ...formData, objectid_id: "" });
    }
  }, [formData.objecttype_id, formData.objectgroup_id, machineIds]);

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
        folder: "MACHINEDETAIL",
        command: "INSERT",
        group: "XCYTUA",
        property: "PJLBBS",
        record: formData,
      },
      null,
      2
    );

    // Encrypt the message
    const encryptedMessage = encryptMessage(message);

    // Prepare payload
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      const response = await axios.post("/api/machinedetail", payload);
      console.log("Response from backend:", response.data); // Log the response from backend
      alert("Machine detail created successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error creating machine detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine Detail</h2>
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
              {machineTypes.map((type: any) => (
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
              disabled={!formData.objecttype_id}
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.length > 0 ? (
                filteredMachineGroups.map((group: any) => (
                  <option key={group.id} value={group.id}>
                    {group.objectgroup}
                  </option>
                ))
              ) : (
                <option value="">No available options</option>
              )}
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
              disabled={!formData.objectgroup_id}
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.length > 0 ? (
                filteredMachineIds.map((id: any) => (
                  <option key={id.id} value={id.id}>
                    {id.objectid}
                  </option>
                ))
              ) : (
                <option value="">No available options</option>
              )}
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
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineDetailModal;
