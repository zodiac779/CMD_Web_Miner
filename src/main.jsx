import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, createConfig } from "wagmi";
import { jbc } from "wagmi/chains";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";

// ✅ เพิ่ม wallet connectors (MetaMask, WalletConnect)
import { injected, walletConnect } from "wagmi/connectors";

const config = createConfig({
  autoConnect: true,
  chains: [jbc],
  transports: {
    [jbc.id]: http(),
  },
  connectors: [
    injected(), // ✅ รองรับ MetaMask
    // walletConnect({ projectId: "YOUR_WALLETCONNECT_PROJECT_ID" }), // ✅ รองรับ WalletConnect
  ],
});

// ✅ ตั้งค่า React Query
const queryClient = new QueryClient();

// ✅ ตั้งค่า Theme ให้ Chakra UI (แก้ไขให้ถูกต้อง)
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
