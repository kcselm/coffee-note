"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  process: z.string().optional(),
  roastLevel: z.string(),
  acidity: z.number().min(1).max(10),
  rating: z.number().min(1).max(10),
  notes: z.string().min(10, "Notes must be at least 10 characters"),
  roasterId: z.string().min(1, "Please select a roaster"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type Roaster = {
  id: string;
  name: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

type Review = {
  id: string;
  name: string;
  type: string;
  process: string | null;
  roastLevel: string;
  acidity: number;
  rating: number;
  notes: string;
  roaster: {
    id: string;
    name: string;
    location: string;
  };
  createdAt: Date;
};

type EditReviewFormProps = {
  review: Review;
  onCancel: () => void;
  onSuccess: (updatedReview: Review) => void;
};

export function EditReviewForm({
  review,
  onCancel,
  onSuccess,
}: EditReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: roasters = [] as Roaster[] } = api.roaster.getAll.useQuery();
  const utils = api.useUtils();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: review.name,
      type: review.type,
      process: review.process ?? "",
      roastLevel: review.roastLevel,
      acidity: review.acidity,
      rating: review.rating,
      notes: review.notes,
      roasterId: review.roaster.id,
    },
  });

  const updateReview = api.review.update.useMutation({
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await utils.review.getById.cancel({ id: review.id });

      // Snapshot the previous value
      const previousReview = utils.review.getById.getData({ id: review.id });

      // Optimistically update to the new value using a function
      utils.review.getById.setData({ id: review.id }, (oldData) => {
        if (!oldData) return oldData;

        const selectedRoaster = roasters.find(
          (r) => r.id === newData.roasterId,
        );
        return {
          ...oldData,
          ...newData,
          roaster: selectedRoaster || oldData.roaster,
        };
      });

      // Return a context object with the snapshotted value
      return { previousReview };
    },
    onSuccess: (updatedReview) => {
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated.",
      });
      // Cast the server response to match our Review type
      onSuccess(updatedReview as Review);
    },
    onError: (error, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousReview) {
        utils.review.getById.setData({ id: review.id }, context.previousReview);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      void utils.review.getById.invalidate({ id: review.id });
    },
  });

  async function onSubmit(data: ReviewFormValues) {
    setIsLoading(true);
    await updateReview.mutateAsync({
      id: review.id,
      ...data,
    });
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="roasterId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Roaster</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a roaster" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roasters.map((roaster: Roaster) => (
                    <SelectItem key={roaster.id} value={roaster.id}>
                      {roaster.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coffee Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter coffee name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coffee Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter coffee type" {...field} />
              </FormControl>
              <FormDescription className="pl-1">
                The type or variety of coffee
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="process"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Process</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Process" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="washed">Washed</SelectItem>
                  <SelectItem value="Natural">Natural</SelectItem>
                  <SelectItem value="Decaf">Decaf</SelectItem>
                  <SelectItem value="swissWater">Swiss Water</SelectItem>
                  <SelectItem value="ethylAcetate">Ethyl Acetate</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="pl-1">(optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roastLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roast Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select roast level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="acidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acidity (1-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating (1-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your notes" {...field} />
              </FormControl>
              <FormDescription className="pl-1">
                Describe the flavors, aromas, and overall experience of the
                coffee.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
