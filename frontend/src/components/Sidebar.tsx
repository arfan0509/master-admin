// src/components/Sidebar.tsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <nav className="mt-10">
        <Link
          to="/machinetype"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Machinetype
        </Link>
        <Link
          to="/machinegroup"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Machinegroup
        </Link>
        <Link
          to="/machineid"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Machine ID
        </Link>
        <Link
          to="/machinedetail"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Machine Detail
        </Link>
        <Link
          to="/machineprofile"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Machine Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
