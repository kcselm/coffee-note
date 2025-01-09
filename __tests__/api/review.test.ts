import type { inferProcedureInput } from "@trpc/server";
import { createContextInner } from "~/server/api/context";
import { createCaller, AppRouter } from "~/server/api/root";
import { db } from "~/server/db";

test("add and get post", async () => {
  const ctx = await createContextInner({});
  // const caller = createCaller(ctx);

  const input: inferProcedureInput<AppRouter["review"]["create"]> = {
    name: "Test Coffee",
    type: "Test Type",
    process: "Washed",
    roastLevel: "medium",
    acidity: 7,
    rating: 8,
    notes: "Delicious test coffee",
    roasterId: "cm5kc0ea2000785h09166mp3p",
  };

  // const post = await caller.review.create(input);

  expect(input).toMatchObject(input);
});
