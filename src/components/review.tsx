"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestReview() {
  const [latestReview] = api.review.getLatest.useSuspenseQuery();

  console.log("latestReview", latestReview);

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
