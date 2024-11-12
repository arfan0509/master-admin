import React, { useState, useEffect } from "react";
import { fetchMachineTypes, fetchMachineGroups } from "../utils/dropdownUtils";
import MapLocationModal from "./MapLocationModal"; // Import MapLocationModal
import { MapPin, Spinner } from "@phosphor-icons/react";
import { countries } from "../utils/countries";
import Tour from "reactour"; // Import React Tour
import { Notebook } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor
import { sendInsertRequest } from "../utils/insertUtils";

interface MachineType {
  id: number;
  objecttype: string;
}

interface MachineGroup {
  id: number;
  objecttype: string;
  objectgroup: string;
}

interface AddMachineIdModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddMachineIdModal: React.FC<AddMachineIdModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    objecttype: "",
    objectgroup: "",
    objectid: "",
    objectname: "",
    icongroup: "",
    iconid: "",
    countryid: "",
    stateid: "",
    cityid: "",
    regionid: "",
    lat: "",
    long: "",
    active: "Y",
  });

  const [machinetypes, setMachinetypes] = useState<MachineType[]>([]);
  const [machinegroups, setMachinegroups] = useState<MachineGroup[]>([]);
  const [filteredMachinegroups, setFilteredMachinegroups] = useState<
    MachineGroup[]
  >([]);
  const [showMapModal, setShowMapModal] = useState(false); // State for MapLocationModal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
        ]);
        setMachinetypes(types);
        setMachinegroups(groups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machinegroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachinegroups(filteredGroups);
      if (
        !filteredGroups.find(
          (group) => group.objectgroup === formData.objectgroup
        )
      ) {
        setFormData((prev) => ({ ...prev, objectgroup: "" }));
      }
    } else {
      setFilteredMachinegroups([]);
      setFormData((prev) => ({ ...prev, objectgroup: "" }));
    }
  }, [formData.objecttype, machinegroups]);

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih Object Type yang tersedia. Pastikan sesuai dengan Machine ID yang akan dibuat.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Pilih Object Group yang sesuai dengan Machine ID yang akan dibuat.",
    },
    {
      selector: ".objectid-input",
      content: "Masukkan ID Objek di sini (maks 10 karakter).",
    },
    {
      selector: ".objectname-input",
      content: "Masukkan Nama Objek di sini (maks 50 karakter).",
    },
    {
      selector: ".icongroup-input",
      content: "Masukkan Grup Ikon di sini (maks 6 karakter).",
    },
    {
      selector: ".iconid-input",
      content: "Masukkan ID Ikon di sini (maks 6 karakter).",
    },
    {
      selector: ".country-input",
      content: "Pilih negara dari daftar yang tersedia.",
    },
    {
      selector: ".state-input",
      content: "Masukkan Kode Negara Bagian (maks 3 karakter).",
    },
    {
      selector: ".city-input",
      content: "Masukkan Kode Kota (maks 3 karakter).",
    },
    {
      selector: ".region-input",
      content: "Pilih Wilayah dari daftar yang tersedia.",
    },
    {
      selector: ".latlong-input",
      content: "Pilih lokasi pada peta.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine ID ini aktif atau tidak.",
    },
    {
      selector: ".submit-button",
      content: "Klik Submit untuk menambahkan Machine ID baru.",
    },
  ];

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(), // Mengubah input menjadi huruf kapital
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const record = {
      objecttype: formData.objecttype,
      objectgroup: formData.objectgroup,
      objectid: formData.objectid,
      objectname: `'${formData.objectname}'`,
      icongroup: formData.icongroup,
      iconid: formData.iconid,
      countryid: formData.countryid,
      stateid: formData.stateid,
      cityid: formData.cityid,
      regionid: formData.regionid,
      lat: formData.lat,
      long: formData.long,
      active: formData.active,
    };

    try {
      // Gunakan fungsi insert yang telah dibuat
      await sendInsertRequest("MACHINEID", record);

      // Panggil fungsi onAdd dan onClose setelah insert berhasil
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding machine ID:", error);
    } finally {
      setIsLoading(false); // Reset loading state setelah proses selesai
    }
  };

  const handleLocationSelect = (lat: number, long: number) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      long: long.toString(),
    }));
    setShowMapModal(false);
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
      <div className="bg-white w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-5">
          <h2 className="text-xl font-bold">Add Machine ID</h2>
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
            <input
              type="text"
              name="objectid"
              value={formData.objectid}
              onChange={handleChange}
              className="objectid-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={10} // Batas panjang input
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
              maxLength={50} // Batas panjang input
            />
          </div>
          <div>
            <label className="block">Icon Group</label>
            <input
              type="text"
              name="icongroup"
              value={formData.icongroup}
              onChange={handleChange}
              className="icongroup-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={6} // Batas panjang input
            />
          </div>
          <div>
            <label className="block">Icon ID</label>
            <input
              type="text"
              name="iconid"
              value={formData.iconid}
              onChange={handleChange}
              className="iconid-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={6} // Batas panjang input
            />
          </div>
          <div>
            <label className="block">Country</label>
            <select
              name="countryid"
              value={formData.countryid}
              onChange={handleChange}
              className="country-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">State</label>
            <input
              type="text"
              name="stateid"
              value={formData.stateid}
              onChange={handleChange}
              className="state-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={3} // Batas panjang input
            />
          </div>
          <div>
            <label className="block">City</label>
            <input
              type="text"
              name="cityid"
              value={formData.cityid}
              onChange={handleChange}
              className="city-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={3} // Batas panjang input
            />
          </div>
          <div>
            <label className="block">Region</label>
            <select
              name="regionid"
              value={formData.regionid}
              onChange={handleChange}
              className="region-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Region</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Latitude & Longitude</label>
            <div className="latlong-input flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="p-[6.5px] bg-[#385878] text-white hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200 flex items-center rounded-md"
              >
                <MapPin size={24} />
              </button>
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
      {showMapModal && (
        <MapLocationModal
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  );
};

export default AddMachineIdModal;
