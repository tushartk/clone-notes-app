import React, {useEffect, useState} from 'react';
import './App.css';
import {Col, Input, Layout, List, Row, Typography} from 'antd';
import FolderNavbar from './components/Folder-Navbar/Folder-Navbar';
import NotesShowcase from "./components/Notes-Showcase/Notes-Showcase";
import * as _ from 'lodash';
import NotesEditor from "./components/Notes-Editor/Notes-Editor";
import axios from "axios";

function App() {
    const {Header, Content} = Layout;
    const getAllFoldersUrl = 'http://localhost:8080/get-all-folders/';
    const updateNoteUrl = 'http://localhost:8080/update-note'
    const [currentFolder, setCurrentFolder] = useState({});
    const [allFolders, setAllFolders] = useState([]);
    const [currentNote, setCurrentNote] = useState({});
    const [inSearchMode, setInSearchMode] = useState(false);
    const [searchableNotes, setSearchableNotes] = useState([]);
    const [searchListToShow, setSearchListToShow] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {Search} = Input;
    const {Title} = Typography;

    useEffect(() => {
        document.title = 'Notes';
        axios.get(getAllFoldersUrl).then((res) => {
            setAllFolders(res.data.folders);
        });
    }, []);

    const parentCallbackForUpdatingNote = (val) => {
        axios.post(updateNoteUrl, {
            folderId: currentFolder.folderId,
            noteId: currentNote.id,
            content: val
        }).then((res) => {
            setCurrentNote(res.data.noteObj);
            setCurrentFolder(res.data.folderObj);
            setAllFolders(res.data.allFolders);
        });
    };

    useEffect(() => {
        const allNotes = [];
        allFolders.forEach(folder => {
            folder.notes.forEach(note => {
                allNotes.push(note);
            })
        });
        setSearchableNotes(allNotes);
    }, [allFolders]);

    const parentCallbackForDeletingNote = (val) => {
        setCurrentFolder(val.folderObj);
        setAllFolders(val.allFolders);
        setCurrentNote({});
    };

    const onChangeSearch = (e) => {
        setInSearchMode(true);
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        const itemsWithTerm = _.filter(searchableNotes, note => {
           return note.content.includes(searchTerm);
        });
        setSearchListToShow(itemsWithTerm);
    };

    const parentCallbackForSearchMode = (val) => {
        setInSearchMode(val);
        setSearchTerm('');
    };

    const setNoteUpForEdit = (note) => {
        const folder = _.find(allFolders, ['folderName', note.folderName]);
        setCurrentFolder(folder)
        const actualNote = _.find(folder.notes, note)
        setCurrentNote(actualNote);
        setInSearchMode(false);
    };

    return (
        <div className='App'>
            <Layout className='main-layout'>
                <Header className='header'>
                    <Row>
                        <Col span={1}>
                            <h1>
                                <div className='logo'>Notes</div>
                            </h1>
                        </Col>
                        <Col span={4}>
                            <Search
                                placeholder="Input text to search in notes"
                                allowClear
                                enterButton="Search"
                                size="large"
                                className='search-bar'
                                value = {searchTerm}
                                onChange={onChangeSearch}
                            />
                        </Col>
                    </Row>
                </Header>
                <Layout className='content-layout'>
                    <FolderNavbar allFolders={allFolders}
                                  parentCallbackForCurrentFolder={(val) => setCurrentFolder(val)}
                                  parentCallBackForAllFolders={(val) => setAllFolders(val)}
                                  parentCallbackForSearchMode={parentCallbackForSearchMode}/>
                    <Content>
                        <Row>
                            <Col span={6}>
                                {
                                    inSearchMode ?
                                        (
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={searchListToShow}
                                                header={<Title level={5}>Search Results</Title>}
                                                bordered
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            className='file-list'
                                                            title={<div><b>{item.folderName}</b> > {item.content}</div>}
                                                            onClick={() => setNoteUpForEdit(item)}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        ) :
                                        (
                                            <NotesShowcase folderInfo={currentFolder}
                                                           parentCallbackForCurrentFolder={(val) => setCurrentFolder(val)}
                                                           parentCallbackForCurrentNote={(val) => setCurrentNote(val)}
                                                           parentCallbackForAllFolders={(val) => setAllFolders(val)}
                                            />
                                        )
                                }

                            </Col>
                            {!_.isEmpty(currentNote) && currentFolder.notes.length > 0 && <Col span={6}>
                                <NotesEditor currentNote={currentNote}
                                             currentFolder={currentFolder}
                                             parentCallbackForUpdatingNote={parentCallbackForUpdatingNote}
                                             parentCallbackForDeletingNote={parentCallbackForDeletingNote}/>
                            </Col>}
                        </Row>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default App;
