import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ls from "@livesession/browser";
import "./index.css";

ls.init("d955c4e2.3d0acf18");
ls.newPageView();

createRoot(document.getElementById("root")!).render(<App />);
