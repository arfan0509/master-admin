import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineIdModal from "../components/AddMachineIdModal";
import EditMachineIdModal from "../components/EditMachineIdModal";

interface MachineId {
  id: number;
  objecttype_id: number;
  objectgroup_id: number;
  objectid: string;
  objectname: string;
  icongroup: string;
  iconid: string;
  countryid: string;
  stateid: string;
  cityid: string;
  regionid: string;
  lat: string;
  long: string;
  active: string;
}

const MachineIdData: React.FC = () => {
  const [machineIds, setMachineIds] = useState<MachineId[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(
    null
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchMachineIds();
  }, []);

  const fetchMachineIds = async () => {
    try {
      const response = await axios.get("/api/machineid");
      const sortedMachineGroups = response.data.sort((a, b) => a.id - b.id);
      setMachineIds(response.data);
    } catch (err) {
      console.error("Error fetching machine IDs:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (machineId: MachineId) => {
    setSelectedMachineId(machineId);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleUpdate = () => {
    fetchMachineIds();
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Data
        </button>
        <input
          type="text"
          placeholder="Search object ID..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded shadow-sm"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Object Type</th>
            <th className="py-3 px-4 text-left">Object Group</th>
            <th className="py-3 px-4 text-left">Object ID</th>
            <th className="py-3 px-4 text-left">Object Name</th>
            <th className="py-3 px-4 text-left">Icon Group</th>
            <th className="py-3 px-4 text-left">Icon ID</th>
            <th className="py-3 px-4 text-left">Active</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machineIds
            .filter((machineId) =>
              machineId.objectid
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((machineId) => (
              <tr key={machineId.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{machineId.id}</td>
                <td className="py-2 px-4 border-b">
                  {machineId.objecttype_id}
                </td>
                <td className="py-2 px-4 border-b">
                  {machineId.objectgroup_id}
                </td>
                <td className="py-2 px-4 border-b">{machineId.objectid}</td>
                <td className="py-2 px-4 border-b">{machineId.objectname}</td>
                <td className="py-2 px-4 border-b">{machineId.icongroup}</td>
                <td className="py-2 px-4 border-b">{machineId.iconid}</td>
                <td className="py-2 px-4 border-b">{machineId.active}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(machineId)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {addModalOpen && (
        <AddMachineIdModal
          onClose={() => setAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {editModalOpen && selectedMachineId && (
        <EditMachineIdModal
          machineId={selectedMachineId}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MachineIdData;
