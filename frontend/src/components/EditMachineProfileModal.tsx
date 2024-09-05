import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils"; // Menggunakan enkripsi yang sama

interface EditMachineProfileModalProps {
  machineProfile: MachineProfile;
  onClose: () => void;
  onUpdate: () => void;
}

interface MachineProfile {
  id: number;
  objecttype_id: number;
  objectgroup_id: number;
  objectid_id: number;
  objectcode_id: number;
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
  vendor_id: string;
  notes: string;
  photogalery_1: string;
  photogalery_2: string;
  photogalery_3: string;
  photogalery_4: string;
  photogalery_5: string;
  video: string;
  active: string;
}

const EditMachineProfileModal: React.FC<EditMachineProfileModalProps> = ({
  machineProfile,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<MachineProfile>({
    ...machineProfile,
  });

  const [objecttypes, setObjecttypes] = useState<any[]>([]);
  const [objectgroups, setObjectgroups] = useState<any[]>([]);
  const [objectids, setObjectids] = useState<any[]>([]);
  const [objectcodes, setObjectcodes] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [objectname, setObjectname] = useState(machineProfile.objectname);

  const [originalJson, setOriginalJson] = useState<string | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...machineProfile });
  }, [machineProfile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, groupsRes, idsRes, codesRes, vendorsRes] =
          await Promise.all([
            axios.get("/api/machinetype"),
            axios.get("/api/machinegroup"),
            axios.get("/api/machineid"),
            axios.get("/api/machinedetail"),
            axios.get("/api/vendors"),
          ]);

        setObjecttypes(typesRes.data);
        setObjectgroups(groupsRes.data);
        setObjectids(idsRes.data);
        setObjectcodes(codesRes.data);
        setVendors(vendorsRes.data); // Memastikan vendorsRes ada
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchObjectName = async () => {
      if (formData.objectcode_id) {
        try {
          const response = await axios.get(
            `/api/machinedetail/${formData.objectcode_id}`
          );
          const fetchedObjectName = response.data.objectname;
          setObjectname(fetchedObjectName);
          setFormData((prevData) => ({
            ...prevData,
            objectname: fetchedObjectName,
          }));
        } catch (error) {
          console.error("Error fetching object name:", error);
        }
      }
    };

    fetchObjectName();
  }, [formData.objectcode_id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format JSON data yang akan dienkripsi
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "UPDATE",
      record: { ...formData },
      condition: { id: machineProfile.id },
    };

    // Pretty print JSON
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Encrypt JSON data
    const encryptedMessage = encryptMessage(jsonString);

    // Payload yang akan dikirimkan ke backend
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14),
      localdb: "N",
      message: encryptedMessage,
    };

    setOriginalJson(jsonString); // JSON asli sebelum enkripsi
    setEncryptedMessage(JSON.stringify(payload, null, 2)); // Pretty printed encrypted payload

    try {
      // PUT request ke backend
      const response = await axios.put(
        `/api/machineprofile/${machineProfile.id}`,
        payload
      );
      console.log("Response from backend:", response.data);

      alert("Machine profile updated successfully!");
      onUpdate(); // Update list machine profiles
      onClose(); // Close modal setelah update
    } catch (error) {
      console.error("Error updating machine profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-full p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Machine Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Object Type ID</label>
            <select
              name="objecttype_id"
              value={formData.objecttype_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Object Type</option>
              {objecttypes.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Object Group ID</label>
            <select
              name="objectgroup_id"
              value={formData.objectgroup_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Object Group</option>
              {objectgroups.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.objectgroup}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Object ID</label>
            <select
              name="objectid_id"
              value={formData.objectid_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Object ID</option>
              {objectids.map((id: any) => (
                <option key={id.id} value={id.id}>
                  {id.objectid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Object Code ID</label>
            <select
              name="objectcode_id"
              value={formData.objectcode_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Object Code</option>
              {objectcodes.map((code: any) => (
                <option key={code.id} value={code.id}>
                  {code.objectcode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Object Name</label>
            <input
              type="text"
              name="objectname"
              value={objectname}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Object Status</label>
            <input
              type="text"
              name="objectstatus"
              value={formData.objectstatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Registered Date</label>
            <input
              readOnly
              type="text"
              name="registereddate"
              value={formData.registereddate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Registered No</label>
            <input
              type="text"
              name="registeredno"
              value={formData.registeredno}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Registered By</label>
            <input
              type="text"
              name="registeredby"
              value={formData.registeredby}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Country of Origin</label>
            <input
              type="text"
              name="countryoforigin"
              value={formData.countryoforigin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Sex</label>
            <input
              type="text"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Document No</label>
            <input
              type="text"
              name="documentno"
              value={formData.documentno}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Vendor</label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor: any) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Photo Gallery 1</label>
            <input
              type="text"
              name="photogalery_1"
              value={formData.photogalery_1}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Photo Gallery 2</label>
            <input
              type="text"
              name="photogalery_2"
              value={formData.photogalery_2}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Photo Gallery 3</label>
            <input
              type="text"
              name="photogalery_3"
              value={formData.photogalery_3}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Photo Gallery 4</label>
            <input
              type="text"
              name="photogalery_4"
              value={formData.photogalery_4}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Photo Gallery 5</label>
            <input
              type="text"
              name="photogalery_5"
              value={formData.photogalery_5}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Video</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Active</label>
            <select
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMachineProfileModal;
