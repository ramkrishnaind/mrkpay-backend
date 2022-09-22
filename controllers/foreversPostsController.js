const {
  doc,
  addDoc,
  setDoc,
  getDocs,
  collection,
  query,
  orderBy,
  deleteDoc,
} = require("firebase/firestore");
// const redis = require("redis");
// const client = redis.createClient();
// client.on("connect", function () {
//   console.log("Connected!");
// });
const { client } = require("../redis");
const { db } = require(`${__dirname}/../firebase/config.js`);
const currentdate = new Date();

async function fetchPosts() {
  // const foreversPostsRef = collection(db, "foreversPosts");
  // return new Promise((resolve, reject) => {
  const postMem = await client.get("foreversPosts");
  if (postMem) {
    const posts = JSON.parse(postMem);
    posts.sort((a, b) => {
      // debugger;
      return (
        new Date(b.data.createdAt).getTime() -
        new Date(a.data.createdAt).getTime()
      );
      // if (
      //   new Date(a.data.createdAt).getTime() <
      //   new Date(b.data.createdAt).getTime()
      // )
      //   return -1;
      // else if (
      //   new Date(a.data.createdAt).getTime() ==
      //   new Date(b.data.createdAt).getTime()
      // )
      //   return 0;
      // else return 1;
    });
    return posts;
  } else {
    const q = query(
      collection(db, "foreversPosts")
      // orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    posts?.sort((a, b) => {
      return (
        new Date(b.data.createdAt).getTime() -
        new Date(a.data.createdAt).getTime()
      );
    });
    client.set("foreversPosts", JSON.stringify(posts));
    return posts;
  }
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
  const document = await addDoc(collection(db, "foreversPosts"), post);
  const catMem = await client.get("foreversPosts");
  if (catMem) {
    const prevCategories = JSON.parse(catMem);
    prevCategories.push({ id: document.id, data: post });
    client.set("foreversPosts", JSON.stringify(prevCategories));
  } else {
    const snapshot = await getDocs(collection(db, "foreversPosts"));
    const prevCategories = snapshot.docs.map((doc) => {
      return { data: doc.data(), id: doc.id };
    });
    prevCategories.push({ id: document.id, data: post });
    client.set("foreversPosts", JSON.stringify(prevCategories));
  }
  res.json({ status: "success", data: document });
}
async function deletePost(req, res) {
  const { id } = req.body;
  try {
    const docRef = doc(db, "foreversPosts", id);
    await deleteDoc(docRef);
    const catMem = await client.get("foreversPosts");
    if (catMem) {
      const prevCategories = JSON.parse(catMem);
      // prevCategories.data.push();
      client.set(
        "foreversPosts",
        JSON.stringify(prevCategories.filter((item) => item.id !== id))
      );
    } else {
      const snapshot = await getDocs(collection(db, "foreversPosts"));
      const prevCategories = snapshot.docs.map((doc) => {
        return { data: doc.data(), id: doc.id };
      });
      // prevCategories.data.push();
      client.set("foreversPosts", JSON.stringify(prevCategories));
    }
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
