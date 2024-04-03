import { State } from "@stackr/sdk/machine";
import { BytesLike, ZeroHash, solidityPackedKeccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export type User = {
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

export type MatchRequest = {
  user1: string; // requested By
  user2: string; // requested To
  timestamp: number;
  status: MatchStatus;
};

export type DatingAppState = {
  users: User[];
  matchRequests: MatchRequest[];
};

export class DatingAppTransport {
  public merkleTreeUsers: MerkleTree;
  public users: User[];
  public merkleTreeRequests: MerkleTree;
  public matchRequests: MatchRequest[];

  constructor(users: User[], matchRequests: MatchRequest[]) {
    let { merkleTreeRequests, merkleTreeUsers } = this.createTree(
      users,
      matchRequests
    );
    this.merkleTreeRequests = merkleTreeRequests;
    this.merkleTreeUsers = merkleTreeUsers;
    this.users = users;
    this.matchRequests = matchRequests;
  }

  createTree(users: User[], matchRequests: MatchRequest[]) {
    const hashedLeavesUsers = users.map((user) => {
      // TODO : remaining fields can also be included
      return solidityPackedKeccak256(
        ["address", "address", "uint256", "uint256"],
        [user.address, user.currentMatch, user.matches, user.unmatches]
      );
    });
    const merkleTreeUsers = new MerkleTree(hashedLeavesUsers);

    const hashedLeavesRequests = matchRequests.map((request) => {
      return solidityPackedKeccak256(
        ["address", "address", "uint256", "uint256"],
        [request.user1, request.user2, request.timestamp, request.status]
      );
    });
    const merkleTreeRequests = new MerkleTree(hashedLeavesRequests);

    return {
      merkleTreeUsers,
      merkleTreeRequests,
    };
  }
}

export class DatingApp extends State<DatingAppState, DatingAppTransport> {
  constructor(state: DatingAppState) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        return new DatingAppTransport(
          this.state.users,
          this.state.matchRequests
        );
      },
      unwrap: (wrappedState: DatingAppTransport) => {
        return {
          users: wrappedState.users,
          matchRequests: wrappedState.matchRequests,
        };
      },
    };
  }

  getRootHash(): BytesLike {
    if (this.state.users.length === 0) {
      return ZeroHash;
    }

    // TODO: matchRequests need to be included
    return this.transformer().wrap().merkleTreeUsers.getHexRoot();
  }
}
