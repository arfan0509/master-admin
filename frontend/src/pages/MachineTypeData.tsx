import React, { useState, useEffect } from "react";
import axios from "axios";
import EditMachinetypeModal from "../components/EditMachinetypeModal";
import AddMachinetypeModal from "../components/AddMachinetypeModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils"; // Pastikan import sesuai dengan lokasi sebenarnya

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
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const itemsPerPage = 10; // Jumlah item per halaman

  useEffect(() => {
    fetchMachinetypes();
  }, []);

  const fetchMachinetypes = async () => {
    // Menyiapkan data untuk POST
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINETYPE",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "id, objecttype, description, active",
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
        const sortedMachinetypes = result.data.sort(
          (a: Machinetype, b: Machinetype) => a.id - b.id
        );
        setMachinetypes(sortedMachinetypes);
      } else {
        console.error("Data yang diterima bukan array:", result);
      }
    } catch (err) {
      console.error("Error fetching machinetypes:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset halaman saat pencarian dilakukan
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

  // Hitung index untuk data yang akan ditampilkan berdasarkan halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machinetypes
    .filter((machinetype) =>
      machinetype.objecttype.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem); // Menampilkan data yang sesuai halaman

  // Hitung total halaman
  const totalPages = Math.ceil(
    machinetypes.filter((machinetype) =>
      machinetype.objecttype.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
            <th className="py-3 px-4 text-left">No</th>
            <th className="py-3 px-4 text-left">Object Type</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Active</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((machinetype, index) => (
            <tr key={machinetype.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {indexOfFirstItem + index + 1}
              </td>
              <td className="py-2 px-4 border-b">{machinetype.objecttype}</td>
              <td className="py-2 px-4 border-b">{machinetype.description}</td>
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
