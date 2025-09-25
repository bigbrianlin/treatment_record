import { useState, useEffect } from "react";
import Head from "next/head";
import SoapNoteService from "@/services/soapNote.service";
import Spinner from "@/components/ui/Spinner/Spinner";
import NoteCard from "@/components/notes/NoteCard/NoteCard";
import styles from "./search.module.css";

export default function Search() {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);

    if (hasSearched) {
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    setIsSearching(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await SoapNoteService.searchSoapNotes(searchTerm);
      setSearchResults(response.data);
    } catch (err) {
      setError("Error searching SOAP notes: " + (err.response?.data || err.message));
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Search SOAP</title>
      </Head>

      <div className={styles.header}>
        <h1>Search Notes</h1>
        <p>Search for notes by patient name or Medical Record Number (MRN).</p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Enter patient name or MRN..."
          value={searchTerm}
          onChange={handleInputChange}
          className={styles.searchInput}
        />
        <button type="submit" disabled={isSearching} className={styles.searchButton}>
          {isSearching ? <Spinner size="small" /> : "Search"}
        </button>
      </form>

      <div className={styles.resultsContainer}>
        {hasSearched ? (
          searchResults.length > 0 ? (
            <div className={styles.notesGrid}>
              {searchResults.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <p className={styles.noResults}>No notes found for "{searchTerm}".</p>
          )
        ) : (
          <p className={styles.prompt}>Please enter a term to start searching.</p>
        )}
      </div>
    </div>
  );
}

Search.auth = true;
