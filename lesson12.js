// ============================================================
// LESSON 12: Working with APIs
// ============================================================

// ============================================================
// TASK 12.1: Fetch API Basics
// ============================================================

// Exercise 1: Your First Fetch
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => {
    console.log("Response object:", response);
    console.log("Status:", response.status);
    console.log("OK:", response.ok);
    return response.json();
  })
  .then((data) => {
    console.log("User data:", data);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

// Exercise 2: Fetch with Async/Await
async function getUser(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

// Practice: Fetch and display
// 1. A single user
async function fetchSingleUser() {
  const user = await getUser(1);
  console.log("Single user:", user);
}

// 2. All users
async function fetchAllUsers() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  const users = await response.json();
  console.log("All users:", users);
  return users;
}

// 3. Posts for user 1
async function fetchUserPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users/1/posts"
  );
  const posts = await response.json();
  console.log("User 1 posts:", posts);
  return posts;
}

fetchSingleUser();
fetchAllUsers();
fetchUserPosts();

// ============================================================
// TASK 12.2: Display API Data in DOM
// ============================================================

async function loadUsers() {
  const loading = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const container = document.getElementById("users-container");

  try {
    loading.classList.remove("hidden");
    container.innerHTML = "";

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    errorDiv.textContent = `Error: ${error.message}`;
    errorDiv.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayUsers(users) {
  const container = document.getElementById("users-container");
  container.innerHTML = "";
  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p>@${user.username}</p>
      <p>${user.email}</p>
      <p>${user.address.city}</p>
    `;
    container.appendChild(card);
  });
}

// ============================================================
// TASK 12.3: POST Requests
// ============================================================

async function createPost(title, body, userId) {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

async function runPostExample() {
  try {
    const newPost = await createPost(
      "My First Post",
      "This is the content of my post.",
      1
    );
    console.log("Created:", newPost);
  } catch (err) {
    console.error("Error creating post:", err);
  }
}

runPostExample();

// ============================================================
// TASK 12.4: Search & Filter
// ============================================================

let allUsers = [];

async function init() {
  allUsers = await fetchAllUsers();
  displayUsers(allUsers);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    displayUsers(filtered);
  });
}

init();
