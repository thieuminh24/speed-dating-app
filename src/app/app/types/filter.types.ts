// src/types/filter.types.ts (hoặc để trực tiếp trong file cũng được)
export type GenderFilter = "All" | "Male" | "Female" | "Non-binary" | "Other";

export interface MatchFilters {
  minAge: number;
  maxAge: number;
  gender: GenderFilter;
}
