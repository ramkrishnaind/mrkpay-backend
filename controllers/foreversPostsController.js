const {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();

async function fetchPosts() {
  const snapshot = await getDocs(collection(db, "foreversPosts"));
  const posts = snapshot.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
  return posts;
}

async function getAllPosts(req, res) {
  const posts = await fetchPosts();
  res.json({ status: "success", data: posts });
}

async function addPost(req, res) {
  const allPosts = await fetchPosts();
  let lastPostId = 0;
  if (allPosts.length > 0) {
    lastPostId = allPosts[allPosts.length - 1].id;
  }
  const { title, details, author, imgUrl } = req.body;
  const post = {
    title,
    details,
    author,
    imgUrl,
    createdAt: currentdate.toISOString(),
  };
  const document = await setDoc(
    doc(db, "foreversPosts", (parseInt(lastPostId) + 1).toString()),
    post
  );
  res.json({ status: "success", data: document });
}
async function deletePost(req, res) {
  const { id } = req.body;
  try {
    const docRef = doc(db, "foreversPosts", id);
    await deleteDoc(docRef);
    res.json({ status: "success" });
  } catch (e) {
    res.json({ status: "error" });
  }
}
module.exports = { getAllPosts, addPost, deletePost };
