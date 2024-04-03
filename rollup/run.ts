import { Wallet } from "ethers";
import { schemas } from "./src/actions";
import { stackrConfig } from "./stackr.config";
import {
  ATD,
  Education,
  Ethnicity,
  GTD,
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
  const inputs =
    actionName === "create"
      ? {
          address: walletAddress,
          preferences: JSON.stringify([1, 3, 7, 8]),
          extras: JSON.stringify([
            TypeOfDating.CASUAL,
            Ethnicity.ASIAN,
            GTD.FEMALE,
            ATD["18_21"],
            Education.UNDER_GRADUATE,
            ZODIAC.SAGITTARIUS,
          ]),
        }
      : actionName === "match"
      ? {
          user1: other.address,
          user2: walletAddress,
          timestamp: Math.round(new Date().getTime() / 1000),
        }
      : {
          user1: walletAddress,
          user2: other.address,
          timestamp: Math.round(new Date().getTime() / 1000),
        };

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
