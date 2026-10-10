"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Реалізація debounce для пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Скидаємо сторінку на першу при зміні пошуку
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Запит через TanStack Query з урахуванням сторінки, дебаунс-пошуку та тегу
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, tag),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <p>Loading notes...</p>;
  if (isError || !data) return <p>Error loading notes!</p>;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button onClick={handleOpenModal} className={css.button}>
          Create note +
        </button>
      </div>

      <NoteList notes={data.notes} />

      <Pagination
        totalPages={data.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
