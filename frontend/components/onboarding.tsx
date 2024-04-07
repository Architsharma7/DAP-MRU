import React, { useState, useRef, useCallback } from "react";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { createAccount } from "../firebase/index";
import { useRouter } from "next/router";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  list,
} from "firebase/storage";
import Dropzone, { useDropzone } from "react-dropzone";
import { RegisterInputType, registerUser } from "@/utils/rollupMethods";
import {
  mapFormDataToPreferences,
  mapFormDataToUserData,
} from "@/utils/frontendToRollupMethods";
import dynamic from "next/dynamic";

export interface FormData {
  address: string;
  name: string;
  age: number;
  gender: string;
  gtd: string;
  education: string;
  tod: string;
  atd: string;
  zodiac: string;
  ethnicity: string;
  ethnicityChoice: string;
  Sports: string;
  Movies: string;
  Cooking: string;
  Fitness: string;
  Travelling: string;
  art: string;
  CoffeeorTea: string;
  PetLover: string;
  Personality: string;
  Alcoholic: string;
  Smoking: string;
  Spiritual: string;
  Relationship: string;
  Dietary: string;
  image: string;
  rawImage: any;
}

const Onboarding: React.FC = () => {
  const router = useRouter();
  const userWallets = useUserWallets();
  const [formData, setFormData] = useState<FormData>({
    address: "",
    name: "",
    age: 0,
    gender: "",
    gtd: "",
    education: "",
    tod: "",
    atd: "",
    zodiac: "",
    ethnicity: "",
    ethnicityChoice: "",
    Sports: "",
    Movies: "",
    Cooking: "",
    Fitness: "",
    Travelling: "",
    art: "",
    CoffeeorTea: "",
    PetLover: "",
    Personality: "",
    Alcoholic: "",
    Smoking: "",
    Spiritual: "",
    Relationship: "",
    Dietary: "",
    image: "",
    rawImage: null,
  });

  const uploadImage = async (file: any) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${file?.name}`);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log(snapshot);
    });
    console.log(storageRef);
    const downloadURL = await getDownloadURL(
      ref(storage, `files/${file?.name}`)
    );
    console.log("downloadurl", downloadURL);
    return downloadURL;
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: userWallets[0].address,
      [name]: type === "checkbox" ? !prevData[name as keyof FormData] : value,
    }));
  };

  const userData: RegisterInputType = {
    address: formData.address,
    preferences: [
      mapFormDataToPreferences(formData).TYPE_OF_DATING,
      mapFormDataToPreferences(formData).ATD,
      mapFormDataToPreferences(formData).GTD,
      mapFormDataToPreferences(formData).EDUCATION,
      mapFormDataToPreferences(formData).ETHNICITY,
      mapFormDataToPreferences(formData).SPORTS,
      mapFormDataToPreferences(formData).RELATIONSHIP,
      mapFormDataToPreferences(formData).RELIGIOUS_STATUS,
      mapFormDataToPreferences(formData).DIETARY,
      mapFormDataToPreferences(formData).MOVIES,
      mapFormDataToPreferences(formData).COOKING,
      mapFormDataToPreferences(formData).FITNESS,
      mapFormDataToPreferences(formData).TRAVELLING,
      mapFormDataToPreferences(formData).ART,
      mapFormDataToPreferences(formData).PET_LOVER,
      mapFormDataToPreferences(formData).ALCOHOLIC,
      mapFormDataToPreferences(formData).SMOKING,
    ],
    extras: [
      mapFormDataToUserData(formData).TYPE_OF_DATING,
      mapFormDataToUserData(formData).ATD,
      mapFormDataToUserData(formData).GTD,
      mapFormDataToUserData(formData).EDUCATION,
      mapFormDataToUserData(formData).ETHNICITY,
      mapFormDataToUserData(formData).SPORTS,
      mapFormDataToUserData(formData).RELATIONSHIP,
      mapFormDataToUserData(formData).RELIGIOUS_STATUS,
      mapFormDataToUserData(formData).DIETARY,
      mapFormDataToUserData(formData).MOVIES,
      mapFormDataToUserData(formData).COOKING,
      mapFormDataToUserData(formData).FITNESS,
      mapFormDataToUserData(formData).TRAVELLING,
      mapFormDataToUserData(formData).ART,
      mapFormDataToUserData(formData).PET_LOVER,
      mapFormDataToUserData(formData).ALCOHOLIC,
      mapFormDataToUserData(formData).SMOKING,
    ],
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageURL = await uploadImage(formData.rawImage);
    console.log("image uploaded");
    await createAccount(
      formData.address,
      formData.name,
      formData.age,
      formData.gender,
      formData.gtd,
      formData.education,
      formData.tod,
      formData.atd,
      formData.zodiac,
      formData.ethnicity,
      formData.ethnicityChoice,
      formData.Sports,
      formData.Movies,
      formData.Cooking,
      formData.Fitness,
      formData.Travelling,
      formData.art,
      formData.CoffeeorTea,
      formData.PetLover,
      formData.Personality,
      formData.Alcoholic,
      formData.Smoking,
      formData.Spiritual,
      formData.Relationship,
      formData.Dietary,
      imageURL
    );
    console.log("data uploaded to db");
    console.log(formData);
    console.log(userData);
    await registerUser(userData);
    await router.push("/recommendations");
  };

  return (
    <div className="w-screen">
      <div className="mx-20 flex flex-col justify-center">
        <div>
          <p className="text-3xl font-bold text-black text-center mx-auto mt-10">
            Onboarding
          </p>
        </div>
        <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-flow-rows grid-rows-6 grid-cols-4 gap-x-20 gap-y-10 my-auto mx-auto">
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Name</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              />
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Age</p>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              />
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Gender</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="" className="text-black">
                  Select
                </option>
                <option value="MALE">male</option>
                <option value="FEMALE">female</option>
                <option value="BOTH">bi-sexual</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Gender to Date</p>
              <select
                name="gtd"
                value={formData.gtd}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="" className="text-black">
                  Select
                </option>
                <option value="MALE">male</option>
                <option value="FEMALE">female</option>
                <option value="BOTH">both</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Education</p>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="" className="text-black">
                  Select
                </option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="UNDER_GRADUATE">College</option>
                <option value="POST_GRADUATE">University</option>
                <option value="PHD_GRADUATE">PHD</option>
                <option value="NONE">none of the above</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Type of Dating</p>
              <select
                name="tod"
                value={formData.tod}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="CASUAL">Casual</option>
                <option value="SERIOUS">Serious</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Age to Date</p>
              <select
                name="atd"
                value={formData.atd}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="18_">{" < 18"}</option>
                <option value="18_21">18-21</option>
                <option value="21_25">21-25</option>
                <option value="25_30">25-30</option>
                <option value="30_">30+</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Zodiac Sign</p>
              <select
                name="zodiac"
                value={formData.zodiac}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="ARIES">Aries</option>
                <option value="TAURUS">Taurus</option>
                <option value="GEMINI">Gemini</option>
                <option value="CANCER">Cancer</option>
                <option value="LEO">Leo</option>
                <option value="VIRGO">Virgo</option>
                <option value="LIBRA">Libra</option>
                <option value="SCORPIO">Scorpio</option>
                <option value="SAGITTARIUS">Sagittarius</option>
                <option value="CAPRICORN">Capricorn</option>
                <option value="AQUARIUS">Aquarius</option>
                <option value="PISCES">Pisces</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Ethnicity</p>
              <select
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="WHITE">White</option>
                <option value="MIXED">Mixed</option>
                <option value="ASIAN">Asian</option>
                <option value="BLACK">Black</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Ethnicity Choice
              </p>
              <select
                name="ethnicityChoice"
                value={formData.ethnicityChoice}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="WHITE">White</option>
                <option value="MIXED">Mixed</option>
                <option value="ASIAN">Asian</option>
                <option value="BLACK">Black</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Sports Interest
              </p>
              <select
                name="Sports"
                value={formData.Sports}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="CRICKET">Cricket</option>
                <option value="FOOTBALL">Football</option>
                <option value="TENNIS">Tennis</option>
                <option value="BASKETBALL">Basketball</option>
                <option value="GOLF">Golf</option>
                <option value="BADMINTON">Badminton</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Movie Preference
              </p>
              <select
                name="Movies"
                value={formData.Movies}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Cooking Interest
              </p>
              <select
                name="Cooking"
                value={formData.Cooking}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Fitness Interest
              </p>
              <select
                name="Fitness"
                value={formData.Fitness}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Travelling Interest
              </p>
              <select
                name="Travelling"
                value={formData.Travelling}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">Art and Craft</p>
              <select
                name="art"
                value={formData.art}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Coffee or Tea Preference
              </p>
              <select
                name="CoffeeorTea"
                value={formData.CoffeeorTea}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="" className="text-black">
                  Select
                </option>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black"> Pet Lover</p>
              <select
                name="PetLover"
                value={formData.PetLover}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Personality Type
              </p>
              <select
                name="Personality"
                value={formData.Personality}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="introvert">Introvert</option>
                <option value="extrovert">Extrovert</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Alcohol Consumption
              </p>
              <select
                name="Alcoholic"
                value={formData.Alcoholic}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Smoking Preference
              </p>
              <select
                name="Smoking"
                value={formData.Smoking}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Spiritual Inclination
              </p>
              <select
                name="Spiritual"
                value={formData.Spiritual}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="SPIRITUAL">Spiritual</option>
                <option value="AETHIST">Atheist</option>
                <option value="NONE">None</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Relationship Status
              </p>
              <select
                name="Relationship"
                value={formData.Relationship}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="SINGLE">Single</option>
                <option value="DIVORCED">Divorced</option>
                <option value="MARRIED">Married</option>
              </select>
            </label>
            <label className="flex flex-col">
              <p className="font-semibold text-lg text-black">
                Dietary Preference
              </p>
              <select
                name="Dietary"
                value={formData.Dietary}
                onChange={handleChange}
                className="text-black mt-2 text-md px-4 py-1 rounded-lg border border-gray-400 shadow-md"
              >
                <option value="">Select</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="NON_VEGERTARIAN">Non-Vegetarian</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </label>
          </div>
          <br />
          <div className="mx-auto flex justify-center mt-10">
            <label className="text-black flex flex-col justify-center mx-auto">
              <p className="font-semibold text-xl text-center">
                Image for your Profile
              </p>
              <div className="mt-10 border-4 border-dotted border-gray-400 rounded-xl">
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    if (acceptedFiles.length > 0) {
                      const selectedImage = acceptedFiles[0];
                      console.log(selectedImage);
                      setFormData({ ...formData, rawImage: selectedImage });
                    }
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="cursor-pointer bg-white px-80 text-center py-40 rounded-xl text-black text-lg">
                          click to select picture
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </label>
          </div>
          <br />
          <div className="flex justify-center mx-auto mt-10 mb-10">
            <button className="text-center text-blue-500 border-blue-500 px-16 font-semibold text-lg py-3 border rounded-xl hover:bg-blue-500 hover:text-white hover:scale-105 duration-150" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Onboarding), { ssr: false });
