enum TypeOfDating {
  CASUAL,
  SERIOUS,
}

enum Ethnicity {
  WHITE,
  MIXED,
  ASIAN,
  BLACK,
  OTHER,
}

enum GTD {
  MALE,
  FEMALE,
  BOTH,
}

enum ATD {
  "18_",
  "18_21",
  "21_25",
  "25_30",
  "_30",
}

enum Education {
  HIGH_SCHOOL,
  UNDER_GRADUATE, // Bachelor
  POST_GRADUATE, // Master
  PHD_GRADUATE, // Doctoral
  NONE,
}

enum ZODIAC {
  ARIES,
  TAURUS,
  GEMINI,
  CANCER,
  LEO,
  VIRGO,
  LIBRA,
  SCORPIO,
  SAGITTARIUS,
  CAPRICORN,
  AQUARIS,
  PISCES,
}

enum SPORTS {
  CRICKET,
  FOOTBALL,
  TENNIS,
  BASKETBALL,
  GOLF,
  BADMINTON,
}

enum RELATIONSHIP {
  SINGLE,
  MARRIED,
  DIVORCED,
}

enum RELIGIOUS_STATUS {
  SPIRITUAL,
  AETHIST,
  NONE,
}

enum DIETARY {
  VEGAN,
  VEGETARIAN,
  NON_VEGERTARIAN,
}

export {
  TypeOfDating,
  Ethnicity,
  GTD,
  ATD,
  Education,
  ZODIAC,
  SPORTS,
  RELATIONSHIP,
  RELIGIOUS_STATUS,
  DIETARY,
};

// The User choices or preferences for all of these categories
export type PREFERENCES = {
  TYPE_OF_DATING: TypeOfDating;
  ATD: ATD;
  GTD: GTD;
  EDUCATION: Education;
  ETHNICITY: Ethnicity;
  SPORTS: SPORTS;
  RELATIONSHIP: RELATIONSHIP;
  RELIGIOUS_STATUS: RELIGIOUS_STATUS;
  DIETARY: DIETARY;
  MOVIES: 0 | 1; // 0 or 1
  COOKING: 0 | 1; // 0 or 1
  FITNESS: 0 | 1; // 0 or 1
  TRAVELLING: 0 | 1; // 0 or 1
  ART: 0 | 1; // 0 or 1
  PET_LOVER: 0 | 1; // 0 or 1
  ALCOHOLIC: 0 | 1; // 0 or 1
  SMOKING: 0 | 1; // 0 or 1
};

// User's itself data , which is to used to compare them with other choices
export type USER_DATA = {
  TYPE_OF_DATING: TypeOfDating;
  ATD: ATD;
  GTD: GTD;
  EDUCATION: Education;
  ETHNICITY: Ethnicity;
  SPORTS: SPORTS;
  RELATIONSHIP: RELATIONSHIP;
  RELIGIOUS_STATUS: RELIGIOUS_STATUS;
  DIETARY: DIETARY;
  MOVIES: 0 | 1; // 0 or 1
  COOKING: 0 | 1; // 0 or 1
  FITNESS: 0 | 1; // 0 or 1
  TRAVELLING: 0 | 1; // 0 or 1
  ART: 0 | 1; // 0 or 1
  PET_LOVER: 0 | 1; // 0 or 1
  ALCOHOLIC: 0 | 1; // 0 or 1
  SMOKING: 0 | 1; // 0 or 1
};

const preferences: PREFERENCES = {
  TYPE_OF_DATING: TypeOfDating.CASUAL,
  ATD: ATD["18_21"],
  GTD: GTD.FEMALE,
  EDUCATION: Education.UNDER_GRADUATE,
  ETHNICITY: Ethnicity.ASIAN,
  SPORTS: SPORTS.CRICKET,
  RELATIONSHIP: RELATIONSHIP.SINGLE,
  RELIGIOUS_STATUS: RELIGIOUS_STATUS.NONE,
  DIETARY: DIETARY.VEGETARIAN,
  MOVIES: 1,
  COOKING: 1,
  FITNESS: 1,
  TRAVELLING: 1,
  ART: 0,
  PET_LOVER: 0,
  ALCOHOLIC: 0,
  SMOKING: 0,
};

const userData: USER_DATA = {
  TYPE_OF_DATING: TypeOfDating.CASUAL,
  ATD: ATD["18_21"],
  GTD: GTD.MALE,
  EDUCATION: Education.UNDER_GRADUATE,
  ETHNICITY: Ethnicity.ASIAN,
  SPORTS: SPORTS.CRICKET,
  RELATIONSHIP: RELATIONSHIP.SINGLE,
  RELIGIOUS_STATUS: RELIGIOUS_STATUS.NONE,
  DIETARY: DIETARY.VEGETARIAN,
  MOVIES: 1,
  COOKING: 1,
  FITNESS: 1,
  TRAVELLING: 1,
  ART: 0,
  PET_LOVER: 0,
  ALCOHOLIC: 0,
  SMOKING: 0,
};
