"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Coffee, Droplet, Star, Calendar, Trash2, Edit } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { PopoverClose } from "@radix-ui/react-popover";
import { EditReviewForm } from "./EditReviewForm";

type ReviewDetailsProps = {
  review: {
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
};

export function getRatingColor(rating: number): string {
  if (rating >= 9) return "bg-green-500";
  if (rating >= 7) return "bg-lime-500";
  if (rating >= 5) return "bg-yellow-500";
  if (rating >= 3) return "bg-orange-500";
  return "bg-red-500";
}

function getAcidityDescription(acidity: number): string {
  if (acidity >= 9) return "Very High";
  if (acidity >= 7) return "High";
  if (acidity >= 5) return "Medium";
  if (acidity >= 3) return "Low";
  return "Very Low";
}

export function ReviewDetails({ review: initialReview }: ReviewDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const utils = api.useUtils();

  // Use client-side query with initial data from server
  const { data: review } = api.review.getById.useQuery(
    { id: initialReview.id },
    {
      initialData: initialReview,
      refetchOnWindowFocus: false,
    },
  );

  const deleteReview = api.review.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Review deleted",
        description: "The review has been successfully deleted.",
      });
      router.push("/reviews");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteReview.mutate({ id: review.id });
  };

  const handleEditSuccess = (updatedReview: typeof review) => {
    setIsEditing(false);
    // Optimistically update the cache with the new data
    utils.review.getById.setData({ id: review.id }, updatedReview);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Edit Review</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EditReviewForm
            review={review}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-2 text-2xl">{review.name}</CardTitle>
            <p className="text-muted-foreground">by {review.roaster.name}</p>
          </div>
          <Badge variant="outline" className="py-1 text-lg">
            {review.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Roast Level:</span>
              <span>{review.roastLevel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Acidity:</span>
              <span>
                {getAcidityDescription(review.acidity)} ({review.acidity}/10)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Rating:</span>
              <span
                className={`rounded-full px-2 py-1 text-white ${getRatingColor(review.rating)}`}
              >
                {review.rating}/10
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Reviewed on:</span>
              <span>{review.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Roaster Details</h3>
            <p>{review.roaster.name}</p>
            <p className="text-muted-foreground">{review.roaster.location}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Process</h3>
          <p>{review.process ?? "Not specified"}</p>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Tasting Notes</h3>
          <p className="italic">{review.notes}</p>
        </div>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Delete Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this review? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <PopoverClose
                    className={buttonVariants({
                      size: "default",
                    })}
                  >
                    Cancel
                  </PopoverClose>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
