// src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Gear, Stack, Tag, Info, UserGear } from "@phosphor-icons/react"; // Import ikon dari Phosphor Icons

const Sidebar = () => {
  return (
    <div className="w-16 h-screen bg-[#385878] text-white fixed z-50 top-0 transition-all duration-300 ease-in-out hover:w-64 overflow-hidden">
      {/* Bagian Logo dengan Lottie di sebelah kiri */}
      <div className="mt-14 ml-3 flex items-center">
        <DotLottieReact
          src="https://lottie.host/65271e8d-ed66-4079-af24-688a030cfa30/txzWa7dG6y.json" // Path ke animasi .lottie
          loop
          autoplay
          style={{ height: "45px", width: "45px" }} // Ukuran animasi
        />
        <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block text-xl font-bold">
          Master Admin
        </span>
      </div>

      <nav className="mt-8">
        <Link
          to="/machinetype"
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform group"
        >
          <Gear size={24} />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block">
            Machinetype
          </span>
        </Link>
        <Link
          to="/machinegroup"
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform group"
        >
          <Stack size={24} />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block">
            Machinegroup
          </span>
        </Link>
        <Link
          to="/machineid"
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform group"
        >
          <Tag size={24} />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block">
            Machine ID
          </span>
        </Link>
        <Link
          to="/machinedetail"
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform group"
        >
          <Info size={24} />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block">
            Machine Detail
          </span>
        </Link>
        <Link
          to="/machineprofile"
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-yellow-400 hover:scale-105 transform group"
        >
          <UserGear size={24} />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-300 group-hover:opacity-100 absolute left-16 group-hover:block">
            Machine Profile
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
