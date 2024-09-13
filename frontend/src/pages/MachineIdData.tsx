import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineIdModal from "../components/AddMachineIdModal";
import EditMachineIdModal from "../components/EditMachineIdModal";
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
  const [modalOpen, setModalOpen] = useState({ add: false, edit: false });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortKey, setSortKey] = useState<keyof MachineId>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
        const sortedMachineIds = result.data.sort(
          (a: MachineId, b: MachineId) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
            return 0;
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

  const handleAddClick = () => {
    setModalOpen({ add: true, edit: false });
  };

  const handleEditClick = (machineId: MachineId) => {
    setSelectedMachineId(machineId);
    setModalOpen({ add: false, edit: true });
  };

  const handleUpdate = () => {
    fetchMachineIds();
  };

  const handleSort = (key: keyof MachineId) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    fetchMachineIds();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machineIds
    .filter((machineId) =>
      machineId.objectid.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    machineIds.filter((machineId) =>
      machineId.objectid.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded">
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
            placeholder="Search object ID..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#385878]"
          />
        </div>
        <div className="flex-1 overflow-x-auto">
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
                <th
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("objectid")}
                >
                  Object ID{" "}
                  {sortKey === "objectid" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="py-4 px-6 text-left">Object Name</th>
                <th className="py-4 px-6 text-left">Icon Group</th>
                <th className="py-4 px-6 text-left">Icon ID</th>
                <th className="py-4 px-6 text-left">Country ID</th>
                <th className="py-4 px-6 text-left">State ID</th>
                <th className="py-4 px-6 text-left">City ID</th>
                <th className="py-4 px-6 text-left">Region ID</th>
                <th className="py-4 px-6 text-left">Lat</th>
                <th className="py-4 px-6 text-left">Long</th>
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

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-4 py-2 border rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#385878] text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-[#385878] hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>

      {modalOpen.add && (
        <AddMachineIdModal
          onClose={() => setModalOpen({ add: false, edit: false })}
          onUpdate={handleUpdate}
        />
      )}
      {modalOpen.edit && selectedMachineId && (
        <EditMachineIdModal
          machineId={selectedMachineId}
          onClose={() => setModalOpen({ add: false, edit: false })}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MachineIdData;
