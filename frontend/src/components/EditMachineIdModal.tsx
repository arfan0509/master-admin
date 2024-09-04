import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditMachineIdModalProps {
  machineId: any;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineIdModal: React.FC<EditMachineIdModalProps> = ({
  machineId,
  onClose,
  onUpdate,
}) => {
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
    active: "Y",
  });
  const [machinetypes, setMachinetypes] = useState<any[]>([]);
  const [machinegroups, setMachinegroups] = useState<any[]>([]);
  const [filteredMachinegroups, setFilteredMachinegroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, groupsResponse] = await Promise.all([
          axios.get("/api/machinetype"),
          axios.get("/api/machinegroup"),
        ]);
        setMachinetypes(typesResponse.data);
        setMachinegroups(groupsResponse.data);
        setFormData({
          ...machineId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [machineId]);

  useEffect(() => {
    if (formData.objecttype_id) {
      // Filter machine groups based on selected object type
      const filteredGroups = machinegroups.filter(
        (group) => group.objecttype_id === parseInt(formData.objecttype_id)
      );
      setFilteredMachinegroups(filteredGroups);
    } else {
      setFilteredMachinegroups([]);
    }
  }, [formData.objecttype_id, machinegroups]);

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
      await axios.put(`/api/machineid/${formData.id}`, formData);
      alert("Machine ID updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating machine ID:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine ID</h2>
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
              {machinetypes.map((type: any) => (
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
              {filteredMachinegroups.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.objectgroup}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object ID</label>
            <input
              type="text"
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
              type="text"
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
              type="text"
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
              type="text"
              name="iconid"
              value={formData.iconid}
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
      </div>
    </div>
  );
};

export default EditMachineIdModal;
