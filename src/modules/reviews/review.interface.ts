import { Letterboxd } from "letterboxd-api";

// export type ReviewCustomization = Letterboxd & {
//   film: {
//     title: string;
//     year: string;
//     image: { tiny: string; medi: string; medium: string; large: string };
//   };
//   review?: string;
// };

interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string;
  rating: number;
}

export interface FilmReviewProps {
  author: string;
  author_details: AuthorDetails;
  content: string;
  tag?: string;
}
