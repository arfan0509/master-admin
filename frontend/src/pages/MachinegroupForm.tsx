// src/pages/MachinegroupForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";

const MachinegroupForm = () => {
  const [formData, setFormData] = useState({
    objecttype_id: "",
    objectgroup: "",
    description: "",
    active: "", // Default value to "Y"
  });

  const [objectTypes, setObjectTypes] = useState<
    { id: number; objecttype: string }[]
  >([]);

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
    try {
      await axios.post("/api/machinegroup", formData);
      alert("Machine group created successfully!");
    } catch (error) {
      console.error("Error creating machine group:", error);
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
        Submit
      </button>
    </form>
  );
};

export default MachinegroupForm;
