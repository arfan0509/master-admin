import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AddMachineProfileModal from "../components/AddMachineProfileModal";
import EditMachineProfileModal from "../components/EditMachineProfileModal";
import { encryptMessage, decryptMessage } from "../utils/encryptionUtils";
import { FileXls, Question } from "@phosphor-icons/react";
import MachineProfileGuide from "../components/guide/MachineProfileGuide";

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
  vendor: string;
  notes: string;
  photogalery_1: string;
  photogalery_2: string;
  photogalery_3: string;
  photogalery_4: string;
  photogalery_5: string;
  video: string;
  active: string;
}

const MachineProfileData: React.FC = () => {
  const [machineProfiles, setMachineProfiles] = useState<MachineProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Y"); // default Y
  const [dateFilter, setDateFilter] = useState("newest"); // default Terbaru (newest)
  const [selectedMachineProfile, setSelectedMachineProfile] =
    useState<MachineProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMachineProfiles();
  }, [activeFilter, dateFilter]); // Fetch data when activeFilter or dateFilter changes

  const fetchMachineProfiles = async () => {
    const requestPayload = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "SELECT",
      group: "XCYTUA",
      property: "PJLBBS",
      fields:
        "id, objecttype, objectgroup, objectid, objectcode, objectstatus, objectname, description, registereddate, registeredno, registeredby, countryoforigin, dob, sex, documentno, vendor, notes, photogalery_1, photogalery_2, photogalery_3, photogalery_4, photogalery_5, video, active",
      pageno: "0",
      recordperpage: "9999999999",
      condition: {
        active: {
          operator: "eq",
          value: activeFilter,
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
        const sortedMachineProfiles = result.data.sort(
          (a: MachineProfile, b: MachineProfile) => {
            if (dateFilter === "newest") {
              return b.id - a.id; // Terbaru
            } else {
              return a.id - b.id; // Terlama
            }
          }
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
    setModalOpen(true);
  };

  const handleAdd = () => {
    fetchMachineProfiles();
    setAddModalOpen(false);
  };

  const handleUpdate = () => {
    fetchMachineProfiles();
  };

  const filteredItems = machineProfiles.filter(
    (machineProfile) =>
      machineProfile.objecttype
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machineProfile.objectgroup
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machineProfile.objectid
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machineProfile.objectcode
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machineProfile.objectname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      machineProfile.vendor.toLowerCase().includes(searchQuery.toLowerCase())
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Machine Profiles");
    XLSX.writeFile(workbook, "FilteredMachineProfiles.xlsx");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 rounded border border-gray-300">
      <header className="p-6 bg-[#385878] text-white flex justify-between items-center">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          Machine Profile Data
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
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Object Code
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Object Status
                </th>
                <th className="py-4 px-6 pr-16 text-left whitespace-nowrap w-40">
                  Object Name
                </th>
                <th className="py-4 px-6 pr-24 text-left whitespace-nowrap w-48">
                  Description
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Registered Date
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Registered No
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Registered By
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Country of Origin
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-32">
                  Date of Birth
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-24">
                  Sex
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Document No
                </th>
                <th className="py-4 px-6 pr-28 text-left whitespace-nowrap w-40">
                  Vendor
                </th>
                <th className="py-4 px-6 pr-20 text-left whitespace-nowrap w-48">
                  Notes
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Photo Gallery 1
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Photo Gallery 2
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Photo Gallery 3
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Photo Gallery 4
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-48">
                  Photo Gallery 5
                </th>
                <th className="py-4 px-6 text-left whitespace-nowrap w-40">
                  Video
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
              {currentItems.map((machineProfile, index) => (
                <tr key={machineProfile.id} className="hover:bg-[#3858780d]">
                  <td className="py-4 px-6 border-b text-center w-12">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.objecttype}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.objectgroup}
                  </td>
                  <td className="py-4 px-6 border-b w-24">
                    {machineProfile.objectid}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.objectcode}
                  </td>
                  <td className="py-4 px-6 border-b text-center">
                    {machineProfile.objectstatus}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.objectname}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.description}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.registereddate}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.registeredno}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.registeredby}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.countryoforigin}
                  </td>
                  <td className="py-4 px-6 border-b whitespace-nowrap">{machineProfile.dob}</td>
                  <td className="py-4 px-6 border-b text-center">{machineProfile.sex}</td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.documentno}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.vendor}
                  </td>
                  <td className="py-4 px-6 border-b">{machineProfile.notes}</td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.photogalery_1}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.photogalery_2}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.photogalery_3}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.photogalery_4}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {machineProfile.photogalery_5}
                  </td>
                  <td className="py-4 px-6 border-b">{machineProfile.video}</td>
                  <td className="py-4 px-6 border-b text-center w-24">
                    {machineProfile.active}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleEditClick(machineProfile)}
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
      {modalOpen && selectedMachineProfile && (
        <EditMachineProfileModal
          machineProfile={selectedMachineProfile}
          isOpen={modalOpen} // Menambahkan isOpen di sini
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {addModalOpen && (
        <AddMachineProfileModal
          isOpen={addModalOpen} // Menambahkan isOpen di sini
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {guideModalOpen && (
        <MachineProfileGuide
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MachineProfileData;
