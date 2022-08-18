const {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require("./../firebase/config.js");
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const uploadRouter = express.Router();
uploadRouter.use(fileUpload());

async function updateCodes(fileName) {
  let prevCodes = [];
  const codesSnap = await getDoc(doc(db, "cached", "grc"));
  if (codesSnap.exists()) {
    prevCodes = codesSnap.data().codes;
  }

  fs.readFile(`${__dirname}/../uploads/${fileName}`, "utf8", (err, data) => {
    if (err) {
      console.log("Err", err);
      return;
    }
    const codes_arr = data.split("\r\n").filter((code) => code != "");
    const codes = codes_arr.map((code) => {
      return { code, status: "unused", createdAt: new Date().toDateString() };
    });
    const newCodes = [...prevCodes, ...codes];
    uploadToDB(newCodes);
  });
}
const uploadToDB = async (codes) => {
  const targetDocument = { codes };
  await setDoc(doc(db, "cached", "grc"), targetDocument);
  cleanCodes();
};
async function cleanCodes() {
  const codesSnap = await getDoc(doc(db, "cached", "grc"));
  if (codesSnap.exists()) {
    let codes = codesSnap.data().codes;
    let updated = [];
    for (let i = 0; i < codes.length; i++) {
      if (codes[i].code == undefined) {
        console.log(codes[i]);
        continue;
      }
      updated.push(codes[i]);
    }
    await setDoc(doc(db, "cached", "grc"), { codes: updated });
  }
}
uploadRouter.post("/", async (req, res) => {
  if (!req.files.file) {
    res.status(500).json({ status: "error" });
  }
  const file = req.files.file;
  file.mv(`${__dirname}/../uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "error" });
    }
    updateCodes(file.name);
  });
  res.json({ status: "success" });
});
uploadRouter.get("/", async (req, res) => {
  const snapshot = await getDoc(doc(db, "cached", "grc"));
  if (snapshot.exists()) {
    return res.json({ status: "success", data: snapshot.data().codes });
  }
  res.json({ status: "error" });
});
module.exports = uploadRouter;
