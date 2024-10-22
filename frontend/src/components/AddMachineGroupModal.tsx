import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import { fetchMachineTypes } from "../utils/dropdownUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor

interface AddMachineGroupModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddMachineGroupModal: React.FC<AddMachineGroupModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    objecttype: "",
    objectgroup: "",
    description: "",
    active: "Y",
  });
  const [error, setError] = useState("");

  const [machinetypes, setMachinetypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await fetchMachineTypes();
        setMachinetypes(types);
      } catch (error) {
        console.error("Error fetching machine types:", error);
      }
    };

    fetchData();
  }, []);

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const steps = [
    {
      selector: ".objecttype-input", // Selector untuk elemen yang akan ditunjukkan
      content: "Pilih object type yang tersedia disini, pastikan pilih yang sesuai dengan object group yang akan dibuat.",
    },
    {
      selector: ".objectgroup-input",
      content: "Masukkan object group di sini (max 6 karakter).",
    },
    {
      selector: ".description-input",
      content: "Masukkan Deskripsi di sini (max 50 karakter).",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah tipe mesin ini aktif.",
    },
    {
      selector: ".submit-button",
      content: "Klik Submit untuk menambahkan data machine group baru.",
    },
  ];

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const message = JSON.stringify(
      {
        datacore: "MACHINE",
        folder: "MACHINEGROUP",
        command: "INSERT",
        group: "XCYTUA",
        property: "PJLBBS",
        record: {
          objecttype: formData.objecttype,
          objectgroup: formData.objectgroup,
          description: `'${formData.description}'`,
          active: formData.active,
        },
      },
      null,
      2
    );

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

      alert("Machine group created successfully!");
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding machine group:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)} // Tutup tur saat selesai
      />
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Machine Group</h2>
          <button onClick={handleStartTour} className="p-2">
            <Notebook size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {machinetypes.map((type: any) => (
                <option key={type.id} value={type.objecttype}>
                  {type.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Object Group</label>
            <input
              name="objectgroup"
              value={formData.objectgroup}
              onChange={handleChange}
              className="objectgroup-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={6}
            />
          </div>
          <div>
            <label className="block">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="description-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              maxLength={50}
            />
          </div>
          <div>
            <label className="block">Active</label>
            <div className="active-radio flex items-center mt-5 space-x-6">
              <label className="description-input inline-flex items-center cursor-pointer">
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
              className="submit-button bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineGroupModal;
