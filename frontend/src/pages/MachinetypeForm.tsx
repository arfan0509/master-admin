// src/pages/MachinetypeForm.tsx
import { useState } from "react";
import axios from "axios";

const MachinetypeForm = () => {
  const [formData, setFormData] = useState({
    objecttype: "",
    description: "",
    active: "", // Default value to "Y"
  });

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
      await axios.post("/api/machinetype", formData);
      alert("Machinetype created successfully!");
    } catch (error) {
      console.error("Error creating machinetype:", error);
    }
  };

  return (
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
    </form>
  );
};

export default MachinetypeForm;
