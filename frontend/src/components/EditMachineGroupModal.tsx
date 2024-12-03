import React, { useState, useEffect } from "react";
import { fetchMachineTypes } from "../utils/dropdownUtils";
import Tour from "reactour"; // Import React Tour
import { Notebook, Spinner } from "@phosphor-icons/react";
import { sendEncryptedRequest } from "../utils/apiUtils";
import AOS from "aos";
import "aos/dist/aos.css";

interface MachineGroup {
  id: number;
  objecttype: string; // Tipe objek
  objectgroup: string;
  description: string;
  active: string;
}

interface EditMachineGroupModalProps {
  machineGroup: MachineGroup;
  onClose: () => void;
  onUpdate: () => void;
}

const EditMachineGroupModal: React.FC<EditMachineGroupModalProps> = ({
  machineGroup,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    id: machineGroup.id,
    objecttype: machineGroup.objecttype,
    objectgroup: machineGroup.objectgroup,
    description: machineGroup.description,
    active: machineGroup.active,
  });

  const [objectTypes, setObjectTypes] = useState<{ id: number; objecttype: string }[]>([]);
  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // State for handling modal close animation

  useEffect(() => {
    const fetchObjectTypes = async () => {
      try {
        const response = await fetchMachineTypes();
        setObjectTypes(response);
      } catch (error) {
        console.error("Error fetching object types:", error);
      }
    };

    fetchObjectTypes();

    // Initialize AOS for animations
    AOS.init({
      duration: 800, // Durasi animasi (ms)
      offset: 100, // Jarak dari viewport sebelum animasi dimulai
      once: true, // Animasi hanya dipicu sekali
    });
  }, []);

  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih atau perbarui Object Type yang sesuai jika diperlukan. Pastikan sesuai dengan Object Group yang akan diperbarui.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Masukkan atau perbarui Object Group (maks 6 karakter) jika diperlukan.",
    },
    {
      selector: ".description-input",
      content:
        "Masukkan atau perbarui deskripsi (maks 50 karakter) jika diperlukan.",
    },
    {
      selector: ".active-radio",
      content: "Pilih apakah Machine Group ini aktif/nonaktif.",
    },
    {
      selector: ".submit-button",
      content: "Klik 'Update' untuk menyimpan perubahan pada Machine Group.",
    },
  ];

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const record = {
      objecttype: `'${formData.objecttype}'`,
      objectgroup: `'${formData.objectgroup}'`,
      description: `'${formData.description}'`,
      active: `'${formData.active}'`,
    };

    const condition = {
      id: { operator: "eq", value: formData.id },
    };

    try {
      await sendEncryptedRequest("MACHINEGROUP", record, condition);
      await sendEncryptedRequest(
        "MACHINEID",
        { objectgroup: `'${formData.objectgroup}'` },
        { objectgroup: { operator: "eq", value: machineGroup.objectgroup } }
      );
      await sendEncryptedRequest(
        "MACHINEDETAIL",
        { objectgroup: `'${formData.objectgroup}'` },
        { objectgroup: { operator: "eq", value: machineGroup.objectgroup } }
      );
      await sendEncryptedRequest(
        "MACHINEPROFILE",
        { objectgroup: `'${formData.objectgroup}'` },
        { objectgroup: { operator: "eq", value: machineGroup.objectgroup } }
      );
      await sendEncryptedRequest(
        "MACHINEPRODUCTIVITY",
        { objectgroup: `'${formData.objectgroup}'` },
        { objectgroup: { operator: "eq", value: machineGroup.objectgroup } }
      );
      await sendEncryptedRequest(
        "MACHINERECORDS",
        { objectgroup: `'${formData.objectgroup}'` },
        { objectgroup: { operator: "eq", value: machineGroup.objectgroup } }
      );

      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Error updating machine group or related tables:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 800); // Must match the AOS duration for a smooth close animation
  };

  if (!machineGroup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
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
          <h2 className="text-xl font-bold">Edit Machine Group</h2>
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
              {objectTypes.map((type) => (
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
              <label className="inline-flex items-center cursor-pointer">
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
              {isLoading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMachineGroupModal;
