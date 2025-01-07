import { redirect } from "next/navigation";
import { ReviewForm } from "~/components/ReviewForm";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function AddReviewPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <HydrateClient>
      <div className="container mx-auto p-4 pt-20">
        <h1 className="mb-4 text-3xl font-bold">Create New Review</h1>
        <ReviewForm />
      </div>
    </HydrateClient>
  );
}
