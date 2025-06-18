export type AddReviewTypes = {
  open: boolean;
  setOpen: (open: null) => void;
  user: string;
  product: {
    id: string;
    type: 'product' | 'course' | 'bundle' | 'voucher';
  };
};

export type FormTypes = {
  notes: string;
  privacy: boolean;
  mark: number;
};
