export type AddReviewTypes = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export type FormTypes = {
  notes: string;
  privacy: boolean;
  mark: number;
}