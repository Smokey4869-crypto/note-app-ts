import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import { NewNote } from "./components/NewNote"
import { RawNote, NoteData, Tag } from "./types/Notes"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useMemo } from 'react'
import { v4 as uuidv4 } from "uuid"
import { NoteList } from "./components/NoteList"

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

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags} />} />
        <Route path="/new" element={
          <NewNote 
            onSubmit={onCreateNote} 
            onAddTag={addTag} 
            availableTags={tags}
          />} />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>}></Route>
          <Route path="edit" element={<h1>Edit</h1>}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App