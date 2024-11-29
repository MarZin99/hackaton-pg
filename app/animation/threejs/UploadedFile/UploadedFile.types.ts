type EnvironmentPresetType =
  | "apartment"
  | "city"
  | "forest"
  | "lobby"
  | "night"
  | "park"
  | "studio"
  | "sunset"
  | "warehouse";

type BackgroundFrame = {
  name: string;
  src: string;
};

export type { EnvironmentPresetType, BackgroundFrame };
