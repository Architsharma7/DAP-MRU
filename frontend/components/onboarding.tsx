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

export interface FormData {
  address: string;
  name: string;
  age: number;
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

  // const onDrop = useCallback((acceptedFiles: File[]) => {
  //   if (acceptedFiles.length > 0) {
  //     const selectedImage = acceptedFiles[0];
  //     console.log(selectedImage);
  //     setFormData({ ...formData, rawImage: selectedImage });
  //   }
  // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="text-black"
        />
      </label>
      <br />
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="text-black"
        />
      </label>
      <br />
      <label>
        Gender to Date:
        <select
          name="gtd"
          value={formData.gtd}
          onChange={handleChange}
          className="text-black"
        >
          <option value="" className="text-black">
            Select
          </option>
          <option value="MALE">male</option>
          <option value="FEMALE">female</option>
          <option value="BOTH">both</option>
        </select>
      </label>
      <br />
      <label>
        Education:
        <select
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="text-black"
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
      <br />
      <label>
        Type of Dating:
        <select
          name="tod"
          value={formData.tod}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="CASUAL">Casual</option>
          <option value="SERIOUS">Serious</option>
        </select>
      </label>
      <br />

      <label>
        Age to Date:
        <select
          name="atd"
          value={formData.atd}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="18_">{" < 18"}</option>
          <option value="18_21">18-21</option>
          <option value="21_25">21-25</option>
          <option value="25_30">25-30</option>
          <option value="30_">30+</option>
        </select>
      </label>
      <br />
      <label>
        Zodiac Sign:
        <select
          name="zodiac"
          value={formData.zodiac}
          onChange={handleChange}
          className="text-black"
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
      <br />
      <label>
        Ethnicity:
        <select
          name="ethnicity"
          value={formData.ethnicity}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="WHITE">White</option>
          <option value="MIXED">Mixed</option>
          <option value="ASIAN">Asian</option>
          <option value="BLACK">Black</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <br />
      <label>
        Ethnicity Choice:
        <select
          name="ethnicityChoice"
          value={formData.ethnicityChoice}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="WHITE">White</option>
          <option value="MIXED">Mixed</option>
          <option value="ASIAN">Asian</option>
          <option value="BLACK">Black</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <br />
      <label>
        Sports Interest:
        <select
          name="Sports"
          value={formData.Sports}
          onChange={handleChange}
          className="text-black"
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
      <br />
      <label>
        Movie Preference:
        <select
          name="Movies"
          value={formData.Movies}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Cooking Interest:
        <select
          name="Cooking"
          value={formData.Cooking}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Fitness Interest:
        <select
          name="Fitness"
          value={formData.Fitness}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Travelling Interest:
        <select
          name="Travelling"
          value={formData.Travelling}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Art and Craft:
        <select
          name="art"
          value={formData.art}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Coffee or Tea:
        <select
          name="CoffeeorTea"
          value={formData.CoffeeorTea}
          onChange={handleChange}
          className="text-black"
        >
          <option value="" className="text-black">
            Select
          </option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
        </select>
      </label>
      <br />
      <label>
        Pet Lover:
        <select
          name="PetLover"
          value={formData.PetLover}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Personality Type:
        <select
          name="Personality"
          value={formData.Personality}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="introvert">Introvert</option>
          <option value="extrovert">Extrovert</option>
        </select>
      </label>
      <br />
      <label>
        Alcohol Consumption:
        <select
          name="Alcoholic"
          value={formData.Alcoholic}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Smoking Preference:
        <select
          name="Smoking"
          value={formData.Smoking}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <br />
      <label>
        Spiritual Inclination:
        <select
          name="Spiritual"
          value={formData.Spiritual}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="SPIRITUAL">Spiritual</option>
          <option value="AETHIST">Atheist</option>
          <option value="NONE">None</option>
        </select>
      </label>
      <br />
      <label>
        Relationship Status:
        <select
          name="Relationship"
          value={formData.Relationship}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="SINGLE">Single</option>
          <option value="DIVORCED">Divorced</option>
          <option value="MARRIED">Married</option>
        </select>
      </label>
      <br />
      <label>
        Dietary Preference:
        <select
          name="Dietary"
          value={formData.Dietary}
          onChange={handleChange}
          className="text-black"
        >
          <option value="">Select</option>
          <option value="VEGETARIAN">Vegetarian</option>
          <option value="NON_VEGERTARIAN">Non-Vegetarian</option>
          <option value="VEGAN">Vegan</option>
        </select>
      </label>
      <br />
      <label>
        Set Image
        {/* <div className="px-20 py-10 text-center flex">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <button className="cursor-pointer bg-white px-10 py-4 rounded-xl text-black">
              click to select files
            </button>
            {formData.rawImage && <p>{formData.rawImage?.name}</p>}
          </div>
        </div> */}
        <div className="px-20 py-10 text-center flex">
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
                  <p className="cursor-pointer bg-white px-10 py-4 rounded-xl text-black">
                    click to select files
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Onboarding;
