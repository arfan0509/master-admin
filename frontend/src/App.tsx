// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import MachineTypeData from "./pages/MachineTypeData";
import MachineGroupData from "./pages/MachineGroupData";
import MachineIdData from "./pages/MachineIdData";
import MachineDetailData from "./pages/MachineDetailData";
import MachineProfileData from "./pages/MachineProfileData";

function App() {
  return (
    <Router>
      <div className="flex relative">
        <Sidebar />
        <div className="p-6 w-full ml-20 transition-all duration-300 ease-in-out">
          {/* Ensure margin-left adjusts with sidebar width */}
          <Routes>
            <Route path="/machinetype" element={<MachineTypeData />} />
            <Route path="/machinegroup" element={<MachineGroupData />} />
            <Route path="/machineid" element={<MachineIdData />} />
            <Route path="/machinedetail" element={<MachineDetailData />} />
            <Route path="/machineprofile" element={<MachineProfileData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
