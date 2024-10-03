import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineGroupModal from "../components/AddMachineGroupModal";
import EditMachineGroupModal from "../components/EditMachineGroupModal";
import { decryptMessage, encryptMessage } from "../utils/encryptionUtils";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortKey, setSortKey] = useState<keyof MachineGroup>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchMachineGroups();
  }, []);

  const fetchMachineGroups = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEGROUP",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "id, objecttype, objectgroup, description, active",
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
        const sortedMachineGroups = result.data.sort(
          (a: MachineGroup, b: MachineGroup) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
            return 0;
          }
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
    setCurrentPage(1);
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

  const handleSort = (key: keyof MachineGroup) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    fetchMachineGroups();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machineGroups
    .filter((machineGroup) =>
      machineGroup.objectgroup.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    machineGroups.filter((machineGroup) =>
      machineGroup.objectgroup.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded border border-gray-300">
      <header className="p-6 bg-[#385878] text-white">
        <h1 className="text-3xl font-semibold">Machine Group Data</h1>
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
            placeholder="Search objectgroup..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
          />
        </div>
        <div className="flex-1">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-800 border-b">
              <tr>
                <th
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  No {sortKey === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("objecttype")}
                >
                  Object Type{" "}
                  {sortKey === "objecttype" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("objectgroup")}
                >
                  Object Group{" "}
                  {sortKey === "objectgroup" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-6 text-left">Active</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((machineGroup, index) => (
                <tr key={machineGroup.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineGroup.objecttype}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineGroup.objectgroup}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineGroup.description}
                  </td>
                  <td className="py-4 px-6 border-b">{machineGroup.active}</td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(machineGroup)}
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
