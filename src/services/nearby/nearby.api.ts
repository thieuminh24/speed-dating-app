// src/services/nearby/nearby.api.ts
import { getFakeNearbyUsers, fakeSwipeUser } from "./fake-nearby-users";

export type { NearbyUser } from "./fake-nearby-users";

export const getNearbyUsers = async (maxDistance = 10) => {
  const users = await getFakeNearbyUsers();
  return users.filter((u) => u.distance <= maxDistance);
};

export const swipeUser = async (targetUserId: string, isLike: boolean) => {
  return await fakeSwipeUser(targetUserId, isLike);
};
