// types/user.ts

export type PromptsType = {
  prompt: string;
  answer: string;
};
export type User = {
  _id: string;
  name?: string;
  age?: string;
  photos: string[];
  aboutMe?: string;
  prompts: PromptsType[];
  about: string;
  basic: {
    height: string | null;
    exercise: string | null;
    education: string | null;
    drinking: string | null;
    smoking: string | null;
    lookingFor: string | null;
    kids: string | null;
    starSign: string | null;
    politics: string | null;
    religion: string | null;
    gender: string | null;
    placesLived: string | null;
  };
  places: {
    live: string;
    from: string;
  };
  likedUsers: string[];
  dislikedUsers: string[];
  matches: string[];
  location: { lat: number; lon: number };
  __v: number;
};
