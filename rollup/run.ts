import { Wallet } from "ethers";
import { schemas } from "./src/actions";
import { stackrConfig } from "./stackr.config";
import {
  ATD,
  DIETARY,
  Education,
  Ethnicity,
  GTD,
  RELATIONSHIP,
  RELIGIOUS_STATUS,
  SPORTS,
  TypeOfDating,
  ZODIAC,
} from "./src/types";
const { domain } = stackrConfig;

type ActionName = keyof typeof schemas;

const walletOne = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890123"
);
const walletTwo = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890124"
);

const getBody = async (
  actionName: ActionName,
  wallet: Wallet,
  other: Wallet
) => {
  const walletAddress = wallet.address;

  const userDataBob = {
    address: walletAddress,
    preferences: JSON.stringify([
      TypeOfDating.CASUAL,
      ATD["18_21"],
      GTD.FEMALE,
      Education.UNDER_GRADUATE,
      Ethnicity.ASIAN,
      SPORTS.CRICKET,
      RELATIONSHIP.SINGLE,
      RELIGIOUS_STATUS.NONE,
      DIETARY.VEGETARIAN,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
    ]),
    extras: JSON.stringify([
      TypeOfDating.CASUAL,
      ATD["18_21"],
      GTD.MALE,
      Education.UNDER_GRADUATE,
      Ethnicity.ASIAN,
      SPORTS.FOOTBALL,
      RELATIONSHIP.SINGLE,
      RELIGIOUS_STATUS.SPIRITUAL,
      DIETARY.VEGETARIAN,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
    ]),
  };
  const userDataAlice = {
    address: walletAddress,
    preferences: JSON.stringify([
      TypeOfDating.CASUAL,
      ATD["18_21"],
      GTD.MALE,
      Education.UNDER_GRADUATE,
      Ethnicity.ASIAN,
      SPORTS.BADMINTON,
      RELATIONSHIP.SINGLE,
      RELIGIOUS_STATUS.AETHIST,
      DIETARY.VEGAN,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
    ]),
    extras: JSON.stringify([
      TypeOfDating.CASUAL,
      ATD["18_21"],
      GTD.FEMALE,
      Education.UNDER_GRADUATE,
      Ethnicity.ASIAN,
      SPORTS.CRICKET,
      RELATIONSHIP.SINGLE,
      RELIGIOUS_STATUS.NONE,
      DIETARY.VEGETARIAN,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
    ]),
  };

  let inputs = {};

  if (actionName == "create") {
    inputs =
      walletAddress == "0x4C42F75ceae7b0CfA9588B940553EB7008546C29"
        ? userDataBob
        : userDataAlice;
  } else if (actionName == "request") {
    inputs = {
      user1: walletAddress,
      user2: other.address,
      timestamp: Math.round(new Date().getTime() / 1000),
    };
  } else if (actionName == "match") {
    inputs = {
      user1: other.address,
      user2: walletAddress,
      timestamp: Math.round(new Date().getTime() / 1000),
    };
  } else if (actionName == "unmatch") {
    inputs = {
      user1: walletAddress,
      user2: other.address,
      timestamp: Math.round(new Date().getTime() / 1000),
    };
  } else if (actionName == "generateRecommendations") {
    inputs = {
      userAddress: walletAddress,
    };
  }
  console.log(inputs);

  const signature = await wallet.signTypedData(
    domain,
    schemas[actionName].EIP712TypedData.types,
    inputs
  );

  const body = JSON.stringify({
    msgSender: walletAddress,
    signature,
    inputs,
  });

  console.log(body);
  return body;
};

const run = async (actionName: ActionName, wallet: Wallet, other: Wallet) => {
  const start = Date.now();
  const body = await getBody(actionName, wallet, other);

  const res = await fetch(`http://localhost:5050/${actionName}`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const end = Date.now();
  const json = await res.json();

  const elapsedSeconds = (end - start) / 1000;
  const requestsPerSecond = 1 / elapsedSeconds;

  console.info(`Requests per second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`Response: ${JSON.stringify(json, null, 2)}`);
};

const main = async (actionName: string, walletName: string) => {
  if (!Object.keys(schemas).includes(actionName)) {
    throw new Error(
      `Action ${actionName} not found. Available actions: ${Object.keys(
        schemas
      ).join(", ")}`
    );
  }

  const wallet = walletName === "alice" ? walletOne : walletTwo;
  const other = walletName === "alice" ? walletTwo : walletOne;
  await run(actionName as ActionName, wallet, other);
};

main(process.argv[2], process.argv[3]);
