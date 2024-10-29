import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptMessage } from "../utils/encryptionUtils";
import {
  fetchMachineTypes,
  fetchMachineGroups,
  fetchMachineIds,
  fetchMachineDetails,
} from "../utils/dropdownUtils";
import { countries } from "../utils/countries";
import Tour from "reactour"; // Import React Tour
import { Notebook } from "@phosphor-icons/react"; // Import ikon Notebook dari Phosphor

interface AddMachineProfileModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddMachineProfileModal: React.FC<AddMachineProfileModalProps> = ({
  onClose,
  onAdd,
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

  const [isTourOpen, setIsTourOpen] = useState(false); // State untuk mengontrol tur
  const steps = [
    {
      selector: ".objecttype-input",
      content:
        "Pilih tipe objek yang relevan. Pastikan untuk memilih tipe yang sesuai dengan profil mesin.",
    },
    {
      selector: ".objectgroup-input",
      content:
        "Pilih grup objek yang sesuai. Pilihan ini akan aktif setelah Object Type dipilih.",
    },
    {
      selector: ".objectid-input",
      content:
        "Pilih Object ID yang terkait. Opsi ini akan aktif setelah Object Group dipilih.",
    },
    {
      selector: ".objectcode-input",
      content:
        "Pilih kode objek yang sesuai. Opsi ini hanya aktif setelah Object ID dipilih.",
    },
    {
      selector: ".objectname-input",
      content:
        "Nama objek akan tampil di sini. Bagian ini bersifat hanya baca dan tidak dapat diedit.",
    },
    {
      selector: ".objectstatus-input",
      content:
        "Masukkan status objek menggunakan satu huruf, misalnya 'A' untuk aktif.",
    },
    {
      selector: ".description-input",
      content: "Deskripsikan profil mesin ini (maksimal 50 karakter).",
    },
    {
      selector: ".registereddate-input",
      content: "Pilih tanggal registrasi mesin.",
    },
    {
      selector: ".registeredno-input",
      content: "Masukkan nomor registrasi mesin.",
    },
    {
      selector: ".registeredby-input",
      content: "Masukkan nama atau kode pendaftar.",
    },
    {
      selector: ".countryoforigin-input",
      content: "Pilih negara asal mesin dari daftar negara yang tersedia.",
    },
    {
      selector: ".dob-input",
      content:
        "Masukkan tanggal lahir atau tanggal pembuatan mesin (jika relevan).",
    },
    {
      selector: ".sex-input",
      content:
        "Pilih jenis kelamin, jika mesin memiliki relevansi tertentu (misalnya pada profil user-driven machine).",
    },
    {
      selector: ".documentno-input",
      content: "Masukkan nomor dokumen resmi terkait mesin.",
    },
    {
      selector: ".vendor-input",
      content: "Masukkan nama vendor atau pemasok mesin.",
    },
    {
      selector: ".notes-input",
      content:
        "Tambahkan catatan penting atau informasi tambahan mengenai mesin (maksimal 50 karakter).",
    },
    {
      selector: ".photogalery-input",
      content:
        "Tambahkan ID gambar galeri untuk dokumentasi visual mesin, di kolom yang tersedia dari 1 hingga 5.",
    },
    {
      selector: ".video-input",
      content:
        "Tambahkan ID video terkait mesin untuk dokumentasi lebih lanjut.",
    },
    {
      selector: ".active-radio",
      content:
        "Pilih status aktif mesin dengan opsi 'Yes' atau 'No' sesuai kebutuhan.",
    },
    {
      selector: ".submit-button",
      content:
        "Klik 'Submit' untuk menambahkan atau menyimpan profil mesin yang telah diisi.",
    },
  ];

  const handleStartTour = () => {
    setIsTourOpen(true); // Mulai tur saat tombol diklik
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
      onAdd();
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
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)} // Tutup tur saat selesai
      />
      <div className="bg-white w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-5">
          <h2 className="text-xl font-bold">Add Machine Profile</h2>
          <button onClick={handleStartTour} className="p-2">
            <Notebook size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
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
              {machineTypes.map((type) => (
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
              className="objectgroup-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!formData.objecttype}
            >
              <option value="">Select Object Group</option>
              {filteredMachineGroups.length > 0 ? (
                filteredMachineGroups.map((group) => (
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
              className="objectid-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!formData.objectgroup}
            >
              <option value="">Select Object ID</option>
              {filteredMachineIds.length > 0 ? (
                filteredMachineIds.map((id) => (
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
              className="objectcode-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!formData.objectid}
            >
              <option value="">Select Object Code</option>
              {filteredObjectCodes.length > 0 ? (
                filteredObjectCodes.map((code) => (
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
              className="objectname-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="objectstatus-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={1}
              required
            />
          </div>

          <div>
            <label className="block">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="description-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Registered Date</label>
            <input
              type="date"
              name="registereddate"
              value={formData.registereddate}
              onChange={handleChange}
              className="registereddate-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Registered No</label>
            <input
              type="text"
              name="registeredno"
              value={formData.registeredno}
              onChange={handleChange}
              className="registeredno-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Registered By</label>
            <input
              type="text"
              name="registeredby"
              value={formData.registeredby}
              onChange={handleChange}
              className="registeredby-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Country of Origin</label>
            <select
              name="countryoforigin"
              value={formData.countryoforigin}
              onChange={handleChange}
              className="countryoforigin-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block">Date of Birth</label>
            <input
              type="datetime-local"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="dob-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Gender</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="sex-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Gender</option>
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
              className="documentno-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="vendor-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="notes-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Photo Gallery 1</label>
            <input
              type="text"
              name="photogalery_1"
              value={formData.photogalery_1}
              onChange={handleChange}
              className="photogalery-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={36}
              required
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
              maxLength={36}
              required
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
              maxLength={36}
              required
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
              maxLength={36}
              required
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
              maxLength={36}
              required
            />
          </div>

          <div>
            <label className="block">Video</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="video-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={36}
              required
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

          <div className="col-span-2 flex justify-end mt-4">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineProfileModal;
