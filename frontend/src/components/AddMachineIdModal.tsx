import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import { fetchMachineTypes, fetchMachineGroups } from "../utils/dropdownUtils";
import MapLocationModal from "./MapLocationModal"; // Import MapLocationModal
import CountrySelectModal from "./CountrySelectModal"; // Import modal pemilihan negara
import { MapPin } from "@phosphor-icons/react";
import { countries } from "../utils/countries";

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
  onUpdate: () => void;
}

const AddMachineIdModal: React.FC<AddMachineIdModalProps> = ({
  onClose,
  onUpdate,
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
  const [showCountryModal, setShowCountryModal] = useState(false); // State for CountrySelectModal

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountrySelect = (country: { code: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      countryid: country.code, // Update countryid dengan kode negara yang dipilih
    }));
    setShowCountryModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = JSON.stringify({
      datacore: "MACHINE",
      folder: "MACHINEID",
      command: "INSERT",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
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
      },
    });

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

      if (response.status === 200 || response.status === 201) {
        console.log("Machine ID created successfully!");
        onUpdate();
        onClose();
      } else {
        console.error("Unexpected response status:", response.status);
        console.error("Response data:", response.data);
      }
    } catch (error) {
      console.error("Error creating Machine ID:", error);
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
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine ID</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Object Type</label>
            <select
              name="objecttype"
              value={formData.objecttype}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Icon Group</label>
            <input
              type="text"
              name="icongroup"
              value={formData.icongroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Icon ID</label>
            <input
              type="text"
              name="iconid"
              value={formData.iconid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Country</label>
            <select
              name="countryid"
              value={formData.countryid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">City</label>
            <input
              type="text"
              name="cityid"
              value={formData.cityid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Region</label>
            <select
              name="regionid"
              value={formData.regionid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
            <label className="block">Latitude</label>
            <div className="flex items-center">
              <input
                name="lat"
                type="text"
                value={formData.lat}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="ml-2 p-[6.5px] bg-[#385878] text-white hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200 flex items-center rounded-md"
              >
                <MapPin size={24} /> {/* Ikon hanya */}
              </button>
            </div>
          </div>
          <div>
            <label className="block">Longitude</label>
            <input
              name="long"
              type="text"
              value={formData.long}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="flex space-x-4 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  checked={formData.active === "Y"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="active"
                  value="N"
                  checked={formData.active === "N"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {showMapModal && (
        <MapLocationModal
          onClose={() => setShowMapModal(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
      {showCountryModal && (
        <CountrySelectModal
          onClose={() => setShowCountryModal(false)}
          onCountrySelect={handleCountrySelect} // Pass handler to the modal
        />
      )}
    </div>
  );
};

export default AddMachineIdModal;
