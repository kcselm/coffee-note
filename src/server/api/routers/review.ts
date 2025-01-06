import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string(),
        process: z.string().optional(),
        roastLevel: z.string(),
        acidity: z.number(),
        rating: z.number(),
        notes: z.string(),
        roasterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.create({
        data: {
          name: input.name,
          type: input.type,
          process: input.process,
          roastLevel: input.roastLevel,
          acidity: input.acidity,
          rating: input.rating,
          notes: input.notes,
          roasterId: input.roasterId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const review = await ctx.db.review.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        userId: ctx.session.user.id,
      },
    });
    return review ?? null;
  }),
});
