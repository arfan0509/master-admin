// src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Import Lottie player

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white sticky top-0">
      {/* Bagian Logo dengan Lottie di sebelah kiri */}
      <div className="flex items-center justify-center h-20 bg-gray-900">
        {/* Lottie Animation */}
        <DotLottieReact
          src="https://lottie.host/3d4b2349-8888-4a0a-b1a7-9f6e7bb0a3c6/TLq13zbNQO.json" // Path ke animasi .lottie
          loop
          autoplay
          style={{ height: "35px", width: "35px" }} // Ukuran animasi
        />
        <h1 className="text-xl font-bold ml-2">Master Admin</h1>{" "}
        {/* Logo di sebelah animasi */}
      </div>

      <nav className="mt-10">
        <Link
          to="/machinetype"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform"
        >
          Machinetype
        </Link>
        <Link
          to="/machinegroup"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform"
        >
          Machinegroup
        </Link>
        <Link
          to="/machineid"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform"
        >
          Machine ID
        </Link>
        <Link
          to="/machinedetail"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform"
        >
          Machine Detail
        </Link>
        <Link
          to="/machineprofile"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform"
        >
          Machine Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
