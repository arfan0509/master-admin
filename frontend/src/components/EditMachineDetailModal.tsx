import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
} from "../utils/dropdownUtils";

interface MachineDetail {
  id: number;
  objecttype: string;
  objectgroup: string;
  objectid: string;
  objectcode: string;
  objectname: string;
  lat: string;
  long: string;
  active: string;
}

interface EditMachineDetailModalProps {
  machineDetail: MachineDetail;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineDetailModal: React.FC<EditMachineDetailModalProps> = ({
  machineDetail,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    id: machineDetail.id,
    objecttype: machineDetail.objecttype,
    objectgroup: machineDetail.objectgroup,
    objectid: machineDetail.objectid,
    objectcode: machineDetail.objectcode,
    objectname: machineDetail.objectname,
    lat: machineDetail.lat,
    long: machineDetail.long,
    active: machineDetail.active,
  });

  const [machinetypes, setMachinetypes] = useState<{ id: number; objecttype: string }[]>([]);
  const [machinegroups, setMachinegroups] = useState<{ id: number; objecttype: string; objectgroup: string }[]>([]);
  const [filteredMachinegroups, setFilteredMachinegroups] = useState<{ id: number; objecttype: string; objectgroup: string }[]>([]);
  const [machineids, setMachineids] = useState<{ id: string; objectid: string; objectgroup: string; lat: string; long: string }[]>([]);
  const [filteredMachineids, setFilteredMachineids] = useState<{ id: string; objectid: string; lat: string; long: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, groups, ids] = await Promise.all([
          fetchMachineTypes(),
          fetchMachineGroups(),
          fetchMachineIds(),
        ]);
        setMachinetypes(types);
        setMachinegroups(groups);
        setFilteredMachinegroups(groups.filter(group => group.objecttype === machineDetail.objecttype));
        setMachineids(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [machineDetail]);

  useEffect(() => {
    if (formData.objecttype) {
      const filteredGroups = machinegroups.filter(group => group.objecttype === formData.objecttype);
      setFilteredMachinegroups(filteredGroups);
    }
  }, [formData.objecttype, machinegroups]);

  useEffect(() => {
    if (formData.objectgroup) {
      const filteredIds = machineids.filter(id => id.objectgroup === formData.objectgroup);
      setFilteredMachineids(filteredIds);
    } else {
      setFilteredMachineids([]);
    }
  }, [formData.objectgroup, machineids]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Jika field yang diubah adalah objectid
    if (name === "objectid" && value) {
      const selectedMachine = filteredMachineids.find(id => id.objectid === value);
      if (selectedMachine) {
        const { lat, long } = selectedMachine; // Ambil lat dan long dari objek yang dipilih
        setFormData(prev => ({
          ...prev,
          lat,
          long,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEDETAIL",
      command: "UPDATE",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype: formData.objecttype,
        objectgroup: formData.objectgroup,
        objectid: formData.objectid,
        objectcode: formData.objectcode,
        objectname: `'${formData.objectname}'`,
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
      await axios.post(`/api`, payload);

      alert("Machine Detail updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating machine detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Machine Detail</h2>
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
              {machinetypes.map(type => (
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
              {filteredMachinegroups.map(group => (
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
              {filteredMachineids.map(id => (
                <option key={id.id} value={id.objectid}>
                  {id.objectid}
                </option>
              ))}
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
              required
              readOnly
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
              readOnly
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

export default EditMachineDetailModal;
