import styled, { DefaultTheme } from 'styled-components'

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorContainer = styled.div<{ theme: DefaultTheme }>`
  .remirror-editor {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    
    .ProseMirror {
      background-color: ${props => props.theme.background};
      color: ${props => props.theme.text};
      
      &:focus {
        outline: none;
      }
    }
  }
  
  .remirror-theme {
    --rmr-color-background: ${props => props.theme.background};
    --rmr-color-text: ${props => props.theme.text};
  }
`

export function Editor({ content, onChange }: EditorProps) {
  return (
    <EditorContainer>
      {/* ...existing code... */}
    </EditorContainer>
  )
}