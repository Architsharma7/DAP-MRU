import express, { Request, Response } from "express";

import { ActionEvents } from "@stackr/sdk";
import { Playground } from "@stackr/sdk/plugins";
import { schemas } from "./actions.ts";
import { DatingMachine, mru } from "./app.ts";
import { transitions } from "./transitions.ts";
import cors from "cors";

console.log("Starting server...");

const datingMachine = mru.stateMachines.get<DatingMachine>("dating-app");

const app = express();
app.use(express.json());
app.use(cors());

const playground = Playground.init(mru);

playground.addGetMethod(
  "/custom/hello",
  async (_req: Request, res: Response) => {
    res.send("Hello World");
  }
);

const { actions, chain, events } = mru;

app.get("/actions/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const action = await actions.getByHash(hash);
  if (!action) {
    return res.status(404).send({ message: "Action not found" });
  }
  return res.send(action);
});

app.get("/blocks/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const block = await chain.getBlockByHash(hash);
  if (!block) {
    return res.status(404).send({ message: "Block not found" });
  }
  return res.send(block.data);
});

app.post("/:reducerName", async (req: Request, res: Response) => {
  const { reducerName } = req.params;
  console.log(req.params);

  const actionReducer = transitions[reducerName];

  if (!actionReducer) {
    res.status(400).send({ message: "̦̦no reducer for action" });
    return;
  }
  const action = reducerName as keyof typeof schemas;

  console.log(req.body);
  const { msgSender, signature, inputs } = req.body;

  const schema = schemas[action];

  try {
    const newAction = schema.actionFrom({ msgSender, signature, inputs });
    const ack = await mru.submitAction(reducerName, newAction);
    res.status(201).send({ ack });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
  return;
});

events.subscribe(ActionEvents.SUBMIT, (args) => {
  console.log("Submitted an action", args);
});

events.subscribe(ActionEvents.EXECUTION_STATUS, async (action) => {
  console.log("Submitted an action", action);
});

app.get("/", (_req: Request, res: Response) => {
  return res.send({ state: datingMachine?.state });
});

type ActionName = keyof typeof schemas;

app.get("/getEIP712Types/:action", (_req: Request, res: Response) => {
  // @ts-ignore
  const { action }: { action: ActionName } = _req.params;

  const eip712Types = schemas[action].EIP712TypedData.types;
  return res.send({ eip712Types });
});

app.get("/users/:userAddress", (_req: Request, res: Response) => {
  // @ts-ignore
  const { userAddress }: { userAddress: string } = _req.params;
  const users = datingMachine?.state.users;

  const user = users?.find((user) => user.address == userAddress);

  if (!user) {
    res.status(400).send({ error: "Intent Request not found" });
  }
  return res.send({ user });
});

app.get("/users", (_req: Request, res: Response) => {
  // @ts-ignore
  const { userAddress }: { userAddress: string } = _req.params;
  const users = datingMachine?.state.users;

  return res.send({ users });
});

// only give requests in the requests Status
app.get("/matchRequests/:userAddress", (_req: Request, res: Response) => {
  // @ts-ignore
  const { userAddress }: { userAddress: string } = _req.params;
  const requests = datingMachine?.state.matchRequests;

  const matchRequests = requests?.find(
    (request) => request.user2 == userAddress && request.status == 0
  );

  return res.send({ matchRequests });
});

app.listen(5050, () => {
  console.log("listening on port 5050");
});
