/**
 * ***************
 * ****************
 * The-Requirements-part
 */
const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");
app.use(express.json());
app.use(express.static("./public"));

/**
 * ***************+
 * ****************
 * Image-Upload-Boilerplate
 */
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});

/**
 * ***************+
 * ****************
 * The Request start
 */

/**
 * ***************+
 * ****************
 * IMAGES
 */
app.get("/images", (req, res) => {
  return db
    .getImages()
    .then((results) => {
      console.log("Hey we are making some images here!!!");
      res.json(results.rows);
    })
    .catch((error) => {
      console.log("You are in the error zone !", error);
    });
});
/**
 * ***************+
 * ****************
 * Upload
 */
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  if (req.file) {
    return db
      .getInfo(
        "https://s3.amazonaws.com/spicedling/" + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
      )
      .then((results) => {
        console.log(results.rows);
        res.json(results.rows);
      });
  } else {
    res.json({
      success: false,
    });
  }
});
/**
 * ***************+
 * ****************
 * GET-IMAGES
 */
app.post("/getImage", (req, res) => {
  let emArray = [];
  console.log(emArray);
  return db
    .getImage(req.body.id)
    .then((results) => {
      emArray.push(results.rows[0]);
      console.log("All the information", emArray);
    })
    .then(() => {
      return db.commentDb(req.body.id).then((results) => {
        emArray.push(results.rows);
        res.json(emArray);
      });
    })
    .catch((error) => {
      console.log("you are in the error zone!!!", error);
    });
});
/**
 * ***************+
 * ****************
 * GET-Posts
 */
app.post("/getPost", (req, res) => {
  console.log("I am in the getPost place");
  let rb = req.body;
  return db
    .addComment(rb.username, rb.comment, rb.image_id)
    .then((results) => {
      console.log("results are on my way ", results);
      console.log("results are on my way ", results.rows);
      res.json(results.rows);
    })
    .catch((errors) => {
      console.log("This is an error inside getPost", errors);
    });
});
/**
 * ***************+
 * ****************
 * GET-More-Images
 */
app.post("/getMImages", (req, res) => {
  return db
    .moreImages(req.body.id)
    .then((results) => {
      console.log("Here ae you results printed", results);
      res.json(results.rows);
      console.log("here are the results of results.rows", results.rows);
    })
    .catch((error) => {
      console.log("You are catching an error here", error);
    });
});

/**
 *End
 */

app.listen(process.env.PORT || 8080);
