import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
} from "../utils/dropdownUtils";

interface AddMachineDetailModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AddMachineDetailModal: React.FC<AddMachineDetailModalProps> = ({
  onClose,
  onUpdate,
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

    // Format the data to be sent
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEDETAIL",
      command: "INSERT",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype: formData.objecttype,
        objectgroup: formData.objectgroup,
        objectid: formData.objectid,
        objectcode: formData.objectcode,
        objectname: formData.objectname,
        lat: formData.lat,
        long: formData.long,
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
    console.log("Original JSON Data:", jsonString);
    console.log("Encrypted Payload:", JSON.stringify(payload, null, 2));

    try {
      // Send POST request with encrypted payload
      const response = await axios.post("/api", payload);

      alert("Machine detail created successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error creating machine detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine Detail</h2>
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
            <input
              type="text"
              name="objectcode"
              value={formData.objectcode}
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
            <label className="block">Latitude</label>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
            />
          </div>
          <div>
            <label className="block">Active</label>
            <select
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineDetailModal;
