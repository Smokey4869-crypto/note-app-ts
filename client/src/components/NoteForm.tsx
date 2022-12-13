import { Form, Stack, Row, Col, Button } from 'react-bootstrap'
import CreatableReactSelect from 'react-select/creatable'
import { Link } from 'react-router-dom'
import { useRef, useState, FormEvent } from 'react'
import { NoteData, Tag } from '../types/Notes'
import { v4 as uuidv4 } from "uuid"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: []
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control required ref={titleRef}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                isMulti
                                onCreateOption={label => {
                                    const newTag = { id: uuidv4(), label }
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id}
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Form.Group controlId='markdown'>
                        <Form.Label>Body</Form.Label>
                        <Form.Control as="textarea" rows={16} ref={markdownRef} required></Form.Control>
                    </Form.Group>
                    <Stack direction='horizontal' gap={3} className='justify-content-end'>
                        <Button type='submit' variant='outline-primary'>Save</Button>
                        <Link to="..">
                            <Button type='button' variant='outline-secondary'>Cancel</Button>
                        </Link>
                    </Stack>
                </Row>
            </Stack>
        </Form>
    )
}