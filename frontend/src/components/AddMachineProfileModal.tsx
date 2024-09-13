import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
  fetchMachineDetails,
} from "../utils/dropdownUtils";

interface AddMachineProfileModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AddMachineProfileModal: React.FC<AddMachineProfileModalProps> = ({
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    objecttype: "",
    objectgroup: "",
    objectid: "",
    objectcode: "",
    objectstatus: "",
    objectname: "",
    description: "",
    registereddate: "",
    registeredno: "",
    registeredby: "",
    countryoforigin: "",
    dob: "",
    sex: "",
    documentno: "",
    vendor: "",
    notes: "",
    photogalery_1: "",
    photogalery_2: "",
    photogalery_3: "",
    photogalery_4: "",
    photogalery_5: "",
    video: "",
    active: "Y",
  });

  const [machineTypes, setMachineTypes] = useState<any[]>([]);
  const [machineGroups, setMachineGroups] = useState<any[]>([]);
  const [machineIds, setMachineIds] = useState<any[]>([]);
  const [objectCodes, setObjectCodes] = useState<any[]>([]);
  const [filteredMachineGroups, setFilteredMachineGroups] = useState<any[]>([]);
  const [filteredMachineIds, setFilteredMachineIds] = useState<any[]>([]);
  const [filteredObjectCodes, setFilteredObjectCodes] = useState<any[]>([]);

  // Fetch initial data
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
  }, []);

  // Filter machine groups based on selected object type
  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machineGroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachineGroups(filteredGroups);
      setFormData((prev) => ({
        ...prev,
        objectgroup: "",
        objectid: "",
        objectcode: "",
      }));
    } else {
      setFilteredMachineGroups([]);
    }
  }, [formData.objecttype, machineGroups]);

  // Filter machine IDs based on selected object group
  useEffect(() => {
    if (formData.objectgroup) {
      const filteredIds = machineIds.filter(
        (id) => id.objectgroup === formData.objectgroup
      );
      setFilteredMachineIds(filteredIds);
      setFormData((prev) => ({ ...prev, objectid: "", objectcode: "" }));
    } else {
      setFilteredMachineIds([]);
    }
  }, [formData.objectgroup, machineIds]);

  // Filter object codes based on selected object ID
  useEffect(() => {
    if (formData.objectid) {
      const filteredCodes = objectCodes.filter(
        (code) => code.objectid === formData.objectid
      );
      setFilteredObjectCodes(filteredCodes);
    } else {
      setFilteredObjectCodes([]);
      setFormData((prev) => ({ ...prev, objectcode: "" }));
    }
  }, [formData.objectid, objectCodes]);

  const fetchObjectDetailsByCode = async (objectcode: string) => {
    try {
      const machineDetails = await fetchMachineDetails();
      const detail = machineDetails.find(
        (item) => item.objectcode === objectcode
      );
      return detail ? detail.objectname : "";
    } catch (error) {
      console.error("Error fetching object details:", error);
      return "";
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "objectcode" && value) {
      const objectname = await fetchObjectDetailsByCode(value);
      setFormData((prev) => ({ ...prev, objectname }));
    }
  };

  const formatDate = (date: string, format: string): string => {
    const d = new Date(date);

    // Format untuk registereddate
    if (format === "registereddate") {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `'${year}/${month}/${day}'`;
    }

    // Format untuk dob
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

    // Format data untuk dikirim
    // Format the data to be sent
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "INSERT",
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
    };

    // Convert JSON data to pretty-printed string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Encrypt JSON data
    const encryptedMessage = encryptMessage(jsonString);

    // Prepare payload
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    // Log JSON and encrypted payload
    // console.log("Original JSON Data:", jsonString);
    // console.log("Encrypted Payload:", JSON.stringify(payload, null, 2));

    try {
      // Send POST request with encrypted payload
      const response = await axios.post("/api", payload);

      alert("Machine profile created successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error creating machine profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine Profile</h2>
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
              {machineTypes.map((type: any) => (
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
              disabled={!formData.objecttype}
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.length > 0 ? (
                filteredMachineGroups.map((group: any) => (
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!formData.objectgroup}
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.length > 0 ? (
                filteredMachineIds.map((id: any) => (
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
            <select
              name="objectcode"
              value={formData.objectcode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!formData.objectid}
            >
              <option value="">Select Object Code</option>
              {filteredObjectCodes.length > 0 ? (
                filteredObjectCodes.map((code: any) => (
                  <option key={code.objectcode} value={code.objectcode}>
                    {code.objectcode}
                  </option>
                ))
              ) : (
                <option value="">No available options</option>
              )}
            </select>
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
              readOnly // Set readOnly jika Anda hanya ingin menampilkan data, tidak bisa diedit langsung
            />
          </div>

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
            <input
              type="text"
              name="countryoforigin"
              value={formData.countryoforigin}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineProfileModal;
