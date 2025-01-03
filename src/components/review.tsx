"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestReview() {
  const [latestReview] = api.review.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      await utils.review.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestReview ? (
        <p className="truncate">Your most recent post: {latestReview.name}</p>
      ) : (
        <p>You have no reviews yet.</p>
      )}
    </div>
  );
}
