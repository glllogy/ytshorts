import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Montserrat";

loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-800-normal.woff2"), weight: "800" });
loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-900-normal.woff2"), weight: "900" });

export const C = {
  bg: "#FFF6E5",
  ink: "#1B1B1F",
  red: "#E5484D",
  green: "#22A05A",
  yellow: "#FFD60A",
  blue: "#3B82F6",
  gray: "#9AA0A6",
};

// Layout zones for 1080x1920 (keep clear of Shorts UI at the bottom/right)
export const GROUND_Y = 1130;
export const CAPTION_Y = 1300;
