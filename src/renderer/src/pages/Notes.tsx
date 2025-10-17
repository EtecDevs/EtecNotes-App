import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNote } from '../hooks/useNotes'
import { Editor } from '../components/Editor'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`

const NotesWrapper = styled.div`
  display: flex;
  height: 100%;
  color: ${props => props.theme.text};
  
  .editor-wrapper {
    flex: 1;
    background-color: ${props => props.theme.background};
    
    .remirror-editor {
      background-color: ${props => props.theme.background};
      color: ${props => props.theme.text};
    }
  }
`

export function Notes() {
  const { id } = useParams()
  const { note, updateNote } = useNote(id)
  const [content, setContent] = useState(note?.content)

  const handleContentChange = (newContent) => {
    setContent(newContent)
    updateNote({ ...note, content: newContent })
  }

  return (
    <Container>
      <NotesWrapper>
        <div className="editor-wrapper">
          <Editor content={content} onChange={handleContentChange} />
        </div>
      </NotesWrapper>
    </Container>
  )
}