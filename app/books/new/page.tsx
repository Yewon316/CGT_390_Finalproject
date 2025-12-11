import { requireUser } from "@/lib/session";
import NewBookForm from "./NewBookForm";

export default async function NewBookPage() {
  await requireUser();
  return <NewBookForm />;
}
