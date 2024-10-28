// utils/cloudinaryUtils.ts
import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'system_uploader_1e2ddab171f769b9_c81a2702538920b44520ee41851b7949c7');

  try {
    // Periksa jenis file dan atur endpoint yang tepat
    const url = file.type.startsWith('video/') 
      ? 'https://api.cloudinary.com/v1_1/dsar5pxii/video/upload'
      : 'https://api.cloudinary.com/v1_1/dsar5pxii/image/upload';

    const response = await axios.post(url, formData);
    return response.data.secure_url; // URL gambar atau video yang sudah di-upload
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return null;
  }
};

// Fungsi untuk memendekkan URL menggunakan Bitly
export const shortenUrl = async (longUrl: string): Promise<string> => {
  const accessToken = 'af61e8f8ab4ff815bcf04ccb9319e31f516924d1'; // Access token Bitly Anda
  try {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Menggunakan Bearer token untuk otentikasi
      },
      body: JSON.stringify({ long_url: longUrl }), // Mengirim URL panjang dalam body permintaan
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.link; // Kembalikan URL pendek
  } catch (error) {
    console.error('Error shortening URL:', error);
    return longUrl; // Kembalikan URL asli jika ada kesalahan
  }
};

