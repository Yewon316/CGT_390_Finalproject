"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface EditBookFormProps {
    id: number;
    initialTitle: string;
    initialAuthor: string;
    initialStatus: string;
    initialRating: number | null;
    initialReview?: string | null;
    initialCoverUrl?: string | null;
}

export default function EditBookForm({
  id,
  initialTitle,
  initialAuthor,
  initialStatus,
  initialRating,
  initialReview = "",
  initialCoverUrl = "",
}: EditBookFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [status, setStatus] = useState(initialStatus);
  const [rating, setRating] = useState<number | "">(
    initialRating == null ? "" : initialRating
  );
  const [review, setReview] = useState(initialReview ?? "");
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl ?? null);
  const [coverFileName, setCoverFileName] = useState(
    initialCoverUrl ? "Current cover" : ""
  );
  const [coverLoading, setCoverLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          status,
          rating: rating === "" ? null : rating,
          review: review.trim() === "" ? null : review,
          coverUrl: coverUrl && coverUrl.trim() !== "" ? coverUrl : null,
        }),
      });

      const contentType = res.headers.get("content-type");
      let data: { error?: string } | null = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        setError(data?.error ?? "Failed to update book");
        return;
      }

      router.push(`/books/${id}`);
    } catch (err) {
      console.error("Edit book error:", err);
      setError("Unexpected error Please try again.");
    }
  }

  function handleCoverFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];

    if (!file) {
      setCoverUrl(null);
      setCoverFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (png, jpg, etc.).");
      e.target.value = "";
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    setCoverLoading(true);
    reader.onloadend = () => {
      setCoverUrl(reader.result as string);
      setCoverFileName(file.name);
      setCoverLoading(false);
    };
    reader.onerror = () => {
      setError("Failed to read the selected file.");
      setCoverLoading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleCoverRemove() {
    setCoverUrl(null);
    setCoverFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: "0.75rem" }}
    >
      {error && (
        <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{error}</p>
      )}

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.6rem",
          }}
          required
        />
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Cover Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleCoverFileChange}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.35rem 0.6rem",
          }}
        />
        {coverLoading && (
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Loading preview...</p>
        )}
        {!coverLoading && coverUrl && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <p style={{ fontSize: "0.85rem" }}>{coverFileName || "Selected cover"}</p>
            <div
              style={{
                width: "160px",
                height: "220px",
                borderRadius: "0.75rem",
                border: "1px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: "#f9fafb",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Cover preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <button
              type="button"
              onClick={handleCoverRemove}
              style={{
                width: "fit-content",
                border: "none",
                background: "transparent",
                color: "#dc2626",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.6rem",
          }}
          required
        />
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.35rem 0.6rem",
          }}
        >
          <option value="TO_READ">To Read</option>
          <option value="READING">Reading</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Rating (1-5, optional)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setRating("");
            } else {
              const num = Number(value);
              if (num >= 1 && num <= 5) {
                setRating(num);
              }
            }
          }}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.6rem",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        <label>Summary / Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.6rem",
            resize: "vertical",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
            marginTop: "0.5rem",
            padding: "0.5rem 0.8rem",
            borderRadius: "0.75rem",
            border: "none",
            backgroundColor: "#0f172a",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </form>
  );
}
