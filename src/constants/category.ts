export const Category = {
  Popular: 'popular',
  AiringNow: 'airingNow',
  Favorites: 'favorites',
} as const;

export type Category = (typeof Category)[keyof typeof Category];
