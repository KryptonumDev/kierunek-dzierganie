export type ReviewsTypes = {
  reviews: {
    rating: 1 | 2 | 3 | 4 | 5;
    review: string;
    nameOfReviewer: string;
    _id: string;
  }[];
  logged: boolean;
  alreadyBought: boolean;
};
