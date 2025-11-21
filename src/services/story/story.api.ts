// services/story/story.api.ts
import userService from "../config";
import type {
  Story,
  StoryGroup,
  CreateTextStoryDto,
  CreateVideoStoryDto,
} from "./story.types";

export const createTextStory = async (
  dto: CreateTextStoryDto,
): Promise<Story> => {
  const { data } = await userService.post("/stories/text", dto);
  return data;
};

export const createVideoStory = async (
  dto: CreateVideoStoryDto,
  videoFile: File,
): Promise<Story> => {
  const formData = new FormData();
  formData.append("type", dto.type);
  if (dto.videoDuration) {
    formData.append("videoDuration", dto.videoDuration.toString());
  }
  formData.append("video", videoFile);

  const { data } = await userService.post("/stories/video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getMyStories = async (): Promise<Story[]> => {
  const { data } = await userService.get("/stories/my-stories");
  return data;
};

export const getStoryFeed = async (): Promise<StoryGroup[]> => {
  const { data } = await userService.get("/stories/feed");
  return data;
};

export const getStory = async (storyId: string): Promise<Story> => {
  const { data } = await userService.get(`/stories/${storyId}`);
  return data;
};

export const viewStory = async (storyId: string): Promise<void> => {
  await userService.post(`/stories/${storyId}/view`);
};

export const deleteStory = async (storyId: string): Promise<void> => {
  await userService.delete(`/stories/${storyId}`);
};

export const getStoryViewers = async (storyId: string) => {
  const { data } = await userService.get(`/stories/${storyId}/viewers`);
  return data;
};
