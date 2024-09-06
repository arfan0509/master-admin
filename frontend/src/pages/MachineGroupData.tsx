import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineGroupModal from "../components/AddMachineGroupModal";
import EditMachineGroupModal from "../components/EditMachineGroupModal";

interface MachineGroup {
  id: number;
  objecttype_id: number;
  objectgroup: string;
  description: string;
  active: string;
}

const MachineGroupData: React.FC = () => {
  const [machineGroups, setMachineGroups] = useState<MachineGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachineGroup, setSelectedMachineGroup] =
    useState<MachineGroup | null>(null);
  const [modalOpen, setModalOpen] = useState({
    add: false,
    edit: false,
  });

  useEffect(() => {
    fetchMachineGroups();
  }, []);

  const fetchMachineGroups = async () => {
    try {
      const response = await axios.get("/api/machinegroup");
      const sortedMachineGroups = response.data.sort((a, b) => a.id - b.id);
      setMachineGroups(sortedMachineGroups);
    } catch (err) {
      console.error("Error fetching machine groups:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddClick = () => {
    setModalOpen({ add: true, edit: false });
  };

  const handleEditClick = (machineGroup: MachineGroup) => {
    setSelectedMachineGroup(machineGroup);
    setModalOpen({ add: false, edit: true });
  };

  const handleUpdate = () => {
    fetchMachineGroups();
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddClick}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 transform duration-200"
        >
          Add Data
        </button>
        <input
          type="text"
          placeholder="Search objectgroup..."
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
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Active</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machineGroups
            .filter((machineGroup) =>
              machineGroup.objectgroup
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((machineGroup) => (
              <tr key={machineGroup.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{machineGroup.id}</td>
                <td className="py-2 px-4 border-b">
                  {machineGroup.objecttype_id}
                </td>
                <td className="py-2 px-4 border-b">
                  {machineGroup.objectgroup}
                </td>
                <td className="py-2 px-4 border-b">
                  {machineGroup.description}
                </td>
                <td className="py-2 px-4 border-b">{machineGroup.active}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(machineGroup)}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 transform duration-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {modalOpen.add && (
        <AddMachineGroupModal
          onClose={() => setModalOpen({ add: false, edit: false })}
          onUpdate={handleUpdate}
        />
      )}
      {modalOpen.edit && selectedMachineGroup && (
        <EditMachineGroupModal
          machineGroup={selectedMachineGroup}
          onClose={() => setModalOpen({ add: false, edit: false })}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MachineGroupData;
