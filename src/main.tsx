import React from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner.tsx";

import App from "./App.tsx";
import { ThemeProvider } from "@/components/provider/theme-provider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
