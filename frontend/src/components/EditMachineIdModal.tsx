import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import { fetchMachineTypes, fetchMachineGroups } from "../utils/dropdownUtils"; // Import dari file utilitas

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
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineIdModal: React.FC<EditMachineIdModalProps> = ({
  machineId,
  onClose,
  onUpdate,
}) => {
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
      // Filter machine groups based on selected object type
      const filteredGroups = machinegroups.filter(
        (group) => group.objecttype === formData.objecttype
      );
      setFilteredMachinegroups(filteredGroups);
    } else {
      setFilteredMachinegroups([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format JSON data sesuai dengan format yang diharapkan backend
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEID",
      command: "UPDATE",
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
      condition: {
        id: {
          operator: "eq",
          value: formData.id,
        },
      },
    };

    // Convert JSON data to pretty-printed string
    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print JSON with indentation

    // Encrypt JSON data
    const encryptedMessage = encryptMessage(jsonString);
    // console.log(encryptedMessage);

    // Prepare payload
    const payload = {
      apikey: "06EAAA9D10BE3D4386D10144E267B681",
      uniqueid: "JFKlnUZyyu0MzRqj",
      timestamp: new Date().toISOString(),
      localdb: "N",
      message: encryptedMessage,
    };

    try {
      // Send PUT request with encrypted payload
      const response = await axios.post(`/api`, payload);

      alert("Machine ID updated successfully!");
      onUpdate(); // Update list machine ID
      onClose(); // Close modal setelah update
    } catch (error) {
      console.error("Error updating machine ID:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine ID</h2>
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
            <input
              type="text"
              name="countryid"
              value={formData.countryid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
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
            <input
              type="text"
              name="regionid"
              value={formData.regionid}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Latitude</label>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Longitude</label>
            <input
              type="text"
              name="long"
              value={formData.long}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block">Active</label>
            <input
              type="text"
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachineIdModal;
