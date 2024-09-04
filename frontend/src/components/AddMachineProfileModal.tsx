import React, { useState, useEffect } from "react";
import axios from "axios";

interface AddMachineProfileModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AddMachineProfileModal: React.FC<AddMachineProfileModalProps> = ({
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    objecttype_id: "",
    objectgroup_id: "",
    objectid_id: "",
    objectcode_id: "",
    objectname: "",
    objectstatus: "",
    description: "",
    registereddate: "",
    registeredno: "",
    registeredby: "",
    countryoforigin: "",
    dob: "",
    sex: "",
    documentno: "",
    vendor_id: "",
    notes: "",
    photogalery_1: "",
    photogalery_2: "",
    photogalery_3: "",
    photogalery_4: "",
    photogalery_5: "",
    video: "",
    active: "",
  });

  const [objecttypes, setObjecttypes] = useState<any[]>([]);
  const [objectgroups, setObjectgroups] = useState<any[]>([]);
  const [filteredObjectgroups, setFilteredObjectgroups] = useState<any[]>([]);
  const [objectids, setObjectids] = useState<any[]>([]);
  const [filteredObjectids, setFilteredObjectids] = useState<any[]>([]);
  const [objectcodes, setObjectcodes] = useState<any[]>([]);
  const [filteredObjectcodes, setFilteredObjectcodes] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [objectname, setObjectname] = useState("");

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
        setVendors(vendorsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.objecttype_id) {
      const filteredGroups = objectgroups.filter(
        (group) => group.objecttype_id === parseInt(formData.objecttype_id)
      );
      setFilteredObjectgroups(filteredGroups);
    } else {
      setFilteredObjectgroups([]);
    }
  }, [formData.objecttype_id, objectgroups]);

  useEffect(() => {
    if (formData.objectgroup_id) {
      const filteredIds = objectids.filter(
        (id) => id.objectgroup_id === parseInt(formData.objectgroup_id)
      );
      setFilteredObjectids(filteredIds);
    } else {
      setFilteredObjectids([]);
    }
  }, [formData.objectgroup_id, objectids]);

  useEffect(() => {
    if (formData.objectid_id) {
      const filteredCodes = objectcodes.filter(
        (code) => code.objectid_id === parseInt(formData.objectid_id)
      );
      setFilteredObjectcodes(filteredCodes);
    } else {
      setFilteredObjectcodes([]);
    }
  }, [formData.objectid_id, objectcodes]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedDOB = formData.dob
        ? new Date(formData.dob).toISOString().slice(0, 10)
        : "";

      await axios.post("/api/machineprofile", {
        ...formData,
        dob: formattedDOB,
      });
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
            <label className="block text-sm font-medium text-gray-700">
              Object Type
            </label>
            <select
              name="objecttype_id"
              value={formData.objecttype_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Type</option>
              {objecttypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Object Group
            </label>
            <select
              name="objectgroup_id"
              value={formData.objectgroup_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Group</option>
              {filteredObjectgroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.objectgroup}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Object ID
            </label>
            <select
              name="objectid_id"
              value={formData.objectid_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object ID</option>
              {filteredObjectids.map((id) => (
                <option key={id.id} value={id.id}>
                  {id.objectid}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Object Code
            </label>
            <select
              name="objectcode_id"
              value={formData.objectcode_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Object Code</option>
              {filteredObjectcodes.map((code) => (
                <option key={code.id} value={code.id}>
                  {code.objectcode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Object Name
            </label>
            <input
              type="text"
              name="objectname"
              value={objectname}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Object Status
            </label>
            <input
              type="text"
              name="objectstatus"
              value={formData.objectstatus}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registered Date
            </label>
            <input
              type="date"
              name="registereddate"
              value={formData.registereddate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registered No
            </label>
            <input
              type="text"
              name="registeredno"
              value={formData.registeredno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registered By
            </label>
            <input
              type="text"
              name="registeredby"
              value={formData.registeredby}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country of Origin
            </label>
            <input
              type="text"
              name="countryoforigin"
              value={formData.countryoforigin}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sex
            </label>
            <input
              type="text"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document No
            </label>
            <input
              type="text"
              name="documentno"
              value={formData.documentno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Gallery 1
            </label>
            <input
              type="text"
              name="photogalery_1"
              value={formData.photogalery_1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Gallery 2
            </label>
            <input
              type="text"
              name="photogalery_2"
              value={formData.photogalery_2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Gallery 3
            </label>
            <input
              type="text"
              name="photogalery_3"
              value={formData.photogalery_3}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Gallery 4
            </label>
            <input
              type="text"
              name="photogalery_4"
              value={formData.photogalery_4}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo Gallery 5
            </label>
            <input
              type="text"
              name="photogalery_5"
              value={formData.photogalery_5}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video
            </label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Active
            </label>
            <select
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Status</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineProfileModal;
