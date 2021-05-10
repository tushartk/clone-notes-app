import React, {useState} from 'react';
import './Folder-Navbar.css';
import {Button, Input, Layout, Menu, Modal} from 'antd';
import {
    FolderOutlined,
    FolderAddTwoTone,
    RightOutlined,
    LeftOutlined
} from '@ant-design/icons';
import * as _ from 'lodash';
import axios from "axios";


const FolderNavbar = ({
                          allFolders,
                          parentCallbackForCurrentFolder,
                          parentCallBackForAllFolders,
                          parentCallbackForSearchMode
                      }) => {
    const createFolderUrl = 'http://localhost:8080/create-folder/'
    const {Sider} = Layout;
    const {SubMenu} = Menu;
    const OPEN_KEYS = ['sub1', 'addb'];
    const [openKeys, setOpenKeys] = useState(OPEN_KEYS);
    const onOpenChange = openKeys => setOpenKeys([...OPEN_KEYS, ...openKeys]);
    const [newFolderName, setNewFolderName] = useState('');
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    const addNewFolder = () => {
        if (!newFolderName) {
            return;
        }
        axios.post(createFolderUrl, {folderName: newFolderName}).then((res) => {
            const allFolders = res.data.folders;
            // To update selected Index
            const idxOfInsertion = _.findIndex(allFolders, ['folderName', newFolderName]);
            setSelectedKeys([idxOfInsertion.toString()]);
            setNewFolderName('');
            setShowAddFolderModal(false);
            parentCallbackForSearchMode(false);
            parentCallBackForAllFolders(allFolders);
            parentCallbackForCurrentFolder(res.data.currentFolder);
        });
    };

    const onMenuItemSelected = ({item, key, keyPath, selectedKeys}) => {
        setSelectedKeys(selectedKeys);
        parentCallbackForCurrentFolder(allFolders[key]);
        parentCallbackForSearchMode(false);
    };

    return (
        <div>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(val) => setCollapsed(val)}>
                <Button type="primary" onClick={() => setCollapsed(!collapsed)} style={{marginBottom: 16}}>
                    {
                        collapsed ? <RightOutlined /> : <LeftOutlined />
                    }
                </Button>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode='inline'
                    theme='light'
                    defaultOpenKeys={['sub1', 'addb']}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    selectedKeys={selectedKeys}
                    onSelect={onMenuItemSelected}
                >
                    <SubMenu id='folder-options-submenu' key="sub1"
                             icon={collapsed ? <FolderOutlined className='menu-icon'/> : <FolderOutlined/>}
                             title="All Folders">
                        {!collapsed &&
                        <Menu.ItemGroup key="g1">
                            {
                                allFolders.map((val, i) =>
                                    <Menu.Item key={i}>{val.folderName}</Menu.Item>
                                )
                            }
                        </Menu.ItemGroup>
                        }
                    </SubMenu>
                    <SubMenu id='folder-options-submenu' key='addb'
                             icon={collapsed ? <FolderAddTwoTone className='menu-icon'/> : <FolderAddTwoTone/>}
                             title={
                                 <Button type={'primary'} onClick={() => setShowAddFolderModal(true)}>
                                     New Folder
                                 </Button>
                             }
                    >
                    </SubMenu>
                </Menu>
            </Sider>
            <Modal title="New Folder" visible={showAddFolderModal} onOk={addNewFolder}
                   onCancel={() => setShowAddFolderModal(false)}>
                <Input placeholder="Enter the new folder name" value={newFolderName}
                       onChange={(e) => setNewFolderName(e.target.value)}/>
            </Modal>
        </div>
    );
}

export default FolderNavbar;
