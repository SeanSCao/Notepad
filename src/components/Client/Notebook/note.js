import React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Editable, withReact, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Text, Node } from 'slate';
import { withHistory } from 'slate-history';
import { debounce } from 'lodash';

import { withFirebase } from '../../Firebase';

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const Note = (props) => {
    const defaultValue = [
        {
            type: 'paragraph',
            children: [{ text: 'Start typing...' }],
        },
    ]
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [value, setValue] = useState(defaultValue);
    const [title, setTitle] = useState('');
    const [uid, setUid] = useState('');

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    const onChange = (value) => {
        setValue(value);
        handler(value);
    }

    const onChangeTitle = e => {
        setTitle(e.target.value);
    }

    const saveTitle = (e) => {
        e.preventDefault();
        props.firebase
            .note(props.authUser.uid, uid)
            .update({
                title,
                editedAt: props.firebase.serverValue.TIMESTAMP,
            });
    }

    const handler = useCallback(debounce((value) => {
        saveContent(value);
    }, 1500), [props.note]);

    const serialize = value => {
        return (
            value
                // Return the string content of each paragraph in the value's children.
                .map(n => Node.string(n))
                // Join them all with line breaks denoting paragraphs.
                .join('\n')
        )
    }

    const saveContent = (value) => {
        const body = JSON.stringify(value);
        let preview = serialize(value);
        preview = preview.replace(/(\r\n|\n|\r)/gm, ' ');
        if (preview.length > 20) {
            preview = preview.slice(0, 20) + '...';
        }
        props.firebase
            .note(props.authUser.uid, props.note.uid)
            .update({
                body,
                preview,
                editedAt: props.firebase.serverValue.TIMESTAMP,
            });
    }

    const onKeyDown = event => {
        if (!event.ctrlKey) {
            return
        }

        // Replace the `onKeyDown` logic with our new commands.
        switch (event.key) {
            case '`': {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
                break
            }

            case 'b': {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
                break
            }

            default: {
                break
            }
        }
    }

    useEffect(() => {
        setUid(props.note.uid);
        setTitle(props.note.title);
        if (props.note.body) {
            setValue(JSON.parse(props.note.body));
        } else {
            setValue(defaultValue);
        }
    }, [props.note]);

    return (
        <React.Fragment>
            <form onBlur={e => saveTitle(e)} onSubmit={e => saveTitle(e)}>
                <div className="form-group mt-2">
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChangeTitle}
                        className="form-control-lg pl-0 border-0"
                        id="title" />
                </div>
            </form>

            <Slate editor={editor} value={value} onChange={onChange}>
                <div>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleMark(editor, 'bold')
                        }}>
                        Bold
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleMark(editor, 'underline')
                        }}>
                        Underline
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleMark(editor, 'italic')
                        }}>
                        Italic
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'code')
                        }}>
                        Code
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'h1')
                        }}>
                        H1
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'h2')
                        }}>
                        H2
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'h3')
                        }}>
                        H3
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'numbered-list')
                        }}>
                        OL
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBlock(editor, 'bulleted-list')
                        }}>
                        UL
                    </button>
                </div>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={onKeyDown}
                />
            </Slate>
        </React.Fragment>

    )
}

const CustomEditor = {
    isBlockActive(editor, format) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        })

        return !!match
    },

    isMarkActive(editor, format) {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    },

    toggleBlock(editor, format) {
        const isActive = this.isBlockActive(editor, format)
        const isList = LIST_TYPES.includes(format)

        Transforms.unwrapNodes(editor, {
            match: n => LIST_TYPES.includes(n.type),
            split: true,
        })

        Transforms.setNodes(editor, {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        })

        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(editor, block)
        }
    },

    toggleMark(editor, format) {
        const isActive = this.isMarkActive(editor, format)

        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    },
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = props => {
    const inlineStyle = {
        fontWeight: (props.leaf.bold ? 'bold' : 'normal'),
        fontStyle: (props.leaf.italic ? 'italic' : 'normal'),
        textDecoration: (props.leaf.underline ? 'underline' : 'none')
    }
    return (
        <span
            {...props.attributes}
            style={inlineStyle}
        >
            {props.children}
        </span>
    )
}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const H1Element = props => {
    return (
        <pre {...props.attributes}>
            <h1>{props.children}</h1>
        </pre>
    )
}

const H2Element = props => {
    return (
        <pre {...props.attributes}>
            <h2>{props.children}</h2>
        </pre>
    )
}

const H3Element = props => {
    return (
        <pre {...props.attributes}>
            <h3>{props.children}</h3>
        </pre>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

export default withFirebase(Note);
