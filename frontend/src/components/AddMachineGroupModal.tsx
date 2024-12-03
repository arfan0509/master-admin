/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { fetchMachineTypes } from "../utils/dropdownUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook, Spinner } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor
import { sendInsertRequest } from "../utils/insertUtils";
import AOS from "aos";
import "aos/dist/aos.css";

interface AddMachineGroupModalProps {
  isOpen: boolean; // Tambahkan ini
  onClose: () => void;
  onAdd: () => void;
}

const AddMachineGroupModal: React.FC<AddMachineGroupModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    objecttype: "",
    objectgroup: "",
    description: "",
    active: "Y",
  });

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
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih Object Type yang sesuai. Pastikan sesuai dengan Object Group yang akan dibuat.",
    },
    {
      selector: ".objectgroup-input",
      content: "Masukkan Object Group di sini (maks 6 karakter).",
    },
    {
      selector: ".description-input",
      content: "Masukkan Deskripsi di sini (maks 50 karakter).",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah tipe mesin ini aktif atau tidak.",
    },
    {
      selector: ".submit-button",
      content: "Klik Submit untuk menambahkan Machine Group baru.",
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 800, // Durasi animasi (ms)
      offset: 100, // Jarak dari viewport sebelum animasi dimulai
      once: true, // Animasi hanya dipicu sekali
    });
  }, []);

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

  // Fungsi untuk menangani submit pada modal add MACHINEGROUP
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const record = {
      objecttype: formData.objecttype,
      objectgroup: formData.objectgroup,
      description: `'${formData.description}'`,
      active: formData.active,
    };

    try {
      // Gunakan fungsi insert yang telah dibuat sebelumnya
      await sendInsertRequest("MACHINEGROUP", record);

      onAdd();
      handleClose();
    } catch (error) {
      console.error("Error adding machine group:", error);
    } finally {
      setIsLoading(false); // Reset loading state setelah proses selesai
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 800); // Harus sesuai dengan durasi AOS
  };

  if (!isOpen && !isClosing) return null; // Menyembunyikan modal jika isOpen dan isClosing false

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)} // Tutup tur saat selesai
      />
      <div
        className={`bg-white w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto ${
          isClosing ? "aos-anchor" : ""
        }`}
        data-aos={isClosing ? "fade-up" : "fade-up"}
        data-aos-duration="800"
      >
        <div className="flex items-center justify-between mb-6">
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
              onClick={handleClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button flex items-center bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
            >
              {isLoading && <Spinner size={24} className="mr-2 animate-spin" />}
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineGroupModal;
