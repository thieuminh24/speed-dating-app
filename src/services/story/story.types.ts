// services/story/story.types.ts

export enum StoryType {
  TEXT = "text",
  VIDEO = "video",
}

export enum TextAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface Story {
  _id: string;
  userId: string | UserInfo;
  type: StoryType;

  // Text story
  text?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  textAlign?: TextAlign;
  textBold?: boolean;
  textItalic?: boolean;
  backgroundColor?: string;

  // Video story
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDuration?: number;

  // Common
  expiresAt: string;
  viewedBy: string[];
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  photos: string[];
}

export interface StoryGroup {
  user: UserInfo;
  stories: Story[];
}

export interface CreateTextStoryDto {
  type: StoryType.TEXT;
  text: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  textAlign?: TextAlign;
  textBold?: boolean;
  textItalic?: boolean;
  backgroundColor?: string;
}

export interface CreateVideoStoryDto {
  type: StoryType.VIDEO;
  videoDuration?: number;
}

export const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
];

export const FONT_PRESETS = [
  "Inter",
  "Roboto",
  "Pacifico",
  "Dancing Script",
  "Bebas Neue",
  "Lobster",
  "Righteous",
  "Caveat",
];
