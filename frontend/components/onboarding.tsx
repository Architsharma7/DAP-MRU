import React, { useState } from "react";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { createAccount } from "../firebase/index";

interface FormData {
  address: string;
  name: string;
  age: number;
  gtd: string;
  education: string;
  tod: string;
  zodiac: string;
  ethnicity: string;
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
}

const Onboarding: React.FC = () => {
  const userWallets = useUserWallets();
  const [formData, setFormData] = useState<FormData>({
    address: "",
    name: "",
    age: 0,
    gtd: "",
    education: "",
    tod: "",
    zodiac: "",
    ethnicity: "",
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
  });

  const handleChange = async(
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAccount(
      formData.address,
      formData.name,
      formData.age,
      formData.gtd,
      formData.education,
      formData.tod,
      formData.zodiac,
      formData.ethnicity,
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
      formData.Dietary
    );
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <option value="female">male</option>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Onboarding;
