// utils/cloudinaryUtils.ts
import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'pyxis-uploads'); // Ganti dengan upload preset Cloudinary Anda
  formData.append('api_key', '151198526961299'); // Ganti dengan API Key Cloudinary Anda

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dsar5pxii/image/upload',
      formData
    );
    return response.data.secure_url; // URL gambar yang sudah di-upload
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
};
