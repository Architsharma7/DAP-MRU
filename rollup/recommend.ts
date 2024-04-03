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
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
  ];

  let prefMatches: number = 0;

  const userData = extras;

  userData.forEach((value, i) => {
    if (i == 2) {
      // compare the Gender
      if (preferences[i] == 1 && value == 0) {
        prefMatches += 1;
      } else if (preferences[i] == 0 && value == 1) {
        prefMatches += 1;
      } else if (preferences[i] == 2) {
        prefMatches += 1;
      }
    }
    if (i != 2 && value === preferences[i]) {
      prefMatches += 1;
    }
  });

  console.log(prefMatches);
  if (prefMatches >= 8) {
    console.log("Address detected");
  }
}

main();
