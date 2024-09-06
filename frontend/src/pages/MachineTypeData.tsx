import React, { useState, useEffect } from "react";
import axios from "axios";
import EditMachinetypeModal from "../components/EditMachinetypeModal";
import AddMachinetypeModal from "../components/AddMachinetypeModal";

interface Machinetype {
  id: number;
  objecttype: string;
  description: string;
  active: string;
}

const MachineTypeData: React.FC = () => {
  const [machinetypes, setMachinetypes] = useState<Machinetype[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachinetype, setSelectedMachinetype] =
    useState<Machinetype | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchMachinetypes();
  }, []);

  const fetchMachinetypes = async () => {
    try {
      const response = await axios.get("/api/machinetype");
      const sortedMachinetypes = response.data.sort((a, b) => a.id - b.id);
      setMachinetypes(sortedMachinetypes);
    } catch (err) {
      console.error("Error fetching machinetypes:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (machinetype: Machinetype) => {
    setSelectedMachinetype(machinetype);
    setModalOpen(true);
  };

  const handleAdd = () => {
    fetchMachinetypes();
    setAddModalOpen(false);
  };

  const handleUpdate = () => {
    fetchMachinetypes();
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 transform duration-200"
        >
          Add Data
        </button>
        <input
          type="text"
          placeholder="Search objecttype..."
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
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Active</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machinetypes
            .filter((machinetype) =>
              machinetype.objecttype
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((machinetype) => (
              <tr key={machinetype.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{machinetype.id}</td>
                <td className="py-2 px-4 border-b">{machinetype.objecttype}</td>
                <td className="py-2 px-4 border-b">
                  {machinetype.description}
                </td>
                <td className="py-2 px-4 border-b">{machinetype.active}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(machinetype)}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 transform duration-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {modalOpen && selectedMachinetype && (
        <EditMachinetypeModal
          machinetype={selectedMachinetype}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {addModalOpen && (
        <AddMachinetypeModal
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default MachineTypeData;
