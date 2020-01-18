import React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { compose } from 'recompose';
import queryString from 'query-string';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Text, Node } from 'slate';
import { withHistory } from 'slate-history';
import { debounce } from 'lodash';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
// import debounce from '../../../helpers';

const Note = (props) => {
    let initialValue = [
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ]
    if (props.note.body) {
        initialValue = JSON.parse(props.note.body);
    }
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [value, setValue] = useState(initialValue);
    const [title, setTitle] = useState(props.note.title);

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

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
            .note(props.authUser.uid, props.note.uid)
            .update({
                title,
                editedAt: props.firebase.serverValue.TIMESTAMP,
            });
    }

    const handler = useCallback(debounce((value) => {
        saveContent(value);
    }, 1500), []);

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
        }
    }

    return (
        <React.Fragment>
            <form onBlur={e => saveTitle(e)} onSubmit={e => saveTitle(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChangeTitle}
                        className=""
                        id="title" />
                </div>
            </form>

            <Slate editor={editor} value={value} onChange={onChange}>
                <div>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                        }}
                    >
                        Bold
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                        }}
                    >
                        Code Block
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
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })

        return !!match
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
}

const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
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

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

export default withFirebase(Note);
