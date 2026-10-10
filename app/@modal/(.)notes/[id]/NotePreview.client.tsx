"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading)
    return (
      <Modal onClose={handleClose}>
        <p>Loading...</p>
      </Modal>
    );
  if (isError || !note)
    return (
      <Modal onClose={handleClose}>
        <p>Note not found.</p>
      </Modal>
    );

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        {note.createdAt && (
          <p className={css.date}>
            Created at: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        )}
        <span className={css.tag}>{note.tag}</span>
      </div>
    </Modal>
  );
}
