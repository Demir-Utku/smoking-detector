const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { Storage } = require("@google-cloud/storage");

const bucketName = "bitirme_1";
const storage = new Storage();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000; // Used .env file in the project root directory

// Gets number of files in the Google Cloud Storage bucket and pass it to React app
app.get('/api/length', async (req, res, next) => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    const fileStrings = files.map(file => file.name);
    const fileSliced = fileStrings.map(el => el.slice(9, 11));
    
    for (i = 0; i < fileSliced.length; i++) {
      if (fileSliced[i].includes('.')) {
        fileSliced[i] = fileSliced[i].slice(0, 1);
      }
    }
    const fileNumbers = fileSliced.map(item => parseInt(item, 10));
    const numOfFiles = Math.max(...fileNumbers) + 1;
    const length = {number: numOfFiles};
    res.json(length);
  } catch (e) {
    next(e);
  }
});

// In React, when any image is clicked, post a request to the server with clicked item parameter
// Then, in the popup screen, get this information and display the metadata information for clicked file 
app.get(`/api/:detected`, async(req, res, next) => {
  try {
    let clickedItem = req.params.detected;
    const filename = `/detected/${clickedItem}.jpg`;
    // Gets the metadata for the file
    const [metadata] = await storage
      .bucket(bucketName)
      .file(filename)
      .getMetadata();

    const metadatas =
      {
        id: 0, 
        metadata: `Date: ${metadata.updated.substring(0,10)}, Time: ${metadata.updated.substring(11,19)}`
      };
      /*{
        id: 1, 
        metadata: metadata.metadata.ip
      }*/

    console.log(metadatas.metadata);

    res.json(metadatas);

  } catch (e) {
    next(e);
  }
});

app.get(`/api/ip/:detected`, async (req, res, next) => {
  try {
    let clickedItem = req.params.detected;
    const filename = `/detected/${clickedItem}.jpg`;
    // Gets the metadata for the file
    const [metadata] = await storage
      .bucket(bucketName)
      .file(filename)
      .getMetadata();

    const ip = { id: 0, metadata: metadata.metadata.ip};

    console.log(ip);

    res.json(ip);

  } catch (e) {
    next(e);
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
