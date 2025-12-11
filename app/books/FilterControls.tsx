"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface FilterControlsProps {
  currentStatus: string;
  currentSort: string;
}

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "To Read", value: "TO_READ" },
  { label: "Reading", value: "READING" },
  { label: "Completed", value: "COMPLETED" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "High to Low", value: "rating-desc" },
  { label: "Low to High", value: "rating-asc" },
];

export default function FilterControls({
  currentStatus,
  currentSort,
}: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFilters(nextStatus: string, nextSort: string) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextStatus === "ALL") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    if (nextSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    const target = query ? `/books?${query}` : "/books";

    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <label style={{ fontSize: "0.85rem", color: "#374151" }}>
        Status{" "}
        <select
          value={currentStatus}
          onChange={(e) => updateFilters(e.target.value, currentSort)}
          disabled={isPending}
          style={{
            marginLeft: "0.35rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.3rem 0.6rem",
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label style={{ fontSize: "0.85rem", color: "#374151" }}>
        Sort by{" "}
        <select
          value={currentSort}
          onChange={(e) => updateFilters(currentStatus, e.target.value)}
          disabled={isPending}
          style={{
            marginLeft: "0.35rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.3rem 0.6rem",
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
