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

async function main() {
  const preferences = [
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
  ];

  const extras = [
    TypeOfDating.CASUAL,
    ATD["18_21"],
    GTD.MALE,
    Education.UNDER_GRADUATE,
    Ethnicity.ASIAN,
    SPORTS.FOOTBALL,
    RELATIONSHIP.SINGLE,
    RELIGIOUS_STATUS.SPIRITUAL,
    DIETARY.VEGETARIAN,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
  ];

  let prefMatches: number = 0;
  let strictMatches: number = 0;

  const userData = extras;

  userData.forEach((value, i) => {
    // Strict Matches needed
    if (
      (i == 0 && value === preferences[i]) ||
      (i == 1 && value === preferences[i]) ||
      (i == 4 && value === preferences[i])
    ) {
      strictMatches += 1;
    }

    // compare the Gender
    if (i == 2) {
      if (preferences[i] == 1 && value == 0) {
        strictMatches += 1;
      } else if (preferences[i] == 0 && value == 1) {
        strictMatches += 1;
      } else if (preferences[i] == 2) {
        strictMatches += 1;
      }
    }

    if (i >= 5 || i == 3) {
      if (value === preferences[i]) {
        prefMatches += 1;
      }
    }
  });

  console.log("Pref Matches", prefMatches);
  console.log("Strict Matches", strictMatches);
  if (prefMatches >= 5 && strictMatches == 4) {
    console.log("Recommended Address detected");
  }
}

main();
