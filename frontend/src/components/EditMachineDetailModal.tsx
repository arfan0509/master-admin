/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
} from "../utils/dropdownUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook, Spinner } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor
import { sendEncryptedRequest } from "../utils/apiUtils";

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

interface EditMachineDetailModalProps {
  machineDetail: MachineDetail;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineDetailModal: React.FC<EditMachineDetailModalProps> = ({
  machineDetail,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    id: machineDetail.id,
    objecttype: machineDetail.objecttype,
    objectgroup: machineDetail.objectgroup,
    objectid: machineDetail.objectid,
    objectcode: machineDetail.objectcode,
    objectname: machineDetail.objectname,
    lat: machineDetail.lat,
    long: machineDetail.long,
    active: machineDetail.active,
  });

  const [machinetypes, setMachinetypes] = useState<
    { id: number; objecttype: string }[]
  >([]);
  const [machinegroups, setMachinegroups] = useState<
    { id: number; objecttype: string; objectgroup: string }[]
  >([]);
  const [filteredMachinegroups, setFilteredMachinegroups] = useState<
    { id: number; objecttype: string; objectgroup: string }[]
  >([]);
  const [machineids, setMachineids] = useState<
    {
      id: string;
      objectid: string;
      objectgroup: string;
      lat: string;
      long: string;
    }[]
  >([]);
  const [filteredMachineids, setFilteredMachineids] = useState<
    { id: string; objectid: string; lat: string; long: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups, ids] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
          fetchMachineIds(),
        ]);
        setMachinetypes(types);
        setMachinegroups(groups);
        setFilteredMachinegroups(
          groups.filter(
            (group) => group.objecttype === machineDetail.objecttype
          )
        );
        setMachineids(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [machineDetail]);

  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machinegroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachinegroups(filteredGroups);
    }
  }, [formData.objecttype, machinegroups]);

  useEffect(() => {
    if (formData.objectgroup) {
      const filteredIds = machineids.filter(
        (id) => id.objectgroup === formData.objectgroup
      );
      setFilteredMachineids(filteredIds);
    } else {
      setFilteredMachineids([]);
    }
  }, [formData.objectgroup, machineids]);

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih atau perbarui tipe objek dari opsi yang tersedia jika diperlukan. Pastikan sesuai dengan tipe yang sudah ada.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Pilih atau sesuaikan Object Group jika diperlukan. Pastikan sesuai dengan tipe objek yang dipilih.",
    },
    {
      selector: ".objectid-input",
      content:
        "Masukkan atau perbarui ID objek (maks 10 karakter) jika diperlukan.",
    },
    {
      selector: ".objectname-input",
      content:
        "Masukkan atau perbarui nama objek (maks 50 karakter) jika diperlukan.",
    },
    {
      selector: ".latlong-input",
      content: "Perbarui lokasi dengan Latitude dan Longitude jika diperlukan.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine Detail ini aktif/nonaktif",
    },
    {
      selector: ".submit-button",
      content: "Klik 'Submit' untuk menyimpan perubahan pada Machine Detail.",
    },
  ];

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Jika field yang diubah adalah objectid
    if (name === "objectid" && value) {
      const selectedMachine = filteredMachineids.find(
        (id) => id.objectid === value
      );
      if (selectedMachine) {
        const { lat, long } = selectedMachine; // Ambil lat dan long dari objek yang dipilih
        setFormData((prev) => ({
          ...prev,
          lat,
          long,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const record = {
      objecttype: formData.objecttype,
      objectgroup: formData.objectgroup,
      objectid: formData.objectid,
      objectcode: formData.objectcode, // Menghapus spasi dari objectcode
      objectname: `'${formData.objectname}'`,
      lat: formData.lat,
      long: formData.long,
      active: formData.active,
    };

    const condition = {
      id: { operator: "eq", value: formData.id }, // Menyesuaikan dengan ID yang relevan
    };

    try {
      // Update Machine Detail
      await sendEncryptedRequest("MACHINEDETAIL", record, condition);

      // Update Machine Profile
      await sendEncryptedRequest(
        "MACHINEPROFILE",
        {
          objectcode: record.objectcode, // Menggunakan objectcode yang sudah diperbarui
          objectname: `'${formData.objectname}'`, // Perbaiki pengetikan dari 'objeckname' ke 'objectname'
        },
        { objectid: { operator: "eq", value: formData.objectid } } // Menggunakan objectid dari formData
      );

      // Update Machine Productivity
      await sendEncryptedRequest(
        "MACHINEPRODUCTIVITY",
        { objectcode: record.objectcode }, // Hanya objectcode
        { objectid: { operator: "eq", value: formData.objectid } } // Menggunakan objectid dari formData
      );

      // Update Machine Records
      await sendEncryptedRequest(
        "MACHINERECORDS",
        { objectcode: record.objectcode }, // Hanya objectcode
        { objectid: { operator: "eq", value: formData.objectid } } // Menggunakan objectid dari formData
      );

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating machine detail or related tables:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)} // Tutup tur saat selesai
      />
      <div className="bg-white w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Machine Detail</h2>
          <button onClick={handleStartTour} className="p-2">
            <Notebook size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block">Object Type</label>
            <select
              name="objecttype"
              value={formData.objecttype}
              onChange={handleChange}
              className="objecttype-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Type</option>
              {machinetypes.map((type) => (
                <option key={type.id} value={type.objecttype}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Group</label>
            <select
              name="objectgroup"
              value={formData.objectgroup}
              onChange={handleChange}
              className="objectgroup-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Group</option>
              {filteredMachinegroups.map((group) => (
                <option key={group.id} value={group.objectgroup}>
                  {group.objectgroup}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object ID</label>
            <select
              name="objectid"
              value={formData.objectid}
              onChange={handleChange}
              className="objectid-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object ID</option>
              {filteredMachineids.map((id) => (
                <option key={id.id} value={id.objectid}>
                  {id.objectid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Code</label>
            <input
              type="text"
              name="objectcode"
              value={formData.objectcode}
              onChange={handleChange}
              className="objectcode-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={64}
              required
            />
          </div>
          <div>
            <label className="block">Object Name</label>
            <input
              type="text"
              name="objectname"
              value={formData.objectname}
              onChange={handleChange}
              className="objectname-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>
          <div>
            <label className="block">Latitude & Longitude</label>
            <div className="latlong-input flex items-center space-x-2">
              <input
                name="lat"
                type="text"
                value={formData.lat}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Latitude"
              />
              <input
                name="long"
                type="text"
                value={formData.long}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Longitude"
              />
            </div>
          </div>
          <div>
            <label className="block">Active</label>
            <div className="active-radio flex items-center mt-5 space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  checked={formData.active === "Y"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-[#385878] peer-checked:border-transparent transition duration-200 ease-in-out">
                  <div className="w-3 h-3 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="active"
                  value="N"
                  checked={formData.active === "N"}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:bg-[#385878] peer-checked:border-transparent transition duration-200 ease-in-out">
                  <div className="w-3 h-3 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button flex items-center bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              {isLoading && <Spinner size={24} className="mr-2 animate-spin" />}
              {isLoading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachineDetailModal;
