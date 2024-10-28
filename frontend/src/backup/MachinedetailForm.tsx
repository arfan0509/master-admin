import { useState, useEffect } from "react";
import axios from "axios";

const MachinedetailForm = () => {
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
  const [machineTypes, setMachineTypes] = useState([]);
  const [machineGroups, setMachineGroups] = useState([]);
  const [machineIds, setMachineIds] = useState([]);

  useEffect(() => {
    const fetchMachineTypes = async () => {
      try {
        const response = await axios.get("/api/machinetype");
        setMachineTypes(response.data);
      } catch (error) {
        console.error("Error fetching machine types:", error);
      }
    };

    const fetchMachineGroups = async () => {
      try {
        const response = await axios.get("/api/machinegroup");
        setMachineGroups(response.data);
      } catch (error) {
        console.error("Error fetching machine groups:", error);
      }
    };

    const fetchMachineIds = async () => {
      try {
        const response = await axios.get("/api/machineid");
        setMachineIds(response.data);
      } catch (error) {
        console.error("Error fetching machine IDs:", error);
      }
    };

    fetchMachineTypes();
    fetchMachineGroups();
    fetchMachineIds();
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
    try {
      await axios.post("/api/machinedetail", formData);
      alert("Machine detail created successfully!");
    } catch (error) {
      console.error(
        "Error creating machine detail:",
        error.response?.data || error.message
      );
    }
  };

  return (
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
          {machineGroups.map((group) => (
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
          {machineIds.map((id) => (
            <option key={id.id} value={id.id}>
              {id.objectid}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Object Code</label>
        <input
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
        <div className="flex items-center space-x-4 mt-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="active"
              value="Y"
              checked={formData.active === "Y"}
              onChange={handleChange}
              className="form-radio"
              required
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="active"
              value="N"
              checked={formData.active === "N"}
              onChange={handleChange}
              className="form-radio"
              required
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
    </form>
  );
};

export default MachinedetailForm;
