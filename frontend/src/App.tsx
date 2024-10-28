import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate, // Impor Navigate
} from "react-router-dom";
import Sidebar from "./components/Sidebar";

import MachineTypeData from "./pages/MachineTypeData";
import MachineGroupData from "./pages/MachineGroupData";
import MachineIdData from "./pages/MachineIdData";
import MachineDetailData from "./pages/MachineDetailData";
import MachineProfileData from "./pages/MachineProfileData";

const AppContent: React.FC = () => {
  const location = useLocation();

  // Tentukan lebar berdasarkan jalur
  const containerStyle =
    location.pathname === "/machineid" ||
    location.pathname === "/machinedetail" ||
    location.pathname === "/machineprofile"
      ? { width: "95%" }
      : { width: "100%" };

  return (
    <div
      className="p-1 ml-16 transition-all duration-300 ease-in-out"
      style={containerStyle}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/machinetype" replace />} /> {/* Redirect ke /machinetype */}
        <Route path="/machinetype" element={<MachineTypeData />} />
        <Route path="/machinegroup" element={<MachineGroupData />} />
        <Route path="/machineid" element={<MachineIdData />} />
        <Route path="/machinedetail" element={<MachineDetailData />} />
        <Route path="/machineprofile" element={<MachineProfileData />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex relative">
        <Sidebar />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
