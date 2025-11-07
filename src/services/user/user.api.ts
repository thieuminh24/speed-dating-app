import { UpdateUserType } from "@/app/edit-profile/types";
import userService from "../config";

export const getProfile = async () => {
  const { data: response } = await userService.get(`/users`);
  return response;
};

export const updateUser = async (data: UpdateUserType) => {
  const { data: response } = await userService.put(`/users`, data);
  return response;
};
