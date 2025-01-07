import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

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
      name: string;
      location: string;
    };
    createdAt: Date;
  };
};

export function ReviewDetails({ review }: ReviewDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{review.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <p>{review.type}</p>
          </div>
          <div>
            <Label>Process</Label>
            <p>{review.process || "N/A"}</p>
          </div>
          <div>
            <Label>Roast Level</Label>
            <p>{review.roastLevel}</p>
          </div>
          <div>
            <Label>Acidity</Label>
            <p>{review.acidity} / 10</p>
          </div>
          <div>
            <Label>Rating</Label>
            <p>{review.rating} / 10</p>
          </div>
          <div>
            <Label>Roaster</Label>
            <p>{review.roaster.name}</p>
          </div>
          <div>
            <Label>Roaster Location</Label>
            <p>{review.roaster.location}</p>
          </div>
          <div>
            <Label>Review Date</Label>
            <p className="pt-1">{review.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <Label>Tasting Notes</Label>
          <p>{review.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
}
