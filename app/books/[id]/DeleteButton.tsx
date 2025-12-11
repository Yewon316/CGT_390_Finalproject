"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("Delete this book?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.error ?? "Failed to delete book.";
        alert(message);
        return;
      }

      router.push("/books");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unexpected error while deleting.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        padding: "0.45rem 0.85rem",
        borderRadius: "0.6rem",
        border: "none",
        backgroundColor: "#b91c1c",
        color: "white",
        fontSize: "0.9rem",
        cursor: "pointer",
      }}
    >
      Delete Book
    </button>
  );
}
