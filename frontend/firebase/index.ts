import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const createAccount = async (
  address: string,
  name: string,
  age: number,
  gtd: string,
  education: string,
  tod: string,
  zodiac: string,
  ethnicity: string,
  Sports: number,
  Movies: number,
  Cooking: number,
  Fitness: number,
  Travelling: number,
  CoffeeorTea: string,
  PetLover: number,
  Personality: string,
  Alcoholic: string,
  Smoking: string,
  Spiritual: string,
  Relationship: string,
  Dietary: string
) => {
  const docData = {
    name: name,
    age: age,
    gtd: gtd,
    education: education,
    tod: tod,
    zodiac: zodiac,
    ethnicity: ethnicity,
    preferences: {
      Sports: Sports,
      Movies: Movies,
      Cooking: Cooking,
      Fitness: Fitness,
      Travelling: Travelling,
      CoffeeorTea: CoffeeorTea,
      PetLover: PetLover,
      Personality: Personality,
      Alcoholic: Alcoholic,
      Smoking: Smoking,
      Spiritual: Spiritual,
      Relationship: Relationship,
      Dietary: Dietary,
    },
  };
  await setDoc(doc(db, "userData", address), docData);
  console.log("Document written with ID: ", address);
};

export const getAddress = async (address: string) => {
  const docRef = await doc(db, "userData", address);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return true;
  } else {
    return false;
  }
};
