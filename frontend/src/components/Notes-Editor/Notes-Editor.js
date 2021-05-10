import React, {useState} from 'react';
import {Button, Card, Input, Modal} from 'antd';
import './Notes-Editor.css';
import axios from "axios";

const NotesEditor = ({currentNote, currentFolder, parentCallbackForUpdatingNote, parentCallbackForDeletingNote}) => {
    const {TextArea} = Input;
    const deleteNoteUrl = 'http://localhost:8080/delete-note/'
    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);

    const deleteCurrentNote = () => {
        axios.post(deleteNoteUrl, {folderId: currentFolder.folderId, noteId: currentNote.id}).then(res => {
            if (res.data.deleted) {
                parentCallbackForDeletingNote(res.data);
            }
        });
    };
    return (
        <Card title="Note Editor"
              className='card-note-editor'
              extra={<Button type="primary" onClick={() => setShowDeleteNoteModal(true)}>Delete Note</Button>}>
            <TextArea rows={4} value={currentNote.content}
                      onChange={(e) => parentCallbackForUpdatingNote(e.target.value)}
                      allowClear={true} placeholder='Note'/>
            <Modal visible={showDeleteNoteModal} onOk={deleteCurrentNote}
                   onCancel={() => setShowDeleteNoteModal(false)}>
                Are you sure you want to delete the note ?
            </Modal>
        </Card>
    );
};

export default NotesEditor;
