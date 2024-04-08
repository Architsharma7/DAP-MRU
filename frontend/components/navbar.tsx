import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  useDynamicContext,
  useEmbeddedWallet,
} from "@dynamic-labs/sdk-react-core";

const Navbar = () => {
  const router = useRouter();
  const { user, handleLogOut, primaryWallet } = useDynamicContext();
  const { userHasEmbeddedWallet } = useEmbeddedWallet();

  const logout = async () => {
    handleLogOut();
    await router.push("/");
  }

  return (
    <div className="w-screen">
      <div className="flex px-10 pt-3 pb-1 justify-between align-middle">
        <div></div>
        <p
          onClick={() => router.push("/")}
          className="text-transparent bg-clip-text bg-blue-400 text-4xl cursor-pointer"
        >
          Dating-MRU
        </p>
        {userHasEmbeddedWallet() ? (
          <div>
            <button
              className="text-center text-blue-500 border-blue-500 px-6 font-semibold text-md py-1 border rounded-xl hover:bg-blue-500 hover:text-white hover:scale-105 duration-150"
              onClick={() => logout()}
            >
              log-out
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

// export default Navbar;
export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
