import { Transitions, STF } from "@stackr/sdk/machine";
import {
  DatingApp,
  MatchRequest,
  MatchStatus,
  DatingAppTransport as StateWrapper,
} from "./state";
import { ZeroAddress } from "ethers";
import { User } from "./state";

// --------- Utilities ---------
const findUser = (state: StateWrapper, address: string) => {
  return state.users.findIndex((user) => user.address === address);
};

const findRequest = (state: StateWrapper, user1: string, user2: string) => {
  return state.matchRequests.findIndex(
    (request) => request.user1 === user1 && request.user2 === user2
  );
};

type CreateAccountInput = {
  address: string;
  preferences: string;
  extras: string;
};

type MatchRequestInput = {
  user1: string;
  user2: string;
  timestamp: number;
};

type GenerateInput = {
  userAddress: string;
};

// --------- State Transition Handlers ---------
const create: STF<DatingApp, CreateAccountInput> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    if (state.users.find((user) => user.address === address)) {
      throw new Error("Account already exists");
    }
    const user: User = {
      address,
      currentMatch: ZeroAddress,
      matches: 0,
      unmatches: 0,
      preferences: JSON.parse(inputs.address),
      extras: JSON.parse(inputs.extras),
      recommendations: [],
    };

    state.users.push(user);
    return state;
  },
};

const request: STF<DatingApp, MatchRequestInput> = {
  handler: ({ inputs, state }) => {
    const { user1, user2 } = inputs;

    // find if the request exists currently for the same match
    const index1 = findRequest(state, user1, user2);
    const index2 = findRequest(state, user2, user1);

    if (index1 != -1 && index2 != -1) {
      throw new Error("Request already exists");
    }

    const matchRequest: MatchRequest = {
      user1,
      user2,
      timestamp: inputs.timestamp,
      status: MatchStatus.REQUESTED,
    };
    state.matchRequests.push(matchRequest);
    return state;
  },
};

const match: STF<DatingApp, MatchRequestInput> = {
  handler: ({ inputs, state, msgSender }) => {
    // address calling this match functin should be the user2 address only
    const { user1, user2 } = inputs;

    const index = findRequest(state, user1, user2);

    if (index == -1) {
      throw new Error("No Request found");
    }
    state.matchRequests[index].status = MatchStatus.MATCHED;
    state.matchRequests[index].timestamp = inputs.timestamp;

    // update the users profile too for currentMatch
    const user1Index = findUser(state, user1);

    if (user1Index == -1) {
      throw new Error("User 1 Not found");
    }
    state.users[user1Index].currentMatch = user2;
    state.users[user1Index].matches += 1;

    const user2Index = findUser(state, user2);

    if (user2Index == -1) {
      throw new Error("User 2 Not found");
    }
    state.users[user2Index].currentMatch = user1;
    state.users[user2Index].matches += 1;

    return state;
  },
};

const unmatch: STF<DatingApp, MatchRequestInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { user1, user2 } = inputs;

    // find if the request exists currently for this match
    const index1 = findRequest(state, user1, user2);
    const index2 = findRequest(state, user2, user1);

    let index: number;

    if (index1 != -1) {
      index = index1;
    } else if (index2 != -1) {
      index = index2;
    } else {
      throw new Error("No Request found");
    }

    state.matchRequests[index].status = MatchStatus.UNMATCHED;
    state.matchRequests[index].timestamp = inputs.timestamp;

    // update the users profile too for currentMatch
    const user1Index = findUser(state, user1);

    if (user1Index == -1) {
      throw new Error("User 1 Not found");
    }
    state.users[user1Index].currentMatch = ZeroAddress;
    state.users[user1Index].unmatches += 1;

    const user2Index = findUser(state, user2);

    if (user2Index == -1) {
      throw new Error("User 2 Not found");
    }
    state.users[user2Index].currentMatch = ZeroAddress;
    state.users[user2Index].unmatches += 1;

    return state;
  },
};

const generate: STF<DatingApp, GenerateInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { userAddress } = inputs;

    const index = findUser(state, userAddress);

    if (index == -1) {
      throw new Error("User not Found");
    }

    const recommendations: string[] = [];

    state.users[index].recommendations = recommendations;
    return state;
  },
};

export const transitions: Transitions<DatingApp> = {
  create: create,
  request: request,
  match: match,
  unmatch: unmatch,
  generateRecommendations: generate,
};
