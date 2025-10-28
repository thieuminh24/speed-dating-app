import {
  Ruler,
  Dumbbell,
  GraduationCap,
  Wine,
  Cigarette,
  Search,
  Baby,
  Star,
  Building,
  HandHeart,
  Venus,
  MapPin,
  Flag,
} from "lucide-react";
import { BasicProfileField } from "../enums";

export const fieldConfigs: {
  key: BasicProfileField;
  label: string;
  icon: React.ElementType;
  question?: string;
}[] = [
  {
    key: BasicProfileField.HEIGHT,
    label: "Height",
    icon: Ruler,
    question: "What is your height?",
  },
  {
    key: BasicProfileField.EXERCISE,
    label: "Exercise",
    icon: Dumbbell,
    question: "How often do you exercise?",
  },
  {
    key: BasicProfileField.EDUCATION_LEVEL,
    label: "Education",
    icon: GraduationCap,
    question: "What’s your education level?",
  },
  {
    key: BasicProfileField.DRINKING,
    label: "Drinking",
    icon: Wine,
    question: "Do you drink alcohol?",
  },
  {
    key: BasicProfileField.SMOKING,
    label: "Smoking",
    icon: Cigarette,
    question: "Do you smoke?",
  },
  {
    key: BasicProfileField.LOOKING_FOR,
    label: "Looking for",
    icon: Search,
    question: "What are you looking for on this app?",
  },
  {
    key: BasicProfileField.KIDS,
    label: "Kids",
    icon: Baby,
    question: "Do you have or want kids?",
  },
  {
    key: BasicProfileField.STAR_SIGN,
    label: "Star sign",
    icon: Star,
    question: "What’s your star sign?",
  },
  {
    key: BasicProfileField.POLITICS,
    label: "Politics",
    icon: Building,
    question: "How do you view politics?",
  },
  {
    key: BasicProfileField.RELIGION,
    label: "Religion",
    icon: HandHeart,
    question: "What’s your religion or belief?",
  },
  {
    key: BasicProfileField.GENDER,
    label: "Gender",
    icon: Venus,
    question: "What’s your gender?",
  },
  {
    key: BasicProfileField.PLACES_LIVED,
    label: "Places lived",
    icon: MapPin,
    question: "Where have you lived?",
  },
  {
    key: BasicProfileField.WHERE_FROM,
    label: "Where from",
    icon: Flag,
    question: "Where are you from originally?",
  },
];
