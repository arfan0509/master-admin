import { useState, useEffect } from "react";
import axios from "axios";

const MachineprofileForm = () => {
  const [formData, setFormData] = useState({
    objecttype_id: "",
    objectgroup_id: "",
    objectid_id: "",
    objectcode_id: "",
    objectname: "", // Tambahkan objectname ke dalam formData
    objectstatus: "",
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
    active: "",
  });

  const [objecttypes, setObjecttypes] = useState([]);
  const [objectgroups, setObjectgroups] = useState([]);
  const [objectids, setObjectids] = useState([]);
  const [objectcodes, setObjectcodes] = useState([]);
  const [objectname, setObjectname] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, groupsRes, idsRes, codesRes] = await Promise.all([
          axios.get("/api/machinetype"),
          axios.get("/api/machinegroup"),
          axios.get("/api/machineid"),
          axios.get("/api/machinedetail"),
        ]);

        setObjecttypes(typesRes.data);
        setObjectgroups(groupsRes.data);
        setObjectids(idsRes.data);
        setObjectcodes(codesRes.data);
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
            objectname: fetchedObjectName, // Tambahkan objectname ke dalam formData
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
      await axios.post("/api/machineprofile", formData);
      alert("Machine profile created successfully!");
    } catch (error) {
      console.error("Error creating machine profile:", error);
    }
  };

  return (
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
          {objectgroups.map((group) => (
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
          {objectids.map((id) => (
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
          {objectcodes.map((code) => (
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
      {/* Tambahkan field lain sesuai kebutuhan */}
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
          required
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Registered Date
        </label>
        <input
          type="datetime-local"
          name="registereddate"
          value={formData.registereddate}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
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
          required
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
          required
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
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="datetime-local"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sex</label>
        <input
          type="text"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
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
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vendor
        </label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
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
          Video URL
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
          <option value="">Select Active Status</option>
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

export default MachineprofileForm;
