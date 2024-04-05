import { FormData } from "@/components/onboarding";

import {
  TypeOfDating,
  Ethnicity,
  GTD,
  ATD,
  Education,
  SPORTS,
  RELATIONSHIP,
  RELIGIOUS_STATUS,
  DIETARY,
  PREFERENCES,
  USER_DATA
} from "../components/types";

export const mapFormDataToPreferences = (formData: FormData): PREFERENCES => {
  const {
    gtd,
    education,
    tod,
    atd,
    ethnicityChoice,
    Sports,
    Movies,
    Cooking,
    Fitness,
    Travelling,
    art,
    PetLover,
    Alcoholic,
    Smoking,
    Spiritual,
    Relationship,
    Dietary,
  } = formData;

  return {
    TYPE_OF_DATING:
      TypeOfDating[tod.toUpperCase() as keyof typeof TypeOfDating],
    ATD: ATD[atd.toUpperCase() as keyof typeof ATD],
    GTD: GTD[gtd.toUpperCase() as keyof typeof GTD],
    EDUCATION: Education[education.toUpperCase() as keyof typeof Education],
    ETHNICITY:
      Ethnicity[ethnicityChoice.toUpperCase() as keyof typeof Ethnicity],
    SPORTS: SPORTS[Sports.toUpperCase() as keyof typeof SPORTS],
    RELATIONSHIP:
      RELATIONSHIP[Relationship.toUpperCase() as keyof typeof RELATIONSHIP],
    RELIGIOUS_STATUS:
      RELIGIOUS_STATUS[
        Spiritual.toUpperCase() as keyof typeof RELIGIOUS_STATUS
      ],
    DIETARY: DIETARY[Dietary.toUpperCase() as keyof typeof DIETARY],
    MOVIES: Movies === "true" ? 1 : 0,
    COOKING: Cooking === "true" ? 1 : 0,
    FITNESS: Fitness === "true" ? 1 : 0,
    TRAVELLING: Travelling === "true" ? 1 : 0,
    ART: art === "true" ? 1 : 0,
    PET_LOVER: PetLover === "true" ? 1 : 0,
    ALCOHOLIC: Alcoholic === "true" ? 1 : 0,
    SMOKING: Smoking === "true" ? 1 : 0,
  };
};

export const mapFormDataToUserData = (formData: FormData): USER_DATA => {
  const {
    gtd,
    education,
    tod,
    atd,
    ethnicity,
    Sports,
    Movies,
    Cooking,
    Fitness,
    Travelling,
    art,
    PetLover,
    Alcoholic,
    Smoking,
    Spiritual,
    Relationship,
    Dietary,
  } = formData;

  return {
    TYPE_OF_DATING:
      TypeOfDating[tod.toUpperCase() as keyof typeof TypeOfDating],
    ATD: ATD[atd.toUpperCase() as keyof typeof ATD],
    GTD: GTD[gtd.toUpperCase() as keyof typeof GTD],
    EDUCATION: Education[education.toUpperCase() as keyof typeof Education],
    ETHNICITY:
      Ethnicity[ethnicity.toUpperCase() as keyof typeof Ethnicity],
    SPORTS: SPORTS[Sports.toUpperCase() as keyof typeof SPORTS],
    RELATIONSHIP:
      RELATIONSHIP[Relationship.toUpperCase() as keyof typeof RELATIONSHIP],
    RELIGIOUS_STATUS:
      RELIGIOUS_STATUS[
        Spiritual.toUpperCase() as keyof typeof RELIGIOUS_STATUS
      ],
    DIETARY: DIETARY[Dietary.toUpperCase() as keyof typeof DIETARY],
    MOVIES: Movies === "true" ? 1 : 0,
    COOKING: Cooking === "true" ? 1 : 0,
    FITNESS: Fitness === "true" ? 1 : 0,
    TRAVELLING: Travelling === "true" ? 1 : 0,
    ART: art === "true" ? 1 : 0,
    PET_LOVER: PetLover === "true" ? 1 : 0,
    ALCOHOLIC: Alcoholic === "true" ? 1 : 0,
    SMOKING: Smoking === "true" ? 1 : 0,
  };
}