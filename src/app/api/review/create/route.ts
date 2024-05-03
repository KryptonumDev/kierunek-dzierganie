import { sanityCreateReview } from '@/utils/sanity.fetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { rating, review, nameOfReviewer, course } = await request.json();

  const res = await sanityCreateReview({
    rating: rating,
    review: review,
    nameOfReviewer: nameOfReviewer,
    course: course,
  });

  return NextResponse.json(res);
}
