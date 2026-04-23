import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import ReportIncident from "./pages/ReportIncident";
import AdminPanel from "./pages/AdminPanel";
import SignalControl from "./pages/SignalControl";
import Analytics from "./pages/Analytics";
import LiveCameras from "./pages/LiveCameras";
import ProjectDemo from "./pages/ProjectDemo";
import NotFound from "./pages/NotFound";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { startRealtimeSimulator } from "@/stores/trafficStore";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => { startRealtimeSimulator(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<LiveMap />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/cameras" element={<LiveCameras />} />
              <Route path="/demo" element={<ProjectDemo />} />
            </Route>

            <Route element={<RequireAuth roles={["admin", "police"]}><AppLayout /></RequireAuth>}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/signals" element={<SignalControl />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
