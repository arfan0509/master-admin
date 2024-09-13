import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";
import AddMachineProfileModal from "../components/AddMachineProfileModal";
import EditMachineProfileModal from "../components/EditMachineProfileModal";

interface MachineProfile {
  id: number;
  objecttype: string;
  objectgroup: string;
  objectid: string;
  objectcode: string;
  objectstatus: string;
  objectname: string;
  description: string;
  registereddate: string;
  registeredno: string;
  registeredby: string;
  countryoforigin: string;
  dob: string;
  sex: string;
  documentno: string;
  vendor_name: string;
  notes: string;
  photogalery_1: string;
  photogalery_2: string;
  photogalery_3: string;
  photogalery_4: string;
  photogalery_5: string;
  video: string;
  active: string;
}

const columns = [
  { key: "objecttype", name: "Object Type" },
  { key: "objectgroup", name: "Object Group" },
  { key: "objectid", name: "Object ID" },
  { key: "objectcode", name: "Object Code" },
  { key: "objectname", name: "Object Name" },
  { key: "objectstatus", name: "Object Status" },
  { key: "description", name: "Description" },
  { key: "registereddate", name: "Registered Date" },
  { key: "registeredno", name: "Registered No" },
  { key: "registeredby", name: "Registered By" },
  { key: "countryoforigin", name: "Country of Origin" },
  { key: "dob", name: "DOB" },
  { key: "sex", name: "Sex" },
  { key: "documentno", name: "Document No" },
  { key: "vendor_name", name: "Vendor" },
  { key: "notes", name: "Notes" },
  { key: "photogalery_1", name: "Photo Gallery 1" },
  { key: "photogalery_2", name: "Photo Gallery 2" },
  { key: "photogalery_3", name: "Photo Gallery 3" },
  { key: "photogalery_4", name: "Photo Gallery 4" },
  { key: "photogalery_5", name: "Photo Gallery 5" },
  { key: "video", name: "Video" },
  { key: "active", name: "Active" },
];

const MachineProfileData: React.FC = () => {
  const [machineProfiles, setMachineProfiles] = useState<MachineProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachineProfile, setSelectedMachineProfile] =
    useState<MachineProfile | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 5;

  useEffect(() => {
    fetchMachineProfiles();
  }, []);

  const fetchMachineProfiles = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields: "*",
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
        const sortedMachineProfiles = result.data.sort(
          (a: MachineProfile, b: MachineProfile) => a.id - b.id
        );
        setMachineProfiles(sortedMachineProfiles);
      } else {
        console.error("Data yang diterima bukan array:", result);
      }
    } catch (err) {
      console.error("Error fetching machine profiles:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (machineProfile: MachineProfile) => {
    setSelectedMachineProfile(machineProfile);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleUpdate = () => {
    fetchMachineProfiles();
  };

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = machineProfiles
    .filter((profile) =>
      profile.objectname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(
    machineProfiles.filter((profile) =>
      profile.objectname.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / profilesPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 rounded">
      <header className="p-6 bg-[#385878] text-white">
        <h1 className="text-3xl font-semibold">Machine Profile Data</h1>
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
                {columns.map((column) => (
                  <th key={column.key} className="py-4 px-6 text-left">
                    <div className="flex items-center">
                      <span className="truncate">{column.name}</span>
                    </div>
                  </th>
                ))}
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProfiles.map((profile, index) => (
                <tr key={profile.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b">
                    {indexOfFirstProfile + index + 1}
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="py-4 px-6 border-b">
                      {profile[column.key as keyof MachineProfile] || "-"}
                    </td>
                  ))}
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(profile)}
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
              onClick={() => paginate(index + 1)}
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

      {addModalOpen && (
        <AddMachineProfileModal
          onClose={() => setAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {editModalOpen && selectedMachineProfile && (
        <EditMachineProfileModal
          machineProfile={selectedMachineProfile}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MachineProfileData;
