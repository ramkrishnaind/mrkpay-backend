const {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} = require("firebase/firestore");
const { client } = require("../redis");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();

async function fetchPostCategories() {
  const catMem = await client.get("mrkPayPostCategories");
  if (catMem) {
    return JSON.parse(catMem);
  } else {
    const snapshot = await getDocs(collection(db, "mrkPayPostCategories"));
    const postCategories = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    client.set("mrkPayPostCategories", JSON.stringify(postCategories));
    return postCategories;
  }
}

async function getAllPostCategories(req, res) {
  const postCategories = await fetchPostCategories();
  res.json({ status: "success", data: postCategories });
}

async function addPostCategory(req, res) {
  const allPosts = await fetchPostCategories();
  let lastPostId = 0;
  if (allPosts.length > 0) {
    lastPostId = allPosts[allPosts?.length - 1].id;
  }
  const { name } = req.body;
  const post = {
    name,
    createdAt: currentdate.toISOString(),
  };
  const document = await setDoc(
    doc(db, "mrkPayPostCategories", (parseInt(lastPostId) + 1).toString()),
    post
  );
  const catMem = await client.get("mrkPayPostCategories");
  if (catMem) {
    const prevCategories = JSON.parse(catMem);
    prevCategories.push();
    client.set("mrkPayPostCategories", JSON.stringify(prevCategories));
  } else {
    const snapshot = await getDocs(collection(db, "mrkPayPostCategories"));
    const prevCategories = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    prevCategories.push();
    client.set("mrkPayPostCategories", JSON.stringify(prevCategories));
  }
  res.json({ status: "success", data: document });
}
async function deletePostCatgory(req, res) {
  const { id } = req.body;
  try {
    const docRef = doc(db, "mrkPayPostCategories", id);
    await deleteDoc(docRef);
    const catMem = await client.get("mrkPayPostCategories");
    if (catMem) {
      const prevCategories = JSON.parse(catMem);
      // prevCategories.data.push();
      client.set(
        "mrkPayPostCategories",
        JSON.stringify(prevCategories.filter((item) => item.id !== id))
      );
    } else {
      const snapshot = await getDocs(collection(db, "mrkPayPostCategories"));
      const prevCategories = snapshot.docs.map((doc) => {
        return { data: doc.data(), id: doc.id };
      });
      // prevCategories.data.push();
      client.set("mrkPayPostCategories", JSON.stringify(prevCategories));
    }
    res.json({ status: "success" });
  } catch (e) {
    res.json({ status: "error" });
  }
}
module.exports = { getAllPostCategories, addPostCategory, deletePostCatgory };
