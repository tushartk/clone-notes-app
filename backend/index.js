const { v4: uuidv4 } = require('uuid');
const _ = require('lodash')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080;

app.use(express.json());
app.use(cors());

let allFolders = [];

app.get('/get-all-folders', (req, res) => {
    res.json({folders: allFolders});
});

app.post('/create-folder', (req, res) => {
    const newFoldObj = {
        folderId: uuidv4(),
        folderName: req.body.folderName,
        notes: []
    };
    allFolders.push(newFoldObj);
    allFolders = _.sortBy(allFolders, ['folderName']);
    res.json({folders: allFolders, currentFolder: newFoldObj});
});

app.post('/delete-folder', (req, res) => {
    _.remove(allFolders, ['folderId', req.body.folderId]);
    res.json({'deleted': true, allFolders})
});


app.post('/add-note', (req, res) => {
    const currDate = new Date();
    const folderObj = _.find(allFolders, ['folderId', req.body.folderId]);
    const newNoteObj = {
        id: uuidv4(),
        content: '',
        timeCreated: currDate,
        timeModified: currDate,
        folderName: folderObj.folderName
    };
    folderObj.notes.push(newNoteObj);
    folderObj.notes = _.orderBy(folderObj.notes, ['timeModified'], ['desc']);
    res.json({newNoteObj, folderObj, allFolders});
});

app.post('/update-note', (req, res) => {
    const folderObj = _.find(allFolders, ['folderId', req.body.folderId]);
    const noteObj = _.find(folderObj.notes, ['id', req.body.noteId]);
    noteObj.content = req.body.content;
    noteObj.timeModified = new Date();
    folderObj.notes = _.orderBy(folderObj.notes, ['timeModified'], ['desc']);
    res.json({noteObj, folderObj, allFolders});
});

app.post('/delete-note', (req, res) => {
    const folderObj = _.find(allFolders, ['folderId', req.body.folderId]);
    _.remove(folderObj.notes, ['id', req.body.noteId])
    res.json({'deleted': true, folderObj, allFolders})
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
