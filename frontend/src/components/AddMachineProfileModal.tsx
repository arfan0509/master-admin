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
import { shortenUrl, uploadToCloudinary } from "../utils/cloudinaryUtils";

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

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    Array(5).fill("")
  ); // Inisialisasi dengan array kosong
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State untuk menyimpan file yang dipilih

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSelectedFiles: File[] = [];
    const newPreviews = [...imagePreviews]; // Buat salinan dari preview saat ini

    // Loop untuk memproses setiap file yang dipilih
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Tambahkan file baru ke selectedFiles jika belum ada
      if (!selectedFiles.includes(file)) {
        newSelectedFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          // Temukan index pertama yang kosong untuk menambahkan preview
          const emptyIndex = newPreviews.findIndex((preview) => preview === "");
          if (emptyIndex !== -1) {
            newPreviews[emptyIndex] = reader.result as string; // Simpan URL data gambar
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    setSelectedFiles([...selectedFiles, ...newSelectedFiles]); // Update selected files
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...selectedFiles];

    // Hapus preview gambar yang dipilih
    updatedPreviews[index] = "";
    updatedFiles.splice(index, 1); // Hapus file dari selectedFiles

    // Update state
    setImagePreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

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

    // Pastikan semua field photogalery terisi
    if (selectedFiles.length < 5) {
      alert("Please upload all 5 images.");
      return;
    }

    // Upload gambar ke Cloudinary dan ambil URL pendek
    const updatedPhotos: Record<string, string> = {};

    // Upload semua gambar dan ambil short link
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          const shortUrl = await shortenUrl(imageUrl);
          updatedPhotos[`photogalery_${i + 1}`] = shortUrl; // Simpan short URL
          console.log(`Short URL for image ${i + 1}:`, shortUrl);
        }
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
        alert("Failed to upload images. Please try again.");
        return; // Keluar jika ada error
      }
    }

    // Update formData dengan short link yang baru
    const updatedFormData = { ...formData, ...updatedPhotos };

    // Format data untuk dikirim
    const jsonData = {
      datacore: "MACHINE",
      folder: "MACHINEPROFILE",
      command: "INSERT",
      group: "XCYTUA",
      property: "PJLBBS",
      record: {
        objecttype: updatedFormData.objecttype,
        objectgroup: updatedFormData.objectgroup,
        objectid: updatedFormData.objectid,
        objectcode: updatedFormData.objectcode,
        objectstatus: updatedFormData.objectstatus,
        objectname: `'${updatedFormData.objectname}'`,
        description: `'${updatedFormData.description}'`,
        registereddate: formatDate(
          updatedFormData.registereddate,
          "registereddate"
        ),
        registeredno: `'${updatedFormData.registeredno}'`,
        registeredby: `'${updatedFormData.registeredby}'`,
        countryoforigin: `'${updatedFormData.countryoforigin}'`,
        dob: formatDate(updatedFormData.dob, "dob"),
        sex: `'${updatedFormData.sex}'`,
        documentno: `'${updatedFormData.documentno}'`,
        vendor: `'${updatedFormData.vendor}'`,
        notes: `'${updatedFormData.notes}'`,
        photogalery_1: `'${updatedFormData.photogalery_1}'`, // Gunakan updatedFormData
        photogalery_2: `'${updatedFormData.photogalery_2}'`,
        photogalery_3: `'${updatedFormData.photogalery_3}'`,
        photogalery_4: `'${updatedFormData.photogalery_4}'`,
        photogalery_5: `'${updatedFormData.photogalery_5}'`,
        video: `'${updatedFormData.video}'`,
        active: updatedFormData.active,
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
    console.log("Encrypted Payload:", JSON.stringify(payload, null, 2));

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
      <div className="bg-white w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg relative z-10 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Machine Profile</h2>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block">Gender</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block">Upload Photos (Max 5)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              multiple
              required
            />
            <div className="mt-2 flex space-x-2">
              {imagePreviews.map((preview, index) =>
                preview ? (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      title="Remove image"
                    >
                      ✖
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div>
            <label className="block">Video</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              maxLength={36}
              required
            />
          </div>

          <div>
            <label className="block">Active</label>
            <div className="flex items-center mt-5 space-x-6">
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
              className="bg-[#385878] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
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
