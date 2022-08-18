let counter = 1;
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const { db } = require(`${__dirname}/../firebase/config.js`);
const { sha256 } = require("js-sha256");

async function getLinkDetails(req, res) {
  const encryptedhash = req.query.eh;
  const docRef = doc(db, "mutages", encryptedhash);
  const snapShot = await getDoc(docRef);
  let targetDoc = snapShot.data();
  if (targetDoc) {
    res.json({ status: "success", data: targetDoc });
  } else {
    res.json({ status: "error", data: "No such link exists" });
  }
}
async function generateLink(req, res) {
  const hash = sha256.create();
  const { link, domain } = req.body;
  hash.update(link);
  const encrypted = hash.hex();
  const result = domain + "/" + encrypted;
  const objToStore = {
    decrypted: link,
    encrypted,
    result,
    views: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
    uniqueIps: [],
    id: counter,
  };
  counter += 1;
  await setDoc(doc(db, "mutages", encrypted), objToStore);
  const allDocs = await getDocs(collection(db, "mutages"));
  console.log(allDocs);
  const arr = allDocs.docs.map((obj) => {
    return obj.data();
  });
  res.json({ status: "success", data: arr });
}
async function incrementViews(req, res) {
  const { encryptedhash } = req.body;
  const docRef = doc(db, "mutages", encryptedhash);
  const snapShot = await getDoc(docRef);
  let targetDoc = snapShot.data();
  if (Object.keys(targetDoc).length > 0) {
    targetDoc.views++;
    targetDoc.uniqueIps.push(req.ip);
    await setDoc(docRef, targetDoc);
    res.json({ status: "success", data: targetDoc });
  }
}

module.exports = { getLinkDetails, generateLink, incrementViews };
