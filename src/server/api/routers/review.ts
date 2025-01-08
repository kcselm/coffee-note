import { TRPCError } from "@trpc/server";
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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.review.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        roaster: true,
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

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: {
          roaster: true,
        },
      });

      if (!review || review.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found or you do not have permission to view it.",
        });
      }

      return review;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
      });

      if (!review || review.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Review not found or you do not have permission to delete it.",
        });
      }

      await ctx.db.review.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
