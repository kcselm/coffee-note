import { ArrowLeft, ArrowLeftSquare } from "lucide-react";
import Link from "next/link";
import { ReviewDetails } from "~/components/ReviewDetails";
import { buttonVariants } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await api.review.getById({
    id: id,
  });

  if (!review) {
    return <div>Review not found</div>;
  }

  return (
    <HydrateClient>
      <div className="container mx-auto p-4 pt-20">
        <div className="flex items-center gap-12 pb-6 lg:justify-center">
          <Link
            href="/reviews"
            className={buttonVariants({
              size: "default",
            })}
          >
            <ArrowLeft />
            Back to Reviews
          </Link>
          <h1 className="text-3xl font-bold">Review Details</h1>
        </div>
        <ReviewDetails review={review} />
      </div>
    </HydrateClient>
  );
}
