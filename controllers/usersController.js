const {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { use } = require("../routers/usersRouter");
const { db } = require(`${__dirname}/../firebase/config.js`);

async function addUser(req, res) {
  const { userName, email, phone, password } = req.body;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.json({ status: "success", id: user.uid });
    })
    .catch((error) => {
      if (error.code == "auth/email-already-in-use") {
        res.json({
          status: "error",
          // data: error,
          message: "Account already exists",
        });
      }
    });
}
async function getUserById(req, res) {
  const { uid } = req.body;
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    res.json({ status: "success", data: docSnap.data() });
  } catch (e) {
    res.json({ status: "error" });
  }
}
async function addGeneratedCoin(req, res) {
  const { uid } = req.body;
  console.log("uid", uid);
  let targetObj;
  try {
    const docRef = doc(db, "users", uid);
    const obj = await getDoc(docRef);
    targetObj = obj.data();
    console.log("targetObj", obj);
    if (targetObj) {
      targetObj.coinsGenerated += 1;
      await setDoc(docRef, targetObj);
      return res.json({ status: "success" });
    }
  } catch (e) {
    return res.json({ status: "error" });
  }
  return res.json({ status: "error" });
}
async function getAllUsers(req, res) {
  const snapshot = await getDocs(collection(db, "users"));
  const users = snapshot.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
  res.json({ status: "success", data: users });
}

module.exports = { addUser, getUserById, getAllUsers, addGeneratedCoin };
