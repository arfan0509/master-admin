import React, { useState, useEffect } from "react";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
} from "../utils/dropdownUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook, Spinner } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor
import { sendInsertRequest } from "../utils/insertUtils";

interface AddMachineDetailModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddMachineDetailModal: React.FC<AddMachineDetailModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    objecttype: "",
    objectgroup: "",
    objectid: "",
    objectcode: "",
    objectname: "",
    lat: "",
    long: "",
    active: "Y",
  });

  const [machineTypes, setMachineTypes] = useState<any[]>([]);
  const [machineGroups, setMachineGroups] = useState<any[]>([]);
  const [machineIds, setMachineIds] = useState<any[]>([]);
  const [filteredMachineGroups, setFilteredMachineGroups] = useState<any[]>([]);
  const [filteredMachineIds, setFilteredMachineIds] = useState<any[]>([]);

  // Fetch machine types and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
        ]);
        setMachineTypes(types);
        setMachineGroups(groups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch machine IDs
  useEffect(() => {
    const fetchIds = async () => {
      try {
        const ids = await fetchMachineIds();
        setMachineIds(ids);
      } catch (error) {
        console.error("Error fetching machine IDs:", error);
      }
    };

    fetchIds();
  }, []);

  // Filter machine groups based on selected object type
  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machineGroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachineGroups(filteredGroups);
    } else {
      setFilteredMachineGroups([]);
      setFormData((prev) => ({ ...prev, objectgroup: "", objectid: "" }));
    }
  }, [formData.objecttype, machineGroups]);

  // Filter machine IDs based on selected object group
  useEffect(() => {
    if (formData.objectgroup) {
      const filteredIds = machineIds.filter(
        (id) => id.objectgroup === formData.objectgroup
      );
      setFilteredMachineIds(filteredIds);
    } else {
      setFilteredMachineIds([]);
      setFormData((prev) => ({ ...prev, objectid: "" }));
    }
  }, [formData.objectgroup, machineIds]);

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih Object Type yang tersedia. Pastikan sesuai dengan Machine Detail yang akan dibuat.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Pilih Object Group dari opsi yang tersedia. Pastikan sesuai dengan Machine Detail yang akan dibuat.",
    },
    {
      selector: ".objectid-input",
      content:
        "Pilih Object ID dari opsi yang tersedia. Pastikan sesuai dengan Machine Detail yang akan dibuat.",
    },
    {
      selector: ".objectcode-input",
      content: "Masukkan kode unik untuk objek (maks 64 karakter).",
    },
    {
      selector: ".objectname-input",
      content:
        "Masukkan Nama Objek (maks 50 karakter) untuk identifikasi objek.",
    },
    {
      selector: ".latlong-input",
      content: "Ini akan menampilkan koordinat dari Machine ID yang dipilih.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine Detail ini aktif atau tidak.",
    },
    {
      selector: ".submit-button",
      content: "Klik Submit untuk menambahkan Machine Detail baru.",
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
      const selectedMachine = filteredMachineIds.find(
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

    // Data yang akan di-insert ke dalam MACHINEDETAIL
    const record = {
      objecttype: formData.objecttype,
      objectgroup: formData.objectgroup,
      objectid: formData.objectid,
      objectcode: formData.objectcode,
      objectname: `'${formData.objectname}'`,
      lat: formData.lat,
      long: formData.long,
      active: formData.active,
    };

    try {
      // Panggil fungsi insert yang telah dibuat
      await sendInsertRequest("MACHINEDETAIL", record);

      // Panggil onAdd dan onClose jika insert berhasil
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error creating machine detail:", error);
    } finally {
      setIsLoading(false); // Reset loading state setelah proses selesai
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
        <div className="flex items-center justify-between mb-4 pb-5">
          <h2 className="text-xl font-bold">Add Machine Detail</h2>
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
              {machineTypes.map((type) => (
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
              disabled={!formData.objecttype}
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.length > 0 ? (
                filteredMachineGroups.map((group) => (
                  <option key={group.id} value={group.objectgroup}>
                    {group.objectgroup}
                  </option>
                ))
              ) : (
                <option value="">No available options</option>
              )}
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
              disabled={!formData.objectgroup}
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.length > 0 ? (
                filteredMachineIds.map((id) => (
                  <option key={id.objectid} value={id.objectid}>
                    {id.objectid}
                  </option>
                ))
              ) : (
                <option value="">No available options</option>
              )}
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
              required
              maxLength={64} // Batas panjang input untuk objectcode
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
              required
              maxLength={50} // Batas panjang input untuk objectname
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
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineDetailModal;
