import React from "react";
import { X } from "@phosphor-icons/react";

interface MachineDetailGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MachineDetailGuide: React.FC<MachineDetailGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-3/4 2xl:w-1/2 max-h-screen overflow-y-auto rounded-lg shadow-lg p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#385878]">
            Panduan Penggunaan Halaman Machine Detail
          </h1>
          <button onClick={onClose} className="absolute top-4 right-4">
            <X
              size={25}
              weight="bold"
              className="text-gray-600 transition duration-100 hover:scale-110"
            />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-gray-800 space-y-4 leading-[1.6rem]">
          <p>
            Halaman ini digunakan untuk mengelola data Machine Detail. Pengguna dapat menambah, mengedit, menampilkan, mencari, menyaring, serta mengekspor data. Berikut adalah langkah-langkah penggunaan fitur yang ada di halaman <strong className="text-[#385878]">Machine Detail</strong>:
          </p>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">1. Menampilkan Data</h2>
            <p>Saat pertama kali membuka halaman, data Machine Detail akan ditampilkan dalam bentuk tabel. Setiap baris data berisi informasi mengenai:</p>
            <ul className="list-disc list-inside">
              <li><strong className="text-[#385878]">Object Type:</strong> Jenis objek mesin.</li>
              <li><strong className="text-[#385878]">Object Group:</strong> Grup objek mesin.</li>
              <li><strong className="text-[#385878]">Object ID:</strong> ID objek mesin.</li>
              <li><strong className="text-[#385878]">Object Code:</strong> Kode objek mesin.</li>
              <li><strong className="text-[#385878]">Object Name:</strong> Nama objek mesin.</li>
              <li><strong className="text-[#385878]">Latitude:</strong> Garis lintang lokasi mesin.</li>
              <li><strong className="text-[#385878]">Longitude:</strong> Garis bujur lokasi mesin.</li>
              <li><strong className="text-[#385878]">Active:</strong> Status aktif atau tidak dari mesin.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">2. Mencari Data</h2>
            <p>Pengguna dapat mencari Machine Detail tertentu dengan menggunakan kolom pencarian di bagian atas tabel. Data akan difilter secara dinamis sesuai dengan kata kunci yang dimasukkan. Pencarian dapat dilakukan berdasarkan:</p>
            <ul className="list-disc list-inside">
              <li><strong className="text-[#385878]">Object Type</strong></li>
              <li><strong className="text-[#385878]">Object Group</strong></li>
              <li><strong className="text-[#385878]">Object ID</strong></li>
              <li><strong className="text-[#385878]">Object Code</strong></li>
              <li><strong className="text-[#385878]">Object Name</strong></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">3. Menyaring Data (Filter)</h2>
            <p>Pengguna dapat menyaring data berdasarkan:</p>
            <ul className="list-disc list-inside">
              <li><strong className="text-[#385878]">Status Aktif/Inaktif:</strong> Pilihan "Active" untuk menampilkan data yang aktif, atau "Inactive" untuk menampilkan yang tidak aktif.</li>
              <li><strong className="text-[#385878]">Tanggal Terbaru/Terlama:</strong> Pilihan "Latest" untuk menampilkan data terbaru, atau "Oldest" untuk menampilkan yang paling lama.</li>
            </ul>
            <p>Pengguna dapat memilih opsi filter dari dropdown yang tersedia di atas tabel.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">4. Menambahkan Data</h2>
            <p>Untuk menambahkan Machine Detail baru, ikuti langkah-langkah berikut:</p>
            <ol className="list-decimal list-inside">
              <li>Klik tombol <strong className="text-[#385878]">Add Data</strong> di pojok kiri atas halaman.</li>
              <li>Isi form dalam modal <strong className="text-[#385878]">Add Machine Detail</strong> dengan informasi berikut:</li>
              <ul className="list-disc ml-6">
                <li><strong className="text-[#385878]">Object Type:</strong> Jenis objek mesin (wajib diisi).</li>
                <li><strong className="text-[#385878]">Object Group:</strong> grup objek mesin (wajib diisi).</li>
                <li><strong className="text-[#385878]">Object ID:</strong> ID objek mesin (wajib diisi).</li>
                <li><strong className="text-[#385878]">Object Code:</strong> Kode objek mesin (maksimal 64 karakter).</li>
                <li><strong className="text-[#385878]">Object Name:</strong> Nama objek mesin (maksimal 50 karakter).</li>
                <li><strong className="text-[#385878]">Latitude & Longitude:</strong> Lokasi mesin dalam bentuk koordinat geografis.</li>
                <li><strong className="text-[#385878]">Status Active:</strong> Tentukan apakah mesin aktif atau tidak.</li>
              </ul>
              <li>Klik tombol <strong className="text-[#385878]">Save</strong> untuk menyimpan data.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">5. Mengedit Data</h2>
            <p>Untuk mengedit data Machine Detail:</p>
            <ol className="list-decimal list-inside">
              <li>Klik tombol <strong className="text-[#385878]">Edit</strong> pada baris data yang ingin diubah.</li>
              <li>Modal <strong className="text-[#385878]">Edit Machine Detail</strong> akan terbuka, dan pengguna dapat mengubah informasi yang ada.</li>
              <li>Klik tombol <strong className="text-[#385878]">Update</strong> untuk menyimpan perubahan.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">6. Mengekspor Data ke Excel</h2>
            <p>Untuk mengekspor data ke file Excel, ikuti langkah-langkah berikut:</p>
            <ol className="list-decimal list-inside">
              <li>Klik tombol <strong className="text-[#385878]">Export to Excel</strong> di sebelah kanan kolom pencarian.</li>
              <li>Data yang sudah difilter akan diekspor ke file Excel dengan nama <strong className="text-[#385878]">FilteredMachineDetails.xlsx</strong>.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#385878]">7. Navigasi Halaman (Pagination)</h2>
            <p>Jika jumlah data melebihi batas tampilan halaman, tabel akan membagi data ke dalam beberapa halaman. Gunakan tombol panah di bawah tabel untuk berpindah halaman, atau klik nomor halaman untuk memilih halaman tertentu. Setiap halaman menampilkan 5 baris data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailGuide;
