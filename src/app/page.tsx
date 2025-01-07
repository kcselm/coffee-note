import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NavBar from "~/components/NavBar";
import { LatestReview } from "~/components/review";
import { buttonVariants } from "~/components/ui/button";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.review.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-28">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-yellow-800 dark:text-yellow-700">Coffee</span>{" "}
            Note
          </h1>
          <p className="text-center text-2xl">
            {!session && (
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className={buttonVariants({
                  size: "lg",
                })}
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            )}
          </p>
          {session && (
            <div className="flex gap-4">
              <Link
                href="/reviews"
                className={buttonVariants({
                  size: "lg",
                })}
              >
                My Reviews
              </Link>
              <Link
                href="/add-review"
                className={buttonVariants({
                  size: "lg",
                })}
              >
                Make A New Review <ArrowRight />
              </Link>
            </div>
          )}
        </div>
      </main>
      <div className="fixed inset-x-0 bottom-0 h-1/2">
        <img
          src="https://utfs.io/f/xXWEGP6YN24fmrpc4pq4GUB7OATFdy5DMW1NYIS0mCuLQw6v"
          className="h-full w-full object-cover grayscale"
        />
      </div>
    </HydrateClient>
  );
}
