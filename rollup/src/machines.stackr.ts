import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../genesis-state.json";
import { transitions } from "./transitions";
import { DatingApp } from "./state";

const STATE_MACHINES = {
  DatingApp: "dating-app",
};

const datingStateMachine = new StateMachine({
  id: STATE_MACHINES.DatingApp,
  stateClass: DatingApp,
  initialState: genesisState.state,
  on: transitions,
});

export { STATE_MACHINES, datingStateMachine };
