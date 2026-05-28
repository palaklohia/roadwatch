import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LiveMap from "./pages/LiveMap";
import RepeatOffenders from "./pages/RepeatOffenders";
import BudgetTracker from "./pages/BudgetTracker";
import ComplaintStatus from "./pages/ComplaintStatus";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/map" />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/offenders" element={<RepeatOffenders />} />
        <Route path="/budget" element={<BudgetTracker />} />
        <Route path="/status" element={<ComplaintStatus />} />
      </Routes>
    </BrowserRouter>
  );
}