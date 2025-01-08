"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "~/trpc/react";
import { ReviewFilter } from "./ReviewFilter";

type SortField =
  | "createdAt"
  | "name"
  | "type"
  | "roastLevel"
  | "acidity"
  | "rating"
  | "roaster.name";

type SortOrder = "asc" | "desc";

export function ReviewsTable() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    coffeeName: "",
    roastLevel: "",
    coffeeType: "",
    highRated: false,
  });
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: reviews, isLoading } = api.review.getAll.useQuery();

  const filteredReviews = reviews?.filter((review) => {
    return (
      (filters.coffeeName === "" ||
        review.name.toLowerCase().includes(filters.coffeeName.toLowerCase())) &&
      (filters.roastLevel === "" || review.roastLevel === filters.roastLevel) &&
      (filters.coffeeType === "" ||
        review.type.toLowerCase().includes(filters.coffeeType.toLowerCase())) &&
      (!filters.highRated || review.rating >= 8)
    );
  });

  const sortedReviews = filteredReviews?.sort((a, b) => {
    const first = sortField === "roaster.name" ? a.name : a[sortField];
    const second = sortField === "roaster.name" ? b.name : b[sortField];
    if (first < second) return sortOrder === "asc" ? -1 : 1;
    if (first > second) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (reviewId: string) => {
    router.push(`/reviews/${reviewId}`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ReviewFilter filters={filters} setFilters={setFilters} />
      <Table className="rounded-lg border p-8 shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("createdAt")}
              className="cursor-pointer"
            >
              Created At{" "}
              {sortField === "createdAt" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Coffee Name{" "}
              {sortField === "name" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("type")}
              className="cursor-pointer"
            >
              Type{" "}
              {sortField === "type" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("roaster.name")}
              className="cursor-pointer"
            >
              Roaster{" "}
              {sortField === "roaster.name" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("roastLevel")}
              className="cursor-pointer"
            >
              Roast Level{" "}
              {sortField === "roastLevel" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("acidity")}
              className="cursor-pointer"
            >
              Acidity{" "}
              {sortField === "acidity" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
            <TableHead
              onClick={() => handleSort("rating")}
              className="cursor-pointer"
            >
              Rating{" "}
              {sortField === "rating" &&
                (sortOrder === "asc" ? (
                  <ChevronUp className="inline" />
                ) : (
                  <ChevronDown className="inline" />
                ))}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReviews?.map((review) => (
            <TableRow
              key={review.id}
              onClick={() => handleRowClick(review.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell>{review.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{review.name}</TableCell>
              <TableCell>{review.type}</TableCell>
              <TableCell>{review.roaster.name}</TableCell>
              <TableCell>{review.roastLevel}</TableCell>
              <TableCell>{review.acidity}</TableCell>
              <TableCell>{review.rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
