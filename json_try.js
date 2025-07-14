<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Save Name and Age</title>
</head>
<body>
  <h2>Enter Your Details</h2>
  <form id="userForm">
    <input type="text" id="nameInput" placeholder="Enter name" required />
    <input type="number" id="ageInput" placeholder="Enter age" required />
    <button type="submit">Submit</button>
  </form>

  <h3>Saved Users:</h3>
  <ul id="userList"></ul>

  <script>
    // Load existing users from localStorage
    window.onload = function() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const list = document.getElementById("userList");

      users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = Name: ${user.name}, Age: ${user.age};
        list.appendChild(li);
      });
    }

    // Handle form submission
    document.getElementById("userForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById("nameInput").value.trim();
      const age = document.getElementById("ageInput").value.trim();

      if (name !== "" && age !== "") {
        const user = { name, age };
        let users = JSON.parse(localStorage.getItem("users")) || [];

        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        const li = document.createElement("li");
        li.textContent = Name: ${user.name}, Age: ${user.age};
        document.getElementById("userList").appendChild(li);

        document.getElementById("userForm").reset(); // clear form
      }
    });
  </script>
</body>
</html>