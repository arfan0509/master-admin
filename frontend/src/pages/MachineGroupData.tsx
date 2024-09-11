import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineGroupModal from "../components/AddMachineGroupModal";
import EditMachineGroupModal from "../components/EditMachineGroupModal";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils"; // Pastikan import sesuai dengan lokasi sebenarnya

interface MachineGroup {
  id: number;
  objecttype: string;
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
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const itemsPerPage = 10; // Jumlah item per halaman

  useEffect(() => {
    fetchMachineGroups();
  }, []);

  const fetchMachineGroups = async () => {
    // Menyiapkan data untuk POST
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEGROUP",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "id, objecttype, objectgroup, description, active",
      pageno: "0",
      recordperpage: "20",
      condition: {
        active: {
          operator: "eq",
          value: "Y",
        },
      },
    };

    const message = JSON.stringify(requestPayload, null, 2);
    const encryptedMessage = encryptMessage(message);
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      // Mengirim request
      const response = await axios.post("/api", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Dekripsi data yang diterima
      const decryptedMessage = decryptMessage(response.data.message);
      const result = JSON.parse(decryptedMessage);

      // Pastikan data yang diterima adalah array
      if (Array.isArray(result.data)) {
        const sortedMachineGroups = result.data.sort(
          (a: MachineGroup, b: MachineGroup) =>
            a.objectgroup.localeCompare(b.objectgroup)
        );
        setMachineGroups(sortedMachineGroups);
      } else {
        console.error("Data yang diterima bukan array:", result);
      }
    } catch (err) {
      console.error("Error fetching machine groups:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset halaman saat pencarian
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

  // Hitung index untuk data yang akan ditampilkan berdasarkan halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machineGroups
    .filter((machineGroup) =>
      machineGroup.objectgroup.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem); // Menampilkan data sesuai halaman

  // Hitung total halaman
  const totalPages = Math.ceil(
    machineGroups.filter((machineGroup) =>
      machineGroup.objectgroup.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          {currentItems.map((machineGroup, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{machineGroup.id}</td>
              <td className="py-2 px-4 border-b">{machineGroup.objecttype}</td>
              <td className="py-2 px-4 border-b">{machineGroup.objectgroup}</td>
              <td className="py-2 px-4 border-b">{machineGroup.description}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-700 border-gray-300"
            } hover:bg-gray-800 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>

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
