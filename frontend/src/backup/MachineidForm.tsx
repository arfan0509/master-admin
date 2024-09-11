// src/pages/MachineidForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";

const MachineidForm = () => {
  const [formData, setFormData] = useState({
    objecttype_id: "",
    objectgroup_id: "",
    objectid: "",
    objectname: "",
    icongroup: "",
    iconid: "",
    countryid: "",
    stateid: "",
    cityid: "",
    regionid: "",
    lat: "",
    long: "",
    active: "", // Default value
  });
  const [machinetypes, setMachinetypes] = useState([]);
  const [machinegroups, setMachinegroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, groupsResponse] = await Promise.all([
          axios.get("/api/machinetype"),
          axios.get("/api/machinegroup"),
        ]);
        setMachinetypes(typesResponse.data);
        setMachinegroups(groupsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    try {
      await axios.post("/api/machineid", formData);
      alert("Machine ID created successfully!");
    } catch (error) {
      console.error("Error creating machine ID:", error);
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
          {machinetypes.map((type) => (
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
          {machinegroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.objectgroup}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Object ID</label>
        <input
          name="objectid"
          value={formData.objectid}
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
        <label className="block">Icon Group</label>
        <input
          name="icongroup"
          value={formData.icongroup}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block">Icon ID</label>
        <input
          name="iconid"
          value={formData.iconid}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block">Country ID</label>
        <input
          name="countryid"
          value={formData.countryid}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block">State ID</label>
        <input
          name="stateid"
          value={formData.stateid}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block">City ID</label>
        <input
          name="cityid"
          value={formData.cityid}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block">Region ID</label>
        <input
          name="regionid"
          value={formData.regionid}
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
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default MachineidForm;
