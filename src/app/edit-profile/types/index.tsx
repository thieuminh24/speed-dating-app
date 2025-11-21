import { PromptsType } from "@/types/user.types";
import {
  Drinking,
  EducationLevel,
  Exercise,
  Kids,
  LookingFor,
  Politics,
  Religion,
  Smoking,
  StarSign,
} from "../enums";

export type BasicProfileType = {
  whereFrom?: string;
  placesLived?: string;
  gender?: string;
  height?: number;
  exercise?: Exercise;
  educationLevel?: EducationLevel;
  drinking?: Drinking;
  smoking?: Smoking;
  lookingFor?: LookingFor;
  kids?: Kids;
  politics?: Politics;
  religion?: Religion;
  starSign?: StarSign;
};

export type LocationType = {
  lat: number;
  lon: number;
};

export type JobsType = {
  title: string;
  company: string;
};

export type EducationType = {
  institution: string;
  graduation: number;
};

export type UpdateUserType = {
  aboutMe?: string;
  dateOfBirth?: Date;
  photos?: string[];
  prompts?: PromptsType[];
  jobsAndEducation?: {
    jobs?: JobsType[];
    education?: EducationType[];
  };
  basic?: BasicProfileType;
  location?: LocationType;
};

export type jobsAndEducationType = {
  jobs: JobsType[];
  education: EducationType[];
};

export type Profile = {
  id: string;
  name: string;
  age: number;
  aboutMe: string;
  dateOfBirth: Date;
  photos: string[];
  prompts: PromptsType[];
  jobsAndEducation: jobsAndEducationType;
  basic: BasicProfileType;
  location: LocationType;
};
