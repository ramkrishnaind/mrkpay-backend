const {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  orderBy,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();

async function fetchPosts() {
  // const foreversPostsRef = collection(db, "foreversPosts");
  const q = query(
    collection(db, "foreversPosts"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) => {
    return { data: doc.data(), id: doc.id };
  });
  return posts;
}

async function getAllPosts(req, res) {
  const posts = await fetchPosts();
  res.json({ status: "success", data: posts });
}
async function getCategoryPosts(req, res) {
  const posts = await fetchPosts();
  const categoryPosts = {};
  const categories = [];
  posts.forEach((post) => {
    const postCategories = post?.data?.categories;
    // console.log("post", post);
    if (postCategories) {
      postCategories.forEach((postCategory) => {
        if (!categories.includes(postCategory)) categories.push(postCategory);
      });
    }
  });
  console.log("categories", categories);
  categories.forEach((category) => {
    const postsCat = [];
    posts.forEach((post) => {
      // console.log("post", post);
      // console.log("category", category);
      const postCategories = post?.data?.categories;
      // console.log("postCategories", postCategories);
      if (
        postCategories &&
        postCategories.length > 0 &&
        postCategories.includes(category.trim())
      ) {
        postsCat.push(post.data);
      }
    });
    // console.log("posts", posts);
    categoryPosts[category] = [...postsCat];
  });

  res.json({ status: "success", data: categoryPosts });
}
async function getAllCategories(req, res) {
  const posts = await fetchPosts();
  const categories = [];
  posts.forEach((post) => {
    const postCategories = post?.data?.categories;
    // console.log("post", post);
    if (postCategories) {
      postCategories.forEach((postCategory) => {
        if (!categories.includes(postCategory)) categories.push(postCategory);
      });
    }
  });
  res.json({ status: "success", data: categories });
}
async function addPost(req, res) {
  const allPosts = await fetchPosts();
  let lastPostId = 0;
  if (allPosts.length > 0) {
    lastPostId = allPosts[allPosts.length - 1].id;
  }
  const { title, details, author, imgUrl, categories } = req.body;
  const post = {
    title,
    details,
    author,
    imgUrl,
    categories,
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
module.exports = {
  getAllPosts,
  addPost,
  deletePost,
  getAllCategories,
  getCategoryPosts,
};
