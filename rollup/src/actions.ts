import { ActionSchema, SolidityType } from "@stackr/sdk";

// utility function to create a transfer schema
function generateSchemaFromBase(name: string) {
  return new ActionSchema(name, {
    user1: SolidityType.ADDRESS,
    user2: SolidityType.ADDRESS,
    timestamp: SolidityType.UINT,
  });
}

// createAccountSchema is a schema for creating an account
export const createAccountSchema = new ActionSchema("createAccount", {
  address: SolidityType.ADDRESS,
  preferences: SolidityType.STRING,
  extras: SolidityType.STRING,
});

export const generateRecommendationsSchema = new ActionSchema("createAccount", {
  userAddress: SolidityType.ADDRESS,
});

// transferSchema is a collection of all the transfer actions
// that can be performed on the rollup
export const schemas = {
  create: createAccountSchema,
  request: generateSchemaFromBase("requestMatch"),
  match: generateSchemaFromBase("match"),
  unmatch: generateSchemaFromBase("unmatch"),
  generateRecommendations: generateRecommendationsSchema,
};
