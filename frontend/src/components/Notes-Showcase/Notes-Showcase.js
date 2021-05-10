import React, {useState} from 'react';
import {Button, Col, List, Modal, Row, Typography} from "antd";
import './Notes-Showcase.css';
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import * as _ from "lodash";
import axios from "axios";

const NotesShowcase = ({
                           folderInfo,
                           parentCallbackForCurrentFolder,
                           parentCallbackForCurrentNote,
                           parentCallbackForAllFolders
                       }) => {
    const {Title} = Typography;
    const addNoteUrl = 'http://localhost:8080/add-note/';
    const deleteFolderUrl = 'http://localhost:8080/delete-folder/'
    const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);

    const addNewNote = () => {
        axios.post(addNoteUrl, {folderId: folderInfo.folderId}).then((res) => {
            parentCallbackForCurrentNote(res.data.newNoteObj);
            parentCallbackForCurrentFolder(res.data.folderObj);
            parentCallbackForAllFolders(res.data.allFolders);
        });
    };

    const deleteFolder = () => {
        axios.post(deleteFolderUrl, {folderId: folderInfo.folderId}).then((res) => {
            if (res.data.deleted) {
                parentCallbackForCurrentNote({});
                parentCallbackForCurrentFolder({});
                parentCallbackForAllFolders(res.data.allFolders);
            }
            setShowDeleteFolderModal(false);
        });
    };

    return (
        <div>
            <List
                header={
                    <div>
                        {!_.isEmpty(folderInfo) &&
                        <Row className='folder-info-header'>
                            <Col span={12}>
                                <Title level={5}>{folderInfo.folderName}</Title>
                            </Col>
                            <Col span={6}>
                                <Button type="primary"
                                        icon={<PlusOutlined/>}
                                        onClick={addNewNote}>
                                    New Note</Button>
                            </Col>
                            <Col span={6}>
                                <Button type="primary"
                                        danger
                                        icon={<DeleteOutlined/>}
                                        onClick={() => setShowDeleteFolderModal(true)}>
                                    Delete Folder</Button>
                            </Col>
                        </Row>
                        }
                    </div>
                }
                bordered
                dataSource={folderInfo.notes}
                className='note-list'
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            className='file-list'
                            title={item.content.split('\n')[0]}
                            description={item.content.split('\n')[1]}
                            onClick={() => parentCallbackForCurrentNote(item)}
                        />
                    </List.Item>
                )}
            />
            <Modal visible={showDeleteFolderModal} onOk={deleteFolder}
                   onCancel={() => setShowDeleteFolderModal(false)}>
                Are you sure you want to delete the folder ?
            </Modal>
        </div>
    );
};

export default NotesShowcase;
