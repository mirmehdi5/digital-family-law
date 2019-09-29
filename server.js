const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const data = require("./routes/api/data");

const API_PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/data", data);
//app.use(logger("dev"));

const dbRoute =
  "mongodb+srv://Mir:Ontario123@digitalfamilylawrecord-bdwhj.mongodb.net/dflr?retryWrites=true&w=majority";

mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
//init gfs
let gfs;
db.once("open", () => {
  console.log("connected to the database");
  //init stream
  gfs = new mongoose.mongo.GridFSBucket(db.db, {
    bucketName: "uploads"
  });
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//create Storage engine
const storage = new GridFsStorage({
  url: dbRoute,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);

        const metadata = {
          docTitle: req.body.docTitle,
          docType: req.body.docType,
          fillingParty: req.body.fillingParty
        };

        const fileInfo = {
          filename: filename,
          metadata,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

//@route POST / upload
//@desc  Uploads file to db
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    file: req.file
  });
  // res.redirect('/')
});

//@route GET / files
//@des Display all files in JSON
app.get("/files", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length == 0) {
      return res.status(400).json({
        err: "No files exist"
      });
    }
    //Files exist
    return res.json(files);
  });
});

//@route GET /files/:filename
//@des Display single file in JSON
app.get("/files/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(400).json({
        err: "No file exists"
      });
    }

    return res.json(file);
  });
});

//@route GET /image/:filename
//@des Display image
app.get("/read/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }

    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

// launch our backend into a port
app.listen(process.env.PORT, () => console.log(`LISTENING ON PROD`));
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
