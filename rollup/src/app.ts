import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { createAccountSchema, schemas } from "./actions.ts";
import { datingStateMachine } from "./machines.stackr.ts";

type DatingMachine = typeof datingStateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [createAccountSchema, ...Object.values(schemas)],
  isSandbox: true,
  stateMachines: [datingStateMachine],
});

await mru.init();

export { DatingMachine, mru };
