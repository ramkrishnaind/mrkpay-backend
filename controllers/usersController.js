const {
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
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
    const coinsRef = collection(db, "coinTransaction");
    // const coinsRef = doc(db, "coinTransaction", uid);
    const obj = await getDoc(docRef);
    // const objCoins = await getDoc(coinsRef);
    const q = query(
      coinsRef,
      where("createdBy", "==", uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    targetObj = {
      createdBy: uid,
      createdAt: new Date().toISOString(),
    };
    const coinSnapshot = await getDocs(q);
    if (
      coinSnapshot.size === 0 ||
      coinSnapshot.docs[0].data().createdAt.slice(0, 10) !==
        new Date().toISOString().slice(0, 10)
    ) {
      targetObj.coinsGenerated = 1;
      const document = await addDoc(
        collection(db, "coinTransaction"),
        targetObj
      );
      return res.json({ status: "success" });
    } else {
      const key = coinSnapshot.docs[0].id;
      // doc.data() is never undefined for query doc snapshots
      const coinData = coinSnapshot.docs[0].data();
      targetObj.coinGenerated = (coinData?.coinGenerated || 0) + 1;
      const document = await setDoc(doc(db, "coinTransaction", key), targetObj);
      return res.json({ status: "success" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ status: "error" });
  }
}
async function getAllUsers(req, res) {
  const snapshot = await getDocs(collection(db, "users"));
  const users = snapshot.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
  res.json({ status: "success", data: users });
}

module.exports = { addUser, getUserById, getAllUsers, addGeneratedCoin };
