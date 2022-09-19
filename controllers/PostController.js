const {
  doc,
  getDocs,
  collection,
  deleteDoc,
  addDoc,
  query,
  orderBy,
} = require("firebase/firestore");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();
const { client } = require("../redis");
async function fetchPosts() {
  const postMem = await client.get("posts");
  if (postMem) {
    return JSON.parse(postMem);
  } else {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    posts.data.sort((a, b) => {
      if (new Date(a.data.createdAt) < new Date(b.data.createdAt)) return -1;
      else if (new Date(a.data.createdAt) == new Date(b.data.createdAt))
        return 0;
      else return 1;
    });
    client.set("posts", JSON.stringify(posts));
    return posts;
  }
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
        postCategories?.length > 0 &&
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
async function getAllPosts(req, res) {
  const posts = await fetchPosts();
  res.json({ status: "success", data: posts });
}

async function addPost(req, res) {
  const allPosts = await fetchPosts();
  let lastPostId = 0;
  if (allPosts?.length > 0) {
    lastPostId = allPosts[allPosts?.length - 1].id;
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
  const document = await addDoc(collection(db, "posts"), post);
  const catMem = await client.get("posts");
  if (catMem) {
    const prevCategories = JSON.parse(catMem);
    prevCategories.push({ id: document.id, data: post });
    client.set("posts", JSON.stringify(prevCategories));
  } else {
    const snapshot = await getDocs(collection(db, "posts"));
    const prevCategories = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    // prevCategories.push({ id: document.id, data: post });
    client.set("posts", JSON.stringify(prevCategories));
  }
  res.json({ status: "success", data: document });
}
async function deletePost(req, res) {
  const { id } = req.body;
  try {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    const catMem = await client.get("posts");
    if (catMem) {
      const prevCategories = JSON.parse(catMem);
      // prevCategories.data.push();
      client.set(
        "posts",
        JSON.stringify(prevCategories.filter((item) => item.id !== id))
      );
    } else {
      const snapshot = await getDocs(collection(db, "posts"));
      const prevCategories = snapshot.docs.map((doc) => {
        return { data: doc.data(), id: doc.id };
      });
      // prevCategories.data.push();
      client.set("posts", JSON.stringify(prevCategories));
    }
    res.json({ status: "success" });
  } catch (e) {
    res.json({ status: "error" });
  }
}
module.exports = {
  getAllPosts,
  getCategoryPosts,
  getAllCategories,
  addPost,
  deletePost,
};
