import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LiveMap from "./pages/LiveMap";
import RepeatOffenders from "./pages/RepeatOffenders";
import BudgetTracker from "./pages/BudgetTracker";
import ComplaintStatus from "./pages/ComplaintStatus";
import Classify from "./pages/Classify";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/offenders" element={<RepeatOffenders />} />
        <Route path="/budget" element={<BudgetTracker />} />
        <Route path="/status" element={<ComplaintStatus />} />
        <Route path="/classify" element={<Classify />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
