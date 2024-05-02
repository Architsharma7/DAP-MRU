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
  if (!primaryWallet) {
    return;
  }
  //@ts-ignore
  const signer: Signer =
    //@ts-ignore
    (await primaryWallet?.connector?.ethers?.getSigner()) as Signer;
  console.log(signer);

  const tx = await signer.signMessage("Hello, world!");
  await console.log(tx);

  // for signing the typed data
  // const tx = await signer.signTypedData();

  const address = await signer.getAddress();
  console.log(address);
};

const Home: React.FC = () => {
  const { userHasEmbeddedWallet } = useEmbeddedWallet();
  const userWallets = useUserWallets();
  const [userHasSignedUp, setUserHasSignedUp] = useState(false);
  const router = useRouter();

  const { primaryWallet } = useDynamicContext();

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
