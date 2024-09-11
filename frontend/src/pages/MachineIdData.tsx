import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineIdModal from "../components/AddMachineIdModal";
import EditMachineIdModal from "../components/EditMachineIdModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils"; // Pastikan import sesuai dengan lokasi sebenarnya

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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMachineIds();
  }, []);

  const fetchMachineIds = async () => {
    // Menyiapkan data untuk POST
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
    // console.log("Selected Machine ID:", machineId); // Tambahkan log ini
    setSelectedMachineId(machineId);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleUpdate = () => {
    fetchMachineIds();
    setEditModalOpen(false);
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
          placeholder="Search object ID..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded shadow-sm w-full sm:w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="max-w-5xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Object Type</th>
                <th className="py-3 px-4 text-left">Object Group</th>
                <th className="py-3 px-4 text-left">Object ID</th>
                <th className="py-3 px-4 text-left">Object Name</th>
                <th className="py-3 px-4 text-left">Icon Group</th>
                <th className="py-3 px-4 text-left">Icon ID</th>
                <th className="py-3 px-4 text-left">Country ID</th>
                <th className="py-3 px-4 text-left">State ID</th>
                <th className="py-3 px-4 text-left">City ID</th>
                <th className="py-3 px-4 text-left">Region ID</th>
                <th className="py-3 px-4 text-left">Lat</th>
                <th className="py-3 px-4 text-left">Long</th>
                <th className="py-3 px-4 text-left">Active</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((machineId, index) => (
                <tr key={machineId.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{machineId.objecttype}</td>
                  <td className="py-2 px-4 border-b">
                    {machineId.objectgroup}
                  </td>
                  <td className="py-2 px-4 border-b">{machineId.objectid}</td>
                  <td className="py-2 px-4 border-b">{machineId.objectname}</td>
                  <td className="py-2 px-4 border-b">{machineId.icongroup}</td>
                  <td className="py-2 px-4 border-b">{machineId.iconid}</td>
                  <td className="py-2 px-4 border-b">{machineId.countryid}</td>
                  <td className="py-2 px-4 border-b">{machineId.stateid}</td>
                  <td className="py-2 px-4 border-b">{machineId.cityid}</td>
                  <td className="py-2 px-4 border-b">{machineId.regionid}</td>
                  <td className="py-2 px-4 border-b">{machineId.lat}</td>
                  <td className="py-2 px-4 border-b">{machineId.long}</td>
                  <td className="py-2 px-4 border-b">{machineId.active}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEditClick(machineId)}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 transform duration-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {editModalOpen && selectedMachineId && (
        <EditMachineIdModal
          machineId={selectedMachineId}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {addModalOpen && (
        <AddMachineIdModal
          onClose={() => setAddModalOpen(false)}
          onUpdate={() => fetchMachineIds} // Memastikan data diperbarui setelah modal ditutup
        />
      )}
    </div>
  );
};

export default MachineIdData;
