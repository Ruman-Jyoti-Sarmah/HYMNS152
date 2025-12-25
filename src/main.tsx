import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { Router } from "./routes";
import "./utils/imageUtils"; // Load image utilities globally

console.log('main.tsx: Starting application...');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element:', rootElement);

if (rootElement) {
  console.log('main.tsx: Creating root...');
  const root = createRoot(rootElement);
  console.log('main.tsx: Created root, rendering app...');
  
  root.render(
    <StrictMode>
      <AppWrapper>
        <Router />
      </AppWrapper>
    </StrictMode>
  );
  console.log('main.tsx: App rendered successfully');
} else {
  console.error('main.tsx: Root element not found!');
}
