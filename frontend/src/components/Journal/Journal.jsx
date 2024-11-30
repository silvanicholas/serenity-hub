import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import styles from "./Journal.module.css";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:5000/journal/entries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleCreateEntry = async () => {
    if (!newEntry.title || !newEntry.content) return;

    try {
      const response = await fetch("http://localhost:5000/journal/entry", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        const data = await response.json();
        setEntries([data, ...entries]);
        setNewEntry({ title: "", content: "" });
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const handleUpdateEntry = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/journal/entry/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingEntry),
        }
      );

      if (response.ok) {
        const updatedEntry = await response.json();
        setEntries(
          entries.map((entry) => (entry.id === id ? updatedEntry : entry))
        );
        setEditingEntry(null);
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/journal/entry/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Journal</h1>
          <button
            className={styles.newEntryButton}
            onClick={() => setIsCreating(true)}
          >
            <Plus size={20} /> New Entry
          </button>
        </div>

        {isCreating && (
          <div className={styles.entryCard}>
            <input
              type="text"
              placeholder="Entry Title"
              value={newEntry.title}
              onChange={(e) =>
                setNewEntry({ ...newEntry, title: e.target.value })
              }
              className={styles.titleInput}
            />
            <textarea
              placeholder="Write your thoughts..."
              value={newEntry.content}
              onChange={(e) =>
                setNewEntry({ ...newEntry, content: e.target.value })
              }
              className={styles.contentInput}
            />
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.saveButton}`}
                onClick={handleCreateEntry}
              >
                <Save size={16} /> Save
              </button>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => {
                  setIsCreating(false);
                  setNewEntry({ title: "", content: "" });
                }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.entriesList}>
          {entries.map((entry) => (
            <div key={entry.id} className={styles.entryCard}>
              {editingEntry?.id === entry.id ? (
                <>
                  <input
                    type="text"
                    value={editingEntry.title}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        title: e.target.value,
                      })
                    }
                    className={styles.titleInput}
                  />
                  <textarea
                    value={editingEntry.content}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        content: e.target.value,
                      })
                    }
                    className={styles.contentInput}
                  />
                  <div className={styles.buttonContainer}>
                    <button
                      className={`${styles.button} ${styles.saveButton}`}
                      onClick={() => handleUpdateEntry(entry.id)}
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      className={`${styles.button} ${styles.cancelButton}`}
                      onClick={() => setEditingEntry(null)}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.entryHeader}>
                    <h2>{entry.title}</h2>
                    <div className={styles.entryActions}>
                      <button
                        className={styles.iconButton}
                        onClick={() => setEditingEntry(entry)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className={styles.iconButton}
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className={styles.timestamp}>
                    {formatDate(entry.created_at)}
                  </p>
                  <p className={styles.content}>{entry.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Journal;
