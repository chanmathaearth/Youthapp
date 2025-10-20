import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EvaluationPage from "./pages/EvaluationPage";
import EvaluationFormPage from "./pages/EvaluationFormPage";
import WeightheightPage from "./pages/WeightHeightFormPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForbiddenPage from "./pages/ForbiddenPage";

function AppWrapper() {
    const location = useLocation();
    const hideTopbar =
        location.pathname === "/login" ||
        location.pathname.includes("/form/") ||
        location.pathname.includes("/measureform/") ||
        location.pathname.includes("/result/") ||
        location.pathname.includes("/403");

    return (
        <>
            {!hideTopbar && <Topbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/rooms/:roomId/evaluations"
                    element={<EvaluationPage />}
                />
                <Route
                    path="/rooms/:roomId/evaluations/:childId/assessment"
                    element={<EvaluationFormPage />}
                />
                <Route
                    path="/rooms/:roomId/evaluations/:childId/growth"
                    element={<WeightheightPage />}
                />
                <Route
                    path="/rooms/:roomId/evaluations/:childId/result"
                    element={<ResultPage />}
                />
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route
                        path="/admin/dashboard"
                        element={<DashboardPage />}
                    />
                    <Route path="/admin/settings" element={<SettingPage />} />
                </Route>
                <Route path="/403" element={<ForbiddenPage />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}

export default App;
