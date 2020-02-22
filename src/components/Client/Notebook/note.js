import React from 'react';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
    Slate,
    Editable,
    ReactEditor,
    withReact,
    useSelected,
    useFocused,
} from 'slate-react';
import { Editor, Transforms, createEditor, Range, Text, Node } from 'slate';
import { withHistory } from 'slate-history';
import { debounce } from 'lodash';

import { withFirebase } from '../../Firebase';
import { CustomEditor, Portal } from './editor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faUnderline, faHeading, faCode, faItalic, faListUl, faListOl, faUnlink } from '@fortawesome/free-solid-svg-icons';

const Note = (props) => {
    const ref = useRef();
    const defaultValue = [
        {
            type: 'paragraph',
            children: [{ text: 'Start typing...' }],
        },
    ]
    const editor = useMemo(
        () => withMentions(withReact(withHistory(createEditor()))),
        []
    )
    const [value, setValue] = useState(defaultValue);
    const [target, setTarget] = useState();
    const [index, setIndex] = useState(0);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [uid, setUid] = useState('');
    const [chars, setChars] = useState([]);

    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [code, setCode] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [heading, setHeading] = useState(false);
    const [ol, setOl] = useState(false);
    const [ul, setUl] = useState(false);

    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);

    const onChange = (value) => {
        setValue(value);
        handler(value);

        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const before = wordBefore && Editor.before(editor, wordBefore)
            const beforeRange = before && Editor.range(editor, before, start)
            const beforeText = beforeRange && Editor.string(editor, beforeRange)
            const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
            const after = Editor.after(editor, start)
            const afterRange = Editor.range(editor, start, after)
            const afterText = Editor.string(editor, afterRange)
            const afterMatch = afterText.match(/^(\s|$)/)

            if (beforeMatch && afterMatch) {
                setTarget(beforeRange)
                setSearch(beforeMatch[1])
                setIndex(0)
                return
            }
        }

        setTarget(null)
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

    const onKeyDown = useCallback(
        event => {
            if (target) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault()
                        const prevIndex = index >= chars.length - 1 ? 0 : index + 1
                        setIndex(prevIndex)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        const nextIndex = index <= 0 ? chars.length - 1 : index - 1
                        setIndex(nextIndex)
                        break
                    case 'Tab':
                    case 'Enter':
                        event.preventDefault()
                        Transforms.select(editor, target)
                        insertMention(editor, chars[index])
                        setTarget(null)
                        break
                    case 'Escape':
                        event.preventDefault()
                        setTarget(null)
                        break
                }
            }
        },
        [index, search, target]
    )

    useEffect(() => {
        setUid(props.note.uid);
        setTitle(props.note.title);
        if (props.note.body) {
            setValue(JSON.parse(props.note.body));
        } else {
            setValue(defaultValue);
        }
    }, [props.note]);

    useEffect(() => {
        setChars(props.dictionary.filter(item =>
            item.title.toLowerCase().startsWith(search.toLowerCase())
        ));
    }, [props.dictionary]);

    useEffect(() => {
        if (target && chars.length > 0) {
            const el = ref.current
            const domRange = ReactEditor.toDOMRange(editor, target)
            const rect = domRange.getBoundingClientRect()
            el.style.top = `${rect.top + window.pageYOffset + 24}px`
            el.style.left = `${rect.left + window.pageXOffset}px`
        }
    }, [chars.length, editor, index, search, target])

    return (
        <React.Fragment>
            <form onBlur={e => saveTitle(e)} onSubmit={e => saveTitle(e)}>
                <div className="form-group mt-2">
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChangeTitle}
                        className="form-control-lg pl-0 border-0 font-weight-bold"
                        id="title" />
                </div>
            </form>

            <Slate editor={editor} value={value} onChange={onChange}>
                <div>
                    <FontAwesomeIcon
                        icon={faBold}
                        size="md"
                        color={bold ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setBold(!bold);
                            CustomEditor.toggleMark(editor, 'bold');
                        }} />
                    <FontAwesomeIcon
                        icon={faUnderline}
                        size="md"
                        color={underline ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault()
                            setUnderline(!underline);
                            CustomEditor.toggleMark(editor, 'underline')
                        }} />
                    <FontAwesomeIcon
                        icon={faItalic}
                        size="md"
                        color={italic ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setItalic(!italic);
                            CustomEditor.toggleMark(editor, 'italic');
                        }} />
                    <FontAwesomeIcon
                        icon={faCode}
                        size="md"
                        color={code ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setCode(!code);
                            CustomEditor.toggleBlock(editor, 'code');
                        }} />
                    <FontAwesomeIcon
                        icon={faHeading}
                        size="md"
                        color={heading ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setHeading(!heading);
                            CustomEditor.toggleBlock(editor, 'h1');
                        }} />
                    <FontAwesomeIcon
                        icon={faListOl}
                        size="md"
                        color={ol ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setOl(!ol);
                            CustomEditor.toggleBlock(editor, 'numbered-list');
                        }} />
                    <FontAwesomeIcon
                        icon={faListUl}
                        size="md"
                        color={ul ? "black" : "black"}
                        className="cursor-pointer mx-2"
                        onMouseDown={event => {
                            event.preventDefault();
                            setUl(!ul);
                            CustomEditor.toggleBlock(editor, 'bulleted-list');
                        }} />
                </div>
                <hr />
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={onKeyDown}
                />
                {target && chars.length > 0 && (
                    <Portal>
                        <div
                            ref={ref}
                            style={{
                                top: '-9999px',
                                left: '-9999px',
                                position: 'absolute',
                                zIndex: 1,
                                padding: '3px',
                                background: 'white',
                                borderRadius: '4px',
                                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                            }}
                        >
                            {chars.map((char, i) => (
                                <div
                                    key={char}
                                    style={{
                                        padding: '1px 3px',
                                        borderRadius: '3px',
                                        background: i === index ? '#B4D5FF' : 'transparent',
                                    }}
                                >
                                    {char.title}
                                </div>
                            ))}
                        </div>
                    </Portal>
                )}
            </Slate>
        </React.Fragment>

    )
}

const withMentions = editor => {
    const { isInline, isVoid } = editor

    editor.isInline = element => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = element => {
        return element.type === 'mention' ? true : isVoid(element)
    }

    return editor
}

const insertMention = (editor, character) => {
    const mention = { type: 'mention', character, children: [{ text: '' }] }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
}

const Element = props => {
    const { attributes, children, element } = props
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'h1':
            return <h1 {...attributes}>{children}</h1>
        case 'h2':
            return <h2 {...attributes}>{children}</h2>
        case 'h3':
            return <h3 {...attributes}>{children}</h3>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'code':
            return <CodeElement {...props} />
        case 'mention':
            return <MentionElement {...props} />
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

const MentionElement = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <span
            {...attributes}
            contentEditable={false}
            onMouseOver={console.log('hi')}
            style={{
                padding: '3px 3px 2px',
                margin: '0 1px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                borderRadius: '4px',
                backgroundColor: '#eee',
                fontSize: '0.9em',
                boxShadow: selected ? '0 0 0 2px #B4D5FF' : 'none',
            }}
        >
            @{element.character.title}
            {children}
        </span>
    )
}

const CHARACTERS = [
    'Aayla Secura',
    'Adi Gallia',
    'Admiral Dodd Rancit',
    'Admiral Firmus Piett',
    'Admiral Gial Ackbar',
    'Admiral Ozzel',
    'Admiral Raddus',
    'Admiral Terrinald Screed',
    'Admiral Trench',
    'Admiral U.O. Statura',
    'Agen Kolar',];

export default withFirebase(Note);
