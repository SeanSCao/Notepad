import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, Transforms } from 'slate';


const LIST_TYPES = ['numbered-list', 'bulleted-list'];

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

const Portal = ({ children }) => {
    return ReactDOM.createPortal(children, document.body)
}

export { CustomEditor, Portal };