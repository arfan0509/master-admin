import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
  fetchMachineDetails,
} from "../utils/dropdownUtils";
import { countries } from "../utils/countries";

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

interface EditMachineProfileModalProps {
  machineProfile: MachineProfile;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineProfileModal: React.FC<EditMachineProfileModalProps> = ({
  machineProfile,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    id: machineProfile.id,
    objecttype: machineProfile.objecttype,
    objectgroup: machineProfile.objectgroup,
    objectid: machineProfile.objectid,
    objectcode: machineProfile.objectcode,
    objectstatus: machineProfile.objectstatus,
    objectname: machineProfile.objectname,
    description: machineProfile.description,
    registereddate: machineProfile.registereddate,
    registeredno: machineProfile.registeredno,
    registeredby: machineProfile.registeredby,
    countryoforigin: machineProfile.countryoforigin,
    dob: machineProfile.dob,
    sex: machineProfile.sex,
    documentno: machineProfile.documentno,
    vendor: machineProfile.vendor,
    notes: machineProfile.notes,
    photogalery_1: machineProfile.photogalery_1,
    photogalery_2: machineProfile.photogalery_2,
    photogalery_3: machineProfile.photogalery_3,
    photogalery_4: machineProfile.photogalery_4,
    photogalery_5: machineProfile.photogalery_5,
    video: machineProfile.video,
    active: machineProfile.active,
  });

  const [machineTypes, setMachineTypes] = useState<
    { id: number; objecttype: string }[]
  >([]);
  const [machineGroups, setMachineGroups] = useState<
    { id: number; objecttype: string; objectgroup: string }[]
  >([]);
  const [filteredMachineGroups, setFilteredMachineGroups] = useState<
    { id: number; objecttype: string; objectgroup: string }[]
  >([]);
  const [machineIds, setMachineIds] = useState<
    { id: string; objectid: string; objectgroup: string }[]
  >([]);
  const [filteredMachineIds, setFilteredMachineIds] = useState<
    { id: string; objectid: string }[]
  >([]);
  const [objectCodes, setObjectCodes] = useState<
    { id: string; objectcode: string; objectid: string; objectname: string }[]
  >([]);
  const [filteredObjectCodes, setFilteredObjectCodes] = useState<
    { id: string; objectcode: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups, ids, codes] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
          fetchMachineIds(),
          fetchMachineDetails(),
        ]);
        setMachineTypes(types);
        setMachineGroups(groups);
        setMachineIds(ids);
        setObjectCodes(codes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [machineProfile]);

  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machineGroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachineGroups(filteredGroups);
    }
  }, [formData.objecttype, machineGroups]);

  useEffect(() => {
    if (formData.objectgroup) {
      const filteredIds = machineIds.filter(
        (id) => id.objectgroup === formData.objectgroup
      );
      setFilteredMachineIds(filteredIds);
    } else {
      setFilteredMachineIds([]);
    }
  }, [formData.objectgroup, machineIds]);

  useEffect(() => {
    if (formData.objectid) {
      const filteredCodes = objectCodes.filter(
        (code) => code.objectid === formData.objectid
      );
      setFilteredObjectCodes(filteredCodes);
    } else {
      setFilteredObjectCodes([]);
    }
  }, [formData.objectid, objectCodes]);

  // Update objectname when objectcode changes
  useEffect(() => {
    const selectedCode = objectCodes.find(
      (code) => code.objectcode === formData.objectcode
    );
    if (selectedCode) {
      setFormData((prevData) => ({
        ...prevData,
        objectname: selectedCode.objectname,
      }));
    }
  }, [formData.objectcode, objectCodes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date: string, format: string): string => {
    const d = new Date(date);

    if (format === "registereddate") {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `'${year}/${month}/${day}'`;
    }

    if (format === "dob") {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return `'${year}-${month}-${day} ${hours}:${minutes}:${seconds}.0'`;
    }

    return date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype: formData.objecttype,
        objectgroup: formData.objectgroup,
        objectid: formData.objectid,
        objectcode: formData.objectcode,
        objectstatus: formData.objectstatus,
        objectname: `'${formData.objectname}'`,
        description: `'${formData.description}'`,
        registereddate: formatDate(formData.registereddate, "registereddate"),
        registeredno: `'${formData.registeredno}'`,
        registeredby: `'${formData.registeredby}'`,
        countryoforigin: `'${formData.countryoforigin}'`,
        dob: formatDate(formData.dob, "dob"),
        sex: `'${formData.sex}'`,
        documentno: `'${formData.documentno}'`,
        vendor: `'${formData.vendor}'`,
        notes: `'${formData.notes}'`,
        photogalery_1: `'${formData.photogalery_1}'`,
        photogalery_2: `'${formData.photogalery_2}'`,
        photogalery_3: `'${formData.photogalery_3}'`,
        photogalery_4: `'${formData.photogalery_4}'`,
        photogalery_5: `'${formData.photogalery_5}'`,
        video: `'${formData.video}'`,
        active: formData.active,
      },
      condition: {
        id: {
          operator: "eq",
          value: formData.id,
        },
      },
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const encryptedMessage = encryptMessage(jsonString);

    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      await axios.post("/api", payload);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating machine profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine Profile</h2>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.map((group) => (
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.map((id) => (
                <option key={id.id} value={id.objectid}>
                  {id.objectid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Code</label>
            <select
              name="objectcode"
              value={formData.objectcode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Code</option>
              {filteredObjectCodes.map((code) => (
                <option key={code.id} value={code.objectcode}>
                  {code.objectcode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Name</label>
            <input
              type="text"
              name="objectname"
              value={formData.objectname}
              onChange={handleChange}
              className="bg-gray-200 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              readOnly
            />
          </div>
          {/* Add other fields here */}
          <div>
            <label className="block">Object Status</label>
            <input
              type="text"
              name="objectstatus"
              value={formData.objectstatus}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Registered Date</label>
            <input
              type="date"
              name="registereddate"
              value={formData.registereddate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Registered No</label>
            <input
              type="text"
              name="registeredno"
              value={formData.registeredno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Registered By</label>
            <input
              type="text"
              name="registeredby"
              value={formData.registeredby}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Country of Origin</label>
            <select
              name="countryoforigin"
              value={formData.countryoforigin}
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
            <label className="block">Date of Birth</label>
            <input
              type="datetime-local"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Sex</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block">Document No</label>
            <input
              type="text"
              name="documentno"
              value={formData.documentno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Photo Gallery 1</label>
            <input
              type="text"
              name="photogalery_1"
              value={formData.photogalery_1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Photo Gallery 2</label>
            <input
              type="text"
              name="photogalery_2"
              value={formData.photogalery_2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Photo Gallery 3</label>
            <input
              type="text"
              name="photogalery_3"
              value={formData.photogalery_3}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Photo Gallery 4</label>
            <input
              type="text"
              name="photogalery_4"
              value={formData.photogalery_4}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Photo Gallery 5</label>
            <input
              type="text"
              name="photogalery_5"
              value={formData.photogalery_5}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Video</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Active</label>
            <select
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Active Status</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachineProfileModal;
