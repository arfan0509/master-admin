import React, { useState, useEffect } from "react";
import axios from "axios";

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
    try {
      await axios.put(`/api/machinedetail/${machineDetail.id}`, formData);
      alert("Machine detail updated successfully!");
      onUpdate();
      onClose();
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

export default EditMachineDetailModal;
