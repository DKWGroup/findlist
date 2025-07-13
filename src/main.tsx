import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("Starting app with original components...");

createRoot(document.getElementById("root")!).render(<App />);
