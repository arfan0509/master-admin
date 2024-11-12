/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { fetchMachineTypes, fetchMachineGroups } from "../utils/dropdownUtils";
import MapLocationModal from "./MapLocationModal"; // Import MapLocationModal
import { MapPin, Spinner } from "@phosphor-icons/react";
import { countries } from "../utils/countries"; // Import data negara
import Tour from "reactour"; // Import React Tour
import { Notebook } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor
import { sendEncryptedRequest } from "../utils/apiUtils";

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

interface EditMachineIdModalProps {
  machineId: MachineId;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineIdModal: React.FC<EditMachineIdModalProps> = ({
  machineId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null; 
  const [formData, setFormData] = useState({
    id: machineId.id,
    objecttype: machineId.objecttype,
    objectgroup: machineId.objectgroup,
    objectid: machineId.objectid,
    objectname: machineId.objectname,
    icongroup: machineId.icongroup,
    iconid: machineId.iconid,
    countryid: machineId.countryid,
    stateid: machineId.stateid,
    cityid: machineId.cityid,
    regionid: machineId.regionid,
    lat: machineId.lat,
    long: machineId.long,
    active: machineId.active,
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
  const [showMapModal, setShowMapModal] = useState(false); // State untuk MapLocationModal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
        ]);
        setMachinetypes(types);
        setMachinegroups(groups);
        setFilteredMachinegroups(
          groups.filter((group) => group.objecttype === machineId.objecttype)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [machineId]);

  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machinegroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachinegroups(filteredGroups);
    } else {
      setFilteredMachinegroups([]);
    }
  }, [formData.objecttype, machinegroups]);

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih atau perbarui Object Type yang sesuai jika diperlukan. Pastikan Object Type yang dipilih sesuai dengan Machine ID yang akan diperbarui.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Pilih atau sesuaikan Object Group jika diperlukan. Pastikan sesuai dengan Machine ID yang akan diperbarui.",
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
      selector: ".icongroup-input",
      content:
        "Masukkan atau perbarui grup ikon (maks 6 karakter) jika diperlukan.",
    },
    {
      selector: ".iconid-input",
      content:
        "Masukkan atau perbarui ID ikon (maks 6 karakter) jika diperlukan.",
    },
    {
      selector: ".country-input",
      content:
        "Pilih atau sesuaikan negara dari daftar yang tersedia jika diperlukan.",
    },
    {
      selector: ".state-input",
      content:
        "Masukkan atau perbarui kode negara bagian (maks 3 karakter) jika diperlukan.",
    },
    {
      selector: ".city-input",
      content:
        "Masukkan atau perbarui kode kota (maks 3 karakter) jika diperlukan.",
    },
    {
      selector: ".region-input",
      content:
        "Pilih atau sesuaikan wilayah dari daftar yang tersedia jika diperlukan.",
    },
    {
      selector: ".latlong-input",
      content: "Perbarui lokasi dengan Latitude dan Longitude jika diperlukan.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine ID ini aktif/nonaktif",
    },
    {
      selector: ".submit-button",
      content: "Klik 'Update' untuk menyimpan perubahan pada Machine ID.",
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

  const handleLocationSelect = (lat: number, long: number) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toString(),
      long: long.toString(),
    }));
    setShowMapModal(false);
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

    const condition = {
      id: { operator: "eq", value: formData.id }, // Menyesuaikan dengan ID yang relevan
    };

    try {
      // Update Machine ID
      await sendEncryptedRequest("MACHINEID", record, condition);

      // Update Machine Detail with lat and long
      await sendEncryptedRequest(
        "MACHINEDETAIL",
        {
          objectid: `'${formData.objectid}'`,
          lat: formData.lat, // Menambahkan lat
          long: formData.long, // Menambahkan long
        },
        { objectid: { operator: "eq", value: machineId.objectid } }
      );

      // Update Machine Profile
      await sendEncryptedRequest(
        "MACHINEPROFILE",
        { objectid: `'${formData.objectid}'` },
        { objectid: { operator: "eq", value: machineId.objectid } }
      );

      // Update Machine Productivity
      await sendEncryptedRequest(
        "MACHINEPRODUCTIVITY",
        { objectid: `'${formData.objectid}'` },
        { objectid: { operator: "eq", value: machineId.objectid } }
      );

      // Update Machine Records
      await sendEncryptedRequest(
        "MACHINERECORDS",
        { objectid: `'${formData.objectid}'` },
        { objectid: { operator: "eq", value: machineId.objectid } }
      );

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating machine ID or related tables:", error);
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
      <div className="bg-white w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Machine ID</h2>
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
              {isLoading ? "Loading..." : "Update"}
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

export default EditMachineIdModal;
