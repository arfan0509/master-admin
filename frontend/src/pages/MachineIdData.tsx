import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import EditMachineIdModal from "../components/EditMachineIdModal";
import AddMachineIdModal from "../components/AddMachineIdModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";
import { FileXls, Question } from "@phosphor-icons/react";
import MachineIdGuide from "../components/guide/MachineIdGuide";

interface MachineId {
  id: number;
  objecttype: string;
  objectgroup: string;
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
  const [activeFilter, setActiveFilter] = useState("Y"); // default Y
  const [dateFilter, setDateFilter] = useState("newest"); // default terbaru
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMachineIds();
  }, [activeFilter, dateFilter]); // Re-fetch data when activeFilter or dateFilter changes

  const fetchMachineIds = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEID",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "id, objecttype, objectgroup, objectid, objectname, icongroup, iconid, countryid, stateid, cityid, regionid, lat, long, active",
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
        const sortedMachineIds = result.data.sort(
          (a: MachineId, b: MachineId) => {
            if (dateFilter === "newest") {
              return b.id - a.id; // Terbaru
            } else {
              return a.id - b.id; // Terlama
            }
          }
        );
        setMachineIds(sortedMachineIds);
      } else {
        console.error("Data yang diterima bukan array:", result);
      }
    } catch (err) {
      console.error("Error fetching machine IDs:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (machineId: MachineId) => {
    setSelectedMachineId(machineId);
    setModalOpen(true);
  };

  const handleAdd = () => {
    fetchMachineIds();
    setAddModalOpen(false);
  };

  const handleUpdate = () => {
    fetchMachineIds();
  };

  const filteredItems = machineIds.filter(
    (machineId) =>
      machineId.objecttype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machineId.objectgroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machineId.objectid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machineId.objectname.toLowerCase().includes(searchQuery.toLowerCase())
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Machine IDs");
    XLSX.writeFile(workbook, "FilteredMachineIDs.xlsx");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 rounded border border-gray-300">
      <header className="p-6 bg-[#385878] text-white flex justify-between items-center">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          Machine ID Data
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

        {/* Table Container with Scroll */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-800 sticky top-[-0.5px] z-10">
              <tr>
                <th className="py-4 px-6 text-left whitespace-nowrap w-16">
                  No
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Object Type
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Object Group
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Object ID
                </th>
                <th className="py-4 px-6 pr-28 text-left whitespace-nowrap w-40">
                  Object Name
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Icon Group
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Icon ID
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Country ID
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  State ID
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  City ID
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Region ID
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Latitude
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Longitude
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-24">
                  Active
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((machineId, index) => (
                <tr key={machineId.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b text-center w-12">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">{machineId.objecttype}</td>
                  <td className="py-4 px-6 border-b">
                    {machineId.objectgroup}
                  </td>
                  <td className="py-4 px-6 border-b whitespace-nowrap">
                    {machineId.objectid}
                  </td>
                  <td className="py-4 px-6 border-b">{machineId.objectname}</td>
                  <td className="py-4 px-6 border-b">{machineId.icongroup}</td>
                  <td className="py-4 px-6 border-b">{machineId.iconid}</td>
                  <td className="py-4 px-6 border-b">{machineId.countryid}</td>
                  <td className="py-4 px-6 border-b">{machineId.stateid}</td>
                  <td className="py-4 px-6 border-b">{machineId.cityid}</td>
                  <td className="py-4 px-6 border-b">{machineId.regionid}</td>
                  <td className="py-4 px-6 border-b">{machineId.lat}</td>
                  <td className="py-4 px-6 border-b">{machineId.long}</td>
                  <td className="py-4 px-6 border-b text-center w-24">
                    {machineId.active}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(machineId)}
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

          {/* Logic for Pagination with Ellipsis */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isPageNearCurrent =
              pageNumber === 1 ||
              pageNumber === totalPages ||
              Math.abs(currentPage - pageNumber) <= 1;

            // Display button if page is near the current page or first/last page
            if (isPageNearCurrent) {
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
            }

            // Display ellipsis button if there’s a gap between the displayed pages
            const showLeftEllipsis = pageNumber === 2 && currentPage > 3;
            const showRightEllipsis =
              pageNumber === totalPages - 1 && currentPage < totalPages - 2;

            if (showLeftEllipsis || showRightEllipsis) {
              return (
                <span
                  key={`ellipsis-${pageNumber}`}
                  className="mx-1 px-3 py-1 text-gray-700"
                >
                  ...
                </span>
              );
            }

            return null;
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
      {modalOpen && selectedMachineId && (
        <EditMachineIdModal
          machineId={selectedMachineId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {addModalOpen && (
        <AddMachineIdModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {guideModalOpen && (
        <MachineIdGuide
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MachineIdData;
