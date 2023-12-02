import { Letterboxd } from "letterboxd-api";

export type ReviewCustomization = Letterboxd & {
  film: {
    title: string;
    year: string;
    image: { tiny: string; medi: string; medium: string; large: string };
  };
  review?: string;
};
