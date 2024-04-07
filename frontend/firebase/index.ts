import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { app, db } from "./config";

export const createAccount = async (
  address: string,
  name: string,
  age: number,
  gender: string,
  gtd: string,
  education: string,
  tod: string,
  atd: string,
  zodiac: string,
  ethnicity: string,
  ethnicityChoice: string,
  Sports: string,
  Movies: string,
  Cooking: string,
  Fitness: string,
  Travelling: string,
  art: string,
  CoffeeorTea: string,
  PetLover: string,
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
    address: address,
    age: age,
    gender: gender,
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
      art: art,
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
  try {
    const docRef = doc(db, "userData", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (address: string) => {
  const docRef = doc(db, "userData", address);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
