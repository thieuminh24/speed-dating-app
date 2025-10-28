// types/user.ts
export type User = {
  _id: string;
  photos: string[];
  prompts: {
    vibe: string;
    trend: string;
    lowKey: string;
  };
  about: string;
  basics: {
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
  };
  places: {
    live: string;
    from: string;
  };
  likedUsers: string[];
  dislikedUsers: string[];
  matches: string[];
  __v: number;
};
