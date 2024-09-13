import React, { useState, useEffect } from "react";
import axios from "axios";
import EditMachinetypeModal from "../components/EditMachinetypeModal";
import AddMachinetypeModal from "../components/AddMachinetypeModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMachinetypes();
  }, []);

  const fetchMachinetypes = async () => {
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
      const response = await axios.post("/api", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const decryptedMessage = decryptMessage(response.data.message);
      const result = JSON.parse(decryptedMessage);

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
    setCurrentPage(1);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machinetypes
    .filter((machinetype) =>
      machinetype.objecttype.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    machinetypes.filter((machinetype) =>
      machinetype.objecttype.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded">
      <header className="p-6 bg-[#385878] text-white">
        <h1 className="text-3xl font-semibold">Machine Type Data</h1>
      </header>
      <main className="flex flex-col flex-1 overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
          >
            Add Data
          </button>
          <input
            type="text"
            placeholder="Search objecttype..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
          />
        </div>
        <div className="flex-1">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-800 border-b">
              <tr>
                <th className="py-4 px-6 text-left">No</th>
                <th className="py-4 px-6 text-left">Object Type</th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-6 text-left">Active</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((machinetype, index) => (
                <tr key={machinetype.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machinetype.objecttype}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machinetype.description}
                  </td>
                  <td className="py-4 px-6 border-b">{machinetype.active}</td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(machinetype)}
                      className="bg-[#f39512] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-2 px-4 py-2 border rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#385878] text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-opacity-90 transform transition-all duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>

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
