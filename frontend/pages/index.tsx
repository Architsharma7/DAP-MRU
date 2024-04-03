import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createPublicClient, http } from "viem";
import { WalletClient } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  useEmbeddedWallet,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import Onboarding from "@/components/onboarding";
import { getAddress } from "@/firebase";
import { useEffect, useState } from "react";

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

export default function Home() {
  const { user, handleLogOut, primaryWallet } = useDynamicContext();
  const { userHasEmbeddedWallet } = useEmbeddedWallet();
  const userWallets = useUserWallets();
  const [userHasSignedUp, setUserHasSignedUp] = useState(false);

  useEffect(() => {
    const checkUserSignUp = async () => {
      const userHasSignedUpPreviously = await getAddress(
        userWallets[0]?.address
      );
      await setUserHasSignedUp(userHasSignedUpPreviously);
    };
    checkUserSignUp();
  }, [userWallets]);

  return (
    <div>
      {userHasEmbeddedWallet() ? (
        <div>
          <button onClick={() => handleLogOut()}>log out</button>
        </div>
      ) : (
        <DynamicWidget />
      )}
      <div>
        {userWallets &&
          userWallets.map((wallet) => (
            <p key={wallet.id}>
              {wallet.address}:{" "}
              {wallet.connected ? "Connected" : "Not connected"} {user?.email}
              {userHasEmbeddedWallet()
                ? "Has embedded wallet"
                : "No embedded wallet"}
            </p>
          ))}
      </div>
      {userHasSignedUp ? (
        <div>
          <p> Welcome back {user?.email}</p>
        </div>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
