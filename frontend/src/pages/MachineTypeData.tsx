import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import EditMachinetypeModal from "../components/EditMachinetypeModal";
import AddMachinetypeModal from "../components/AddMachinetypeModal";
import MachineTypeGuideModal from "../components/guide/MachineTypeGuide";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";
import { FileXls, Question } from "@phosphor-icons/react";

interface Machinetype {
  id: number;
  objecttype: string;
  description: string;
  active: string;
}

const MachineTypeData: React.FC = () => {
  const [machinetypes, setMachinetypes] = useState<Machinetype[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Y"); // default Y
  const [dateFilter, setDateFilter] = useState("newest"); // default Terbaru
  const [selectedMachinetype, setSelectedMachinetype] =
    useState<Machinetype | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMachinetypes();
  }, [activeFilter, dateFilter]); // Re-fetch data when activeFilter or dateFilter changes

  const fetchMachinetypes = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINETYPE",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "id, objecttype, description, active",
      pageno: "0",
      recordperpage: "9999999999",
      condition: {
        active: {
          operator: "eq",
          value: activeFilter, // Dynamic value based on activeFilter
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
        // Sorting berdasarkan dateFilter
        const sortedMachinetypes = result.data.sort(
          (a: Machinetype, b: Machinetype) => {
            return dateFilter === "newest" ? b.id - a.id : a.id - b.id;
          }
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

  const filteredItems = machinetypes.filter(
    (machinetype) =>
      machinetype.objecttype
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machinetype.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Machine Types");
    XLSX.writeFile(workbook, "FilteredMachineTypes.xlsx");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded border border-gray-300">
      <header className="p-6 bg-[#385878] text-white flex justify-between items-center">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          Machine Type Data
          <Question
            size={32}
            weight="regular"
            className="cursor-pointer duration-200 hover:scale-105" // Tambahkan kelas di sini
            onClick={() => setGuideModalOpen(true)}
          />
        </h1>
      </header>
      <main className="flex flex-col flex-1 overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
          >
            Add Data
          </button>
          <div className="flex items-center gap-4">
            {/* Dropdown untuk filter Terbaru dan Terlama */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
            >
              <option value="newest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            {/* Dropdown untuk filter Active dan Inactive */}
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
            >
              <option value="Y">Active</option>
              <option value="N">Inactive</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
            />

            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-200"
            >
              Export to
              <FileXls size={20} weight="bold" />
            </button>
          </div>
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
                  <td className="py-4 px-6 border-b text-center w-12">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machinetype.objecttype}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machinetype.description}
                  </td>
                  <td className="py-4 px-6 border-b text-center w-24">
                    {machinetype.active}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(machinetype)}
                      className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-1 px-3 py-1 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "text-gray-700 hover:text-[#385878]"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 transition-colors duration-200 ${
                  currentPage === pageNumber
                    ? "text-white bg-[#385878] rounded-full"
                    : "text-gray-700 hover:text-white hover:bg-[#385878] rounded-full"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 px-3 py-1 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "text-gray-700 hover:text-[#385878]"
            }`}
          >
            &gt;
          </button>
        </div>
      </main>

      {modalOpen && selectedMachinetype && (
        <EditMachinetypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdate}
          machinetype={selectedMachinetype}
        />
      )}

      {addModalOpen && (
        <AddMachinetypeModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {guideModalOpen && (
        <MachineTypeGuideModal
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MachineTypeData;
