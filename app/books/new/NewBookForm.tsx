"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBookForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("TO_READ");
  const [rating, setRating] = useState<number | "">("");
  const [review, setReview] = useState("");
  const [coverData, setCoverData] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          status,
          rating: rating === "" ? null : rating,
          review: review.trim() === "" ? null : review,
          coverUrl: coverData ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed");
        return;
      }

      router.push("/books");
    } catch (err) {
      console.error("Add book error:", err);
      setError("error. Please try again.");
    }
  }

  function handleCoverFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];

    if (!file) {
      setCoverData(null);
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
      setCoverData(reader.result as string);
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
    setCoverData(null);
    setCoverFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div style={{ maxWidth: "520px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        Add a Book
      </h1>
      <form onSubmit={handleSubmit} className="form-card">
        {error && (
          <p style={{ color: "#ff1414ff", fontSize: "0.85rem" }}>{error}</p>
        )}

        <div className="form-field">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label">Cover Image (optional)</label>
          <input
            className="form-input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleCoverFileChange}
          />
          {coverLoading && (
            <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Loading preview...</p>
          )}
          {coverFileName && !coverLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <p style={{ fontSize: "0.85rem" }}>Selected: {coverFileName}</p>
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
                  src={coverData ?? ""}
                  alt="Selected cover preview"
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

        <div className="form-field">
          <label className="form-label">Author</label>
          <input
            className="form-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="TO_READ">To Read</option>
            <option value="READING">Reading</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Rating (1-5, optional)</label>
          <input
            className="form-input"
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
            placeholder="number 1-5"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Summary / Review (optional)</label>
          <textarea
            className="form-input form-textarea"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think about this book?"
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Save
        </button>
      </form>
    </div>
  );
}
