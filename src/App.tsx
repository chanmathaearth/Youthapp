import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EvaluationPage from "./pages/EvaluationPage"
import EvaluationFormPage from "./pages/EvaluationFormPage"
import WeightheightPage from "./pages/WeightHeightFormPage"
import ResultPage from "./pages/ResultPage"
import DashboardPage from "./pages/DashboardPage"
import SettingPage from "./pages/SettingPage"

// Move useLocation to AppWrapper
function AppWrapper() {
  const location = useLocation();
  const hideTopbar =
  location.pathname === "/login" ||
  location.pathname.includes("/form/") ||
  location.pathname.includes("/measureform/") ||
  location.pathname.includes("/result/");

  return (
    <>
      {!hideTopbar  && <Topbar />} 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/evaluation/:room" element={<EvaluationPage />} />
        <Route path="/evaluation/:room/form/:childId" element={<EvaluationFormPage />} />
        <Route path="/evaluation/:room/measureform/:childId" element={<WeightheightPage />} />
        <Route path="/evaluation/:room/result/:childId" element={<ResultPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper /> {/* Wrap AppWrapper with BrowserRouter */}
    </BrowserRouter>
  );
}

export default App;
