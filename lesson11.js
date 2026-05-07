// ============================================================
// LESSON 11: Callbacks, Promises & Async/Await
// ============================================================

// ============================================================
// TASK 11.1: Understanding Async
// ============================================================

// Exercise 1: Predict the output
// Answer: A, C, E, B, D
// Reason: console.log runs synchronously; setTimeouts go to the callback queue.
// Even setTimeout(..., 0) waits for the call stack to clear before running.
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");
// Output order: A, C, E, B, D

// Exercise 2: Callback Pattern - loadUser
function loadUser(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: "John Doe", email: "john@example.com" };
    callback(user);
  }, 1500); // Simulates 1.5 second database lookup
}

// Usage:
loadUser(1, function (user) {
  console.log("User loaded:", user);
});

// ============================================================
// TASK 11.2: Callback Hell & Introduction to Promises
// ============================================================

// Exercise 1: Experience Callback Hell
function getUserData(userId, callback) {
  setTimeout(() => {
    callback({ id: userId, name: "John" });
  }, 1000);
}

function getUserPosts(userId, callback) {
  setTimeout(() => {
    callback([
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ]);
  }, 1000);
}

function getPostComments(postId, callback) {
  setTimeout(() => {
    callback([
      { id: 1, text: "Great post!" },
      { id: 2, text: "Thanks for sharing" },
    ]);
  }, 1000);
}

// The callback hell version:
getUserData(1, function (user) {
  console.log("User:", user);
  getUserPosts(user.id, function (posts) {
    console.log("Posts:", posts);
    getPostComments(posts[0].id, function (comments) {
      console.log("Comments:", comments);
    });
  });
});

// Exercise 2: Refactor getUserData to return a Promise
function getUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "John" });
      } else {
        reject("Invalid user ID");
      }
    }, 1000);
  });
}

function getUserPostsPromise(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ]);
    }, 1000);
  });
}

function getPostCommentsPromise(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post!" },
        { id: 2, text: "Thanks for sharing" },
      ]);
    }, 1000);
  });
}

// ============================================================
// TASK 11.3: Promise Chaining
// ============================================================

// Exercise 1: Chain Promises
getUserDataPromise(1)
  .then((user) => {
    console.log("User:", user);
    return getUserPostsPromise(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return getPostCommentsPromise(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Exercise 2: Promise.all - Fetch 3 users simultaneously
const promise1 = getUserDataPromise(1);
const promise2 = getUserDataPromise(2);
const promise3 = getUserDataPromise(3);

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log("All users:", results);
  })
  .catch((error) => {
    console.error("One failed:", error);
  });

// Exercise 3: Promise.race
const fast = new Promise((resolve) => setTimeout(() => resolve("Fast!"), 500));
const slow = new Promise((resolve) => setTimeout(() => resolve("Slow!"), 2000));

Promise.race([fast, slow]).then((result) => {
  console.log("Winner:", result); // "Fast!"
});

// Build: Fetch data for 3 users simultaneously and display at once
Promise.all([
  getUserDataPromise(1),
  getUserDataPromise(2),
  getUserDataPromise(3),
]).then((users) => {
  users.forEach((user) => console.log("Simultaneous user:", user));
});

// ============================================================
// TASK 11.4: Async/Await
// ============================================================

// Exercise 1: Converting Promise chain to Async/Await
async function getDataWithAsync() {
  const user = await getUserDataPromise(1);
  const posts = await getUserPostsPromise(user.id);
  const comments = await getPostCommentsPromise(posts[0].id);
  return comments;
}

getDataWithAsync().then((comments) => console.log("Async comments:", comments));

// Exercise 2: Error Handling with Try/Catch
async function fetchUserData(userId) {
  try {
    const user = await getUserDataPromise(userId);
    const posts = await getUserPostsPromise(user.id);
    return { user, posts };
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error; // Re-throw if needed
  }
}

fetchUserData(1).then((data) => console.log("Fetched:", data));
fetchUserData(-1).catch((err) => console.log("Caught expected error:", err));

// Exercise 3: Parallel with Async/Await (efficient!)
async function getAllUsers() {
  // Sequential (slow) - waits one by one:
  // const user1 = await getUserDataPromise(1);
  // const user2 = await getUserDataPromise(2);

  // Parallel (fast) - kicks off all at once:
  const [user1, user2, user3] = await Promise.all([
    getUserDataPromise(1),
    getUserDataPromise(2),
    getUserDataPromise(3),
  ]);
  return [user1, user2, user3];
}

getAllUsers().then((users) => console.log("All users (parallel):", users));

// Build: Rewrite the callback hell example using async/await
async function getFullDataAsync() {
  try {
    const user = await getUserDataPromise(1);
    console.log("User:", user);
    const posts = await getUserPostsPromise(user.id);
    console.log("Posts:", posts);
    const comments = await getPostCommentsPromise(posts[0].id);
    console.log("Comments:", comments);
  } catch (error) {
    console.error("Error:", error);
  }
}

getFullDataAsync();
