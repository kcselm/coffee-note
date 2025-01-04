import NavBar from "~/components/NavBar";
import { ReviewForm } from "~/components/ReviewForm";
import { api, HydrateClient } from "~/trpc/server";

export default async function AddReviewPage() {
  type Roaster = {
    id: string;
    name: string;
  };

  void api.roaster.getAll.prefetch();
  return (
    <HydrateClient>
      <NavBar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="mb-4 text-3xl font-bold">Create New Review</h1>
        <ReviewForm />
      </div>
    </HydrateClient>
  );
}
