import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import localFont from "@next/font/local";
import { EthersExtension } from "@dynamic-labs/ethers-v6";

const myFont = localFont({ src: "./CalSans-SemiBold.woff2" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <DynamicContextProvider
        settings={{
          // environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
          environmentId: `2e9c0c2a-32a5-4c67-aa5e-5baedf5e58bc`,
          walletConnectors: [EthereumWalletConnectors],
          walletConnectorExtensions: [EthersExtension],
          eventsCallbacks : {
            onAuthSuccess: (args) => {
              console.log(args)
            }
          },
        }}
      >
        <DynamicWagmiConnector>
          <main className={myFont.className}>
            <Navbar />
            <Component {...pageProps} />
          </main>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </ChakraProvider>
  );
}
