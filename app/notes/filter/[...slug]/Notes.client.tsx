"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./Notes.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, tag],
    queryFn: () => fetchNotes(page, "", tag),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError || !data) return <p>Error loading notes!</p>;

  return (
    <div className={css.container}>
      <NoteList notes={data.notes} />
      <Pagination
        totalPages={data.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
