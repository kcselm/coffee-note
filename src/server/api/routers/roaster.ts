import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const roasterRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleteRoaster = ctx.db.roaster.delete({
        where: {
          id: input.id,
        },
      });

      const deleteReviews = ctx.db.review.deleteMany({
        where: {
          roasterId: input.id,
        },
      });

      return ctx.db.$transaction([deleteReviews, deleteRoaster]);
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.roaster.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), location: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.roaster.create({
        data: {
          name: input.name,
          location: input.location,
          userId: ctx.session.user.id,
        },
      });
    }),
});
