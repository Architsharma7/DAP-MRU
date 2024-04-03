import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
// environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: `2e9c0c2a-32a5-4c67-aa5e-5baedf5e58bc`,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWagmiConnector>
        <Component {...pageProps} />
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
}
