"use client";

import Link from "next/link";
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
import { RoasterForm } from "./RoasterForm";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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

export function ReviewForm() {
  const [initialRoasters] = api.roaster.getAll.useSuspenseQuery();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [roasters, setRoasters] = useState(initialRoasters);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      type: "",
      process: "",
      roastLevel: "medium",
      acidity: 5,
      rating: 5,
      notes: "",
      roasterId: "",
    },
  });

  const createReview = api.review.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Review added",
        description: "Your review has been successfully added.",
      });
      form.reset();
      router.push("/reviews");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: ReviewFormValues) {
    setIsLoading(true);
    console.log(data);
    await createReview.mutateAsync(data);
    setIsLoading(false);
  }

  const handleAddRoaster = (newRoaster: Roaster) => {
    setRoasters([...roasters, newRoaster]);
    form.setValue("roasterId", newRoaster.id);
  };

  return (
    <>
      <RoasterForm onRoasterAdded={handleAddRoaster} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    {roasters.map((roaster) => (
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  coffee.{" "}
                  <Link
                    className="font-bold text-black dark:text-white"
                    href="https://utfs.io/f/xXWEGP6YN24f2CQOkymxPQ5qKcSW2wLrCF4imZ3XIsnlfjyB"
                    target={"_blank"}
                  >
                    Click Here
                  </Link>{" "}
                  for inspiration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </>
  );
}
