const {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();

async function fetchPostCategories() {
  const snapshot = await getDocs(collection(db, "foreversPostCategories"));
  const postCategories = snapshot.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
  return postCategories;
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
    doc(db, "foreversPostCategories", (parseInt(lastPostId) + 1).toString()),
    post
  );
  res.json({ status: "success", data: document });
}
async function deletePostCatgory(req, res) {
  const { id } = req.body;
  try {
    const docRef = doc(db, "foreversPostCategories", id);
    await deleteDoc(docRef);
    res.json({ status: "success" });
  } catch (e) {
    res.json({ status: "error" });
  }
}
module.exports = { getAllPostCategories, addPostCategory, deletePostCatgory };
