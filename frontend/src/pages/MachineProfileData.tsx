import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

// Import modal components
import AddMachineProfileModal from "../components/AddMachineProfileModal";
import EditMachineProfileModal from "../components/EditMachineProfileModal";

interface MachineProfile {
  id: number;
  objecttype_name: string; // Update nama properti untuk objecttype
  objectgroup_name: string; // Update nama properti untuk objectgroup
  objectid_name: string; // Update nama properti untuk objectid
  objectcode_name: string; // Update nama properti untuk objectcode
  objectname: string;
  objectstatus: string;
  description: string;
  registereddate: string;
  registeredno: string;
  registeredby: string;
  countryoforigin: string;
  dob: string;
  sex: string;
  documentno: string;
  vendor_name: string; // Ganti dengan vendor_name
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
  { key: "id", name: "ID" },
  { key: "objecttype_name", name: "Object Type" }, // Update kolom untuk nama objecttype
  { key: "objectgroup_name", name: "Object Group" }, // Update kolom untuk nama objectgroup
  { key: "objectid_name", name: "Object ID" }, // Update kolom untuk nama objectid
  { key: "objectcode_name", name: "Object Code" }, // Update kolom untuk nama objectcode
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
  { key: "vendor_name", name: "Vendor" }, // Ganti dengan vendor_name
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

  useEffect(() => {
    fetchMachineProfiles();
  }, []);

  const fetchMachineProfiles = async () => {
    try {
      const response = await axios.get("/api/machineprofile");
      const sortedMachineProfiles = response.data.sort(
        (a: MachineProfile, b: MachineProfile) => a.id - b.id
      );
      setMachineProfiles(sortedMachineProfiles);
    } catch (err) {
      console.error("Error fetching machine profiles:", err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  return (
    <div className="container mx-auto mt-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2 sm:mb-0"
        >
          Add Data
        </button>
        <input
          type="text"
          placeholder="Search object name..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded shadow-sm w-full sm:w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="max-w-5xl overflow-x-auto">
          <table className="min-w-max bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="py-3 px-2 text-left">
                    <div className="flex items-center">
                      <span className="truncate">{column.name}</span>
                      <ResizableBox
                        width={80}
                        height={20}
                        axis="x"
                        minConstraints={[40, 20]}
                        maxConstraints={[200, 20]}
                        className="ml-2"
                      >
                        <div className="w-full h-full cursor-col-resize " />
                      </ResizableBox>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {machineProfiles
                .filter((profile) =>
                  profile.objectname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-100">
                    {columns.map((column) => (
                      <td key={column.key} className="py-2 px-2 border-b">
                        {profile[column.key as keyof MachineProfile] || "-"}
                      </td>
                    ))}
                    <td className="py-2 px-2 border-b">
                      <button
                        onClick={() => handleEditClick(profile)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
