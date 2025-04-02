import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider"; // Ensure this exists
import "@aws-amplify/ui-react/styles.css";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <ThemeProvider>
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </SidebarProvider>
  );
}

