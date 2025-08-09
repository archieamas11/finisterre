import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner.tsx";

import App from "./App.tsx";
import { ThemeProvider } from "../src/context/ThemeContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </React.StrictMode>,
);
