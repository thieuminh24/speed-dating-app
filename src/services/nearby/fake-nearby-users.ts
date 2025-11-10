// src/services/nearby/fake-nearby-users.ts
export interface NearbyUser {
  _id: string;
  name: string;
  age: number;
  photos: string[];
  basic: {
    whereFrom: string;
    placesLived: string;
    height: number;
    exercise: string;
    educationLevel: string;
    drinking: string;
    smoking: string;
    lookingFor: string;
    kids: string;
    politics: string;
    religion: string;
  };
  prompts: { prompt: string; answer: string }[];
  location: { lat: number; lon: number };
  distance: number;
}

const fakeUsers: NearbyUser[] = [
  {
    _id: "1",
    name: "Lan",
    age: 24,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
    basic: {
      whereFrom: "Hà Nội",
      placesLived: "Hà Nội, Sài Gòn",
      height: 165,
      exercise: "Sometimes",
      educationLevel: "University",
      drinking: "Socially",
      smoking: "Never",
      lookingFor: "Relationship",
      kids: "Want Some Day",
      politics: "Moderate",
      religion: "None",
    },
    prompts: [
      {
        prompt: "I'll know we vibe on a date if",
        answer: "we laugh at the same memes",
      },
    ],
    location: { lat: 21.0285 + 0.005, lon: 105.8542 + 0.005 },
    distance: 1.2,
  },
  {
    _id: "2",
    name: "Minh",
    age: 26,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
    ],
    basic: {
      whereFrom: "Đà Nẵng",
      placesLived: "Đà Nẵng, Hà Nội",
      height: 175,
      exercise: "Often",
      educationLevel: "Master's",
      drinking: "Never",
      smoking: "Never",
      lookingFor: "Long-term",
      kids: "Don't Want",
      politics: "Liberal",
      religion: "Buddhist",
    },
    prompts: [
      {
        prompt: "The most spontaneous thing I've done",
        answer: "quit my job to travel",
      },
    ],
    location: { lat: 21.0285 - 0.008, lon: 105.8542 + 0.01 },
    distance: 2.8,
  },
  {
    _id: "3",
    name: "Hương",
    age: 22,
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      "https://images.unsplash.com/photo-1580489940927-3c3c5d5a7d7a?w=400",
    ],
    basic: {
      whereFrom: "Hải Phòng",
      placesLived: "Hải Phòng",
      height: 160,
      exercise: "Never",
      educationLevel: "High School",
      drinking: "Often",
      smoking: "Socially",
      lookingFor: "Fun",
      kids: "Want Some Day",
      politics: "Conservative",
      religion: "Catholic",
    },
    prompts: [
      {
        prompt: "My biggest irrational fear",
        answer: "being stuck in an elevator",
      },
    ],
    location: { lat: 21.0285 + 0.012, lon: 105.8542 - 0.007 },
    distance: 3.5,
  },
  {
    _id: "4",
    name: "Tuấn",
    age: 28,
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
    ],
    basic: {
      whereFrom: "Huế",
      placesLived: "Huế, Sài Gòn",
      height: 178,
      exercise: "Often",
      educationLevel: "PhD",
      drinking: "Socially",
      smoking: "Never",
      lookingFor: "Marriage",
      kids: "Want Soon",
      politics: "Moderate",
      religion: "None",
    },
    prompts: [
      {
        prompt: "I'll know we vibe on a date if",
        answer: "we order the same weird food",
      },
    ],
    location: { lat: 21.0285 - 0.01, lon: 105.8542 - 0.015 },
    distance: 4.1,
  },
];

export const getFakeNearbyUsers = async (): Promise<NearbyUser[]> => {
  // Giả lập delay API
  await new Promise((resolve) => setTimeout(resolve, 800));
  return fakeUsers;
};

export const fakeSwipeUser = async (userId: string, isLike: boolean) => {
  console.log(`[FAKE] Swiped ${isLike ? "LIKE" : "PASS"} on user ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
};
