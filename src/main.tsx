import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startRealtimeSimulator } from "./stores/trafficStore";

startRealtimeSimulator();

createRoot(document.getElementById("root")!).render(<App />);
