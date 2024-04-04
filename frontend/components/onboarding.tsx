import React, { useState, useRef, useCallback } from "react";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { createAccount } from "../firebase/index";
import { useRouter } from "next/router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone";

interface FormData {
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
  Sports: number;
  Movies: number;
  Cooking: number;
  Fitness: number;
  Travelling: number;
  CoffeeorTea: string;
  PetLover: number;
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
    Sports: 0,
    Movies: 0,
    Cooking: 0,
    Fitness: 0,
    Travelling: 0,
    CoffeeorTea: "",
    PetLover: 0,
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0];
      console.log(selectedImage);
      setFormData({ ...formData, rawImage: selectedImage });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    // await router.push("/recommendations");
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
          <option value="High School">High School</option>
          <option value="College">College</option>
          <option value="University">University</option>
        </select>
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
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
      </label>
      <br />
      <label>
        Sports Interest:
        <input
          type="range"
          name="Sports"
          min={0}
          max={10}
          value={formData.Sports}
          onChange={handleChange}
        />
        {formData.Sports}
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
        Set Image
        <div className="px-20 py-10 text-center flex">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <button className="cursor-pointer bg-white px-10 py-4 rounded-xl text-black">
              click to select files
            </button>
            {formData.rawImage && <p>{formData.rawImage?.name}</p>}
          </div>
        </div>
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Onboarding;
