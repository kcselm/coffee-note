import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "./ui/checkbox";

type FilterProps = {
  filters: {
    coffeeName: string;
    roastLevel: string;
    coffeeType: string;
    highRated: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterProps["filters"]>>;
};

export function ReviewFilter({ filters, setFilters }: FilterProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border-2 p-8 shadow-sm md:grid-cols-2">
      <div>
        <Label htmlFor="coffeeName">Coffee Name</Label>
        <Input
          id="coffeeName"
          value={filters.coffeeName}
          onChange={(e) =>
            setFilters({ ...filters, coffeeName: e.target.value })
          }
          placeholder="Filter by Coffee Name"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="highRated"
          checked={filters.highRated}
          onCheckedChange={(checked) =>
            setFilters({ ...filters, highRated: !!checked })
          }
        />
        <Label
          htmlFor="highRated"
          className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Highly Rated Only
        </Label>
      </div>
      <div>
        <Label htmlFor="roastLevel">Roast Level</Label>
        <Select
          value={filters.roastLevel}
          onValueChange={(value) =>
            setFilters({ ...filters, roastLevel: value })
          }
        >
          <SelectTrigger id="roastLevel">
            <SelectValue placeholder="Select roast level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="coffeeType">Coffee Type</Label>
        <Input
          id="coffeeType"
          value={filters.coffeeType}
          onChange={(e) =>
            setFilters({ ...filters, coffeeType: e.target.value })
          }
          placeholder="Filter by Coffee Type"
        />
      </div>
    </div>
  );
}
