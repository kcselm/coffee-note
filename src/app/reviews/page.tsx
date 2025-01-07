import { redirect } from "next/navigation";
import { ReviewsTable } from "~/components/ReviewsTable";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <HydrateClient>
      <div className="container mx-auto p-4 pt-20">
        <h1 className="mb-6 text-3xl font-bold">Coffee Reviews</h1>
        <ReviewsTable />
      </div>
    </HydrateClient>
  );
}
