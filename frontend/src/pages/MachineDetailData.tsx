import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMachineDetailModal from "../components/AddMachineDetailModal";
import EditMachineDetailModal from "../components/EditMachineDetailModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils"; // Pastikan import sesuai dengan lokasi sebenarnya

interface MachineDetail {
  id: number;
  objecttype: string;
  objectgroup: string;
  objectid: string;
  objectcode: string;
  objectname: string;
  lat: string;
  long: string;
  active: string;
}

const MachineDetailData: React.FC = () => {
  const [machineDetails, setMachineDetails] = useState<MachineDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachineDetail, setSelectedMachineDetail] =
    useState<MachineDetail | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMachineDetails();
  }, []);

  const fetchMachineDetails = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEDETAIL",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "id, objecttype, objectgroup, objectid, objectcode, objectname, lat, long, active",
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
        const sortedMachineDetails = result.data.sort(
          (a: MachineDetail, b: MachineDetail) => a.id - b.id
        );
        setMachineDetails(sortedMachineDetails);
      } else {
        console.error("Data yang diterima bukan array:", result);
      }
    } catch (err) {
      console.error("Error fetching machine details:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian
  };

  const handleEditClick = (machineDetail: MachineDetail) => {
    setSelectedMachineDetail(machineDetail);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleUpdate = () => {
    fetchMachineDetails();
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  // Hitung index untuk data yang akan ditampilkan berdasarkan halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = machineDetails
    .filter((machineDetail) =>
      machineDetail.objectcode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  // Hitung total halaman
  const totalPages = Math.ceil(
    machineDetails.filter((machineDetail) =>
      machineDetail.objectcode.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search object code..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded shadow-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Object Type</th>
              <th className="py-3 px-4 text-left">Object Group</th>
              <th className="py-3 px-4 text-left">Object ID</th>
              <th className="py-3 px-4 text-left">Object Code</th>
              <th className="py-3 px-4 text-left">Object Name</th>
              <th className="py-3 px-4 text-left">Latitude</th>
              <th className="py-3 px-4 text-left">Longitude</th>
              <th className="py-3 px-4 text-left">Active</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((machineDetail) => (
              <tr key={machineDetail.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{machineDetail.id}</td>
                <td className="py-2 px-4 border-b">
                  {machineDetail.objecttype}
                </td>
                <td className="py-2 px-4 border-b">
                  {machineDetail.objectgroup}
                </td>
                <td className="py-2 px-4 border-b">{machineDetail.objectid}</td>
                <td className="py-2 px-4 border-b">
                  {machineDetail.objectcode.trim()}
                </td>
                <td className="py-2 px-4 border-b">
                  {machineDetail.objectname}
                </td>
                <td className="py-2 px-4 border-b">{machineDetail.lat}</td>
                <td className="py-2 px-4 border-b">{machineDetail.long}</td>
                <td className="py-2 px-4 border-b">{machineDetail.active}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(machineDetail)}
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
      {addModalOpen && (
        <AddMachineDetailModal
          onClose={() => setAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {editModalOpen && selectedMachineDetail && (
        <EditMachineDetailModal
          machineDetail={selectedMachineDetail}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MachineDetailData;
