import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createPublicClient, http } from "viem";
import { WalletClient } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  useEmbeddedWallet,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import Onboarding from "@/pages/onboarding";
import { getAddress } from "@/firebase";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const signTransaction = async (primaryWallet: any) => {
  const publicClient = createPublicClient({
    transport: http("https://rpc.ankr.com/eth_goerli"),
  });

  const client: WalletClient =
    (await primaryWallet?.connector.getSigner()) as WalletClient;

  const txRequest = {
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as `0x${string}`,
    value: BigInt(1),
  };

  const txHash = await client.sendTransaction(txRequest);
  console.log(`Success! Transaction broadcasted with hash ${txHash}`);
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log(txHash);
};

const Home: React.FC = () => {
  const { userHasEmbeddedWallet } = useEmbeddedWallet();
  const userWallets = useUserWallets();
  const [userHasSignedUp, setUserHasSignedUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserSignUp = async () => {
      const userHasSignedUpPreviously = await getAddress(
        userWallets[0]?.address
      );
      setUserHasSignedUp(userHasSignedUpPreviously || false);
    };
    checkUserSignUp();
  }, [userWallets]);

  return (
    <div>
      <div className="w-screen">
        <main className="main">
          <div className="flex flex-col">
            <div className="text-center text-3xl text-slate-600">
              <p className="text-7xl text-blue-500 font-serif font-semibold">
                DatingMRU
              </p>
              <p className="mt-7">
                Find love and companionship on a platform designed for genuine
                connections
              </p>
              <p>Join thousands of singles in discovering </p>
              <p className=" ">romance and happiness together</p>
            </div>
            <div className="mt-10 flex justify-center mx-auto">
              {userHasEmbeddedWallet() && userHasSignedUp ? (
                <button
                  onClick={() => router.push("/recommendations")}
                  className="text-xl px-10 py-2 border-2 border-black rounded-xl hover:scale-110 duration-300"
                >
                  Go to Recommendations
                </button>
              ) : userHasEmbeddedWallet() && !userHasSignedUp ? (
                <button
                  onClick={() => router.push("/onboarding")}
                  className="text-xl px-10 py-2 border-2 border-black rounded-xl hover:scale-110 duration-300"
                >
                  Onboard Now
                </button>
              ) : (
                <DynamicWidget />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
