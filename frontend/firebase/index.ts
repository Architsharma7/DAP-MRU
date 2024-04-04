import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { app, db } from "./config";

export const createAccount = async (
  address: string,
  name: string,
  age: number,
  gtd: string,
  education: string,
  tod: string,
  atd: string,
  zodiac: string,
  ethnicity: string,
  ethnicityChoice: string,
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
  Dietary: string,
  image: string
) => {
  const docData = {
    name: name,
    age: age,
    gtd: gtd,
    education: education,
    tod: tod,
    atd: atd,
    zodiac: zodiac,
    ethnicity: ethnicity,
    ethnicityChoice: ethnicityChoice,
    image: image,
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

  try {
    const db = getFirestore();
    console.log(address);
    const docRef = doc(db, "userData", `${address}`);
    await setDoc(docRef, docData);
    console.log("Document written with ID: ", address);
  } catch (error) {
    console.log(error);
  }
};

export const getAddress = async (address: string) => {
  const docRef = doc(db, "userData", address);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return true;
  } else {
    return false;
  }
};
