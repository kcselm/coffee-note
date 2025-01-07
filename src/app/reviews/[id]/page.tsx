import { ReviewDetails } from "~/components/ReviewDetails";
import { api, HydrateClient } from "~/trpc/server";

export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const review = await api.review.getById({
    id: params.id,
  });

  if (!review) {
    return <div>Review not found</div>;
  }

  return (
    <HydrateClient>
      <div className="container mx-auto p-4 pt-20">
        <h1 className="mb-6 text-3xl font-bold">Review Details</h1>
        <ReviewDetails review={review} />
      </div>
    </HydrateClient>
  );
}
