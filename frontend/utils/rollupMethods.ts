import { AddressLike, Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const domain = {
  name: "Stackr MVP v0",
  version: "1",
  chainId: 28,
  verifyingContract: "0xB7E6d84675F51F1bf29AFE0DB31B1B2A6fB798aC",
  salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
};

// Request , Match , Unmatch
export type RequestType = {
  user1: string;
  user2: string;
  timestamp: number;
};

export type RegisterInputType = {
  address: string;
  preferences: number[];
  extras: number[];
};

export type RegisterType = {
  address: string;
  preferences: string;
  extras: string;
};

export type RecommendType = {
  userAddress: string;
};

export const registerUser = async (userData: RegisterInputType) => {
  const wallet = Wallet.createRandom();

  const actionName = "create";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    const date = Math.round(new Date().getTime() / 1000);

    const payload: RegisterType = {
      address: userData.address,
      preferences: JSON.stringify(userData.preferences),
      extras: JSON.stringify(userData.extras),
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export const requestMatch = async (requestData: {
  userAddress: string;
  otherAddress: string;
}) => {
  const wallet = Wallet.createRandom();

  const actionName = "request";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    const date = Math.round(new Date().getTime() / 1000);

    const payload: RequestType = {
      user1: requestData.userAddress,
      user2: requestData.otherAddress,
      timestamp: date,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export const match = async (requestData: {
  userAddress: string; // current User
  otherAddress: string; // Other profile
}) => {
  const wallet = Wallet.createRandom();

  const actionName = "match";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    const date = Math.round(new Date().getTime() / 1000);

    const payload: RequestType = {
      user1: requestData.otherAddress,
      user2: requestData.userAddress,
      timestamp: date,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export const unmatch = async (requestData: {
  userAddress: string; // current User
  otherAddress: string; // Other profile
}) => {
  const wallet = Wallet.createRandom();

  const actionName = "unmatch";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    const date = Math.round(new Date().getTime() / 1000);

    const payload: RequestType = {
      user1: requestData.userAddress,
      user2: requestData.otherAddress,
      timestamp: date,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export type UserDataType = {
  address: string;
  currentMatch: string; // Only 1 match at a point
  matches: number;
  unmatches: number;
  preferences: number[]; // User choices , This will be used to get recommended profile
  extras: number[]; // Users Data , Used to compare other profile with this data
  recommendations: string[]; // User address for the recommended profiles, refereshed every certain period};
};

export enum MatchStatus {
  "REQUESTED",
  "REJECTED",
  "MATCHED",
  "UNMATCHED",
  "CANCELLED",
}

export type MatchRequestType = {
  user1: string; // requested By
  user2: string; // requested To
  timestamp: number;
  status: MatchStatus;
};

// getUserData , and also for recommendations
export const getUserDataRollup = async (
  userAddress: string
): Promise<UserDataType | undefined> => {
  try {
    const res = await fetch(`http://localhost:5050/users/${userAddress}`);

    const json = await res.json();
    console.log(json);
    const data = json.user;
    return data;
  } catch (error) {
    console.log(error);
  }
};

// get User match requests , requested by other users , and currently in requested state
export const getUserMatchRequests = async (
  userAddress: string
): Promise<MatchRequestType[] | undefined> => {
  try {
    const res = await fetch(
      `http://localhost:5050/matchRequests/${userAddress}`
    );

    const json = await res.json();
    console.log(json);
    const data: MatchRequestType[] = json.matchRequests;
    return data;
  } catch (error) {
    console.log(error);
  }
};

// get all the users in the protocol , might need to filter out the people who already have a current match
export const getAllUsers = async (): Promise<UserDataType[] | undefined> => {
  try {
    const res = await fetch(`http://localhost:5050/users`);

    const json = await res.json();
    console.log(json);
    const data = json.users;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const generateRecommendations = async (userAddress: string) => {
  const wallet = Wallet.createRandom();

  const actionName = "generateRecommendations";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    const date = Math.round(new Date().getTime() / 1000);

    const payload: RecommendType = {
      userAddress: userAddress,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

// Initial Feed
// - All users +  recommendations ( sorted with recommendations on top) -> request

// Requests Feed
// - Requests from other users -> match
