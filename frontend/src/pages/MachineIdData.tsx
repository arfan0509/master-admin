import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineIdModal from "../components/AddMachineIdModal"; // Make sure to create this modal
import EditMachineIdModal from "../components/EditMachineIdModal"; // Make sure to create this modal
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";

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
  const [selectedMachineId, setSelectedMachineId] = useState<MachineId | null>(
    null
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchMachineIds();
  }, []);

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
        const sortedMachineIds = result.data.sort(
          (a: MachineId, b: MachineId) => a.id - b.id
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
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleUpdate = () => {
    fetchMachineIds();
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machineIds
    .filter((machineId) =>
      machineId.objectname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    machineIds.filter((machineId) =>
      machineId.objectname.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded border border-gray-300 max-w-[1200px]">
      <header className="p-6 bg-[#385878] text-white">
        <h1 className="text-3xl font-semibold">Machine ID Data</h1>
      </header>
      <main className="flex flex-col flex-1 overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleAddClick}
            className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
          >
            Add Data
          </button>
          <input
            type="text"
            placeholder="Search object name..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
          />
        </div>
        <div className="flex-1 overflow-x-auto max-w">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-800 border-b">
              <tr>
                <th className="py-4 px-6 text-left">No</th>
                <th className="py-4 px-6 text-left">Object Type</th>
                <th className="py-4 px-6 text-left">Object Group</th>
                <th className="py-4 px-6 text-left">Object ID</th>
                <th className="py-4 px-6 text-left">Object Name</th>
                <th className="py-4 px-6 text-left">Icon Group</th>
                <th className="py-4 px-6 text-left">Icon ID</th>
                <th className="py-4 px-6 text-left">Country ID</th>
                <th className="py-4 px-6 text-left">State ID</th>
                <th className="py-4 px-6 text-left">City ID</th>
                <th className="py-4 px-6 text-left">Region ID</th>
                <th className="py-4 px-6 text-left">Latitude</th>
                <th className="py-4 px-6 text-left">Longitude</th>
                <th className="py-4 px-6 text-left">Active</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((machineId, index) => (
                <tr key={machineId.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">{machineId.objecttype}</td>
                  <td className="py-4 px-6 border-b">
                    {machineId.objectgroup}
                  </td>
                  <td className="py-4 px-6 border-b">{machineId.objectid}</td>
                  <td className="py-4 px-6 border-b">{machineId.objectname}</td>
                  <td className="py-4 px-6 border-b">{machineId.icongroup}</td>
                  <td className="py-4 px-6 border-b">{machineId.iconid}</td>
                  <td className="py-4 px-6 border-b">{machineId.countryid}</td>
                  <td className="py-4 px-6 border-b">{machineId.stateid}</td>
                  <td className="py-4 px-6 border-b">{machineId.cityid}</td>
                  <td className="py-4 px-6 border-b">{machineId.regionid}</td>
                  <td className="py-4 px-6 border-b">{machineId.lat}</td>
                  <td className="py-4 px-6 border-b">{machineId.long}</td>
                  <td className="py-4 px-6 border-b">{machineId.active}</td>
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

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber <= 4 ||
              (currentPage - 2 <= pageNumber &&
                pageNumber <= currentPage + 2) ||
              pageNumber === totalPages
            ) {
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
            return null;
          })}

          {totalPages > 4 && currentPage < totalPages - 2 && (
            <span className="mx-1 text-gray-700">...</span>
          )}

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

      {/* Modal untuk menambahkan data */}
      {addModalOpen && (
        <AddMachineIdModal
          onClose={() => setAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Modal untuk mengedit data */}
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
