import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import { NewNote } from "./components/NewNote"
import { RawNote, NoteData, Tag } from "./types/Note"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useMemo } from 'react'
import { v4 as uuidv4 } from "uuid"
import { NoteList } from "./components/NoteList"
import { NoteLayout } from "./components/NoteLayout"
import { Note } from "./components/Note"
import { EditNote } from "./components/EditNote"

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTE", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prev => {
      return [...prev, { ...data, id: uuidv4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {
            ...note, ...data, tagIds: tags.map(tag => tag.id)
          }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={
          <NoteList 
            availableTags={tags} 
            notes={notesWithTags}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
          />} />
        <Route path="/new" element={
          <NewNote
            onSubmit={onCreateNote}
            onAddTag={addTag}
            availableTags={tags}
          />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route path="edit" element={
            <EditNote
              onSubmit={onUpdateNote}
              onAddTag={addTag}
              availableTags={tags} />
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App