"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const roasterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
});

type RoasterFormValues = z.infer<typeof roasterSchema>;

export function RoasterForm({
  onRoasterAdded,
}: {
  onRoasterAdded: (roaster: any) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RoasterFormValues>({
    resolver: zodResolver(roasterSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const createRoaster = api.roaster.create.useMutation({
    onSuccess: (newRoaster) => {
      toast({
        title: "Roaster added",
        description: `${newRoaster.name} has been successfully added.`,
      });
      form.reset();
      onRoasterAdded(newRoaster);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: RoasterFormValues) {
    setIsLoading(true);
    // Here you would typically call your tRPC mutation to create a new roaster
    // For example: const newRoaster = await createRoaster.mutate(data)
    await createRoaster.mutateAsync(data);
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Roaster</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Roaster</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roaster Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter roaster name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the coffee roaster.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter roaster location" {...field} />
                  </FormControl>
                  <FormDescription>
                    The location of the roaster.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Roaster"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
