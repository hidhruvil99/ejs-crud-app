$("#searchForm").submit(function (e) {
  e.preventDefault();
  const searchQuery = $("#searchInput").val();
  loadUsers(searchQuery);
});
$("#searchInput").keyup(function (e) {
  e.preventDefault();
  const searchQuery = $("#searchInput").val();
  loadUsers(searchQuery);
});

function loadUsers(search = "", page = 1) {
  $.ajax({
    url: `/getUsers?search=${search}&page=${page}&limit=5`,
    method: "GET",
    success: function (data) {
      let usersTable = $("#usersTable tbody");
      usersTable.empty();
      data.users.forEach((user,i) => {
        x = user._id;
        y = x.slice(20, x.length);
        usersTable.append(`
                            <tr>
                           <!-- <td>${user.userId}</td> -->
                            <!--<td>${user._id}</td> -->
                            <td>${((page*5)-5)+i+1}</td>
                            <td><img src="/uploads/${user.userProfile}" height=80px width=80px style="border-radius:55px"></img> </td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td>${user.phone}</td>
                                <td class="action-btns">
                                    <button onclick="editUser('${user._id}')">Edit</button>
                                    <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                                </td>
                            </tr>
                        `);
      });

      let pagination = $(".pagination");
      pagination.empty();
      for (let i = 1; i <= data.totalPages; i++) {
        console.log(`i ${page},current ${data.currentPage}`);
        console.log(page === data.currentPage);
        pagination.append(`
                            <a class=pages  href="#" id="${
                              i === data.currentPage ? "active" : ""
                            }" onclick="loadUsers('${search}', ${i})">${i}</a>
                        `);
      }
    },
  });
}

$("#userForm").submit(function (e) {
  e.preventDefault();
  // let formData = $(this);
  // let formData = new FormData(this);

  const username = $("#username").val().trim();
  const userProfile = $("#userProfile").val();
  const email = $("#email").val().trim();
  const phone = $("#phone").val().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (username === "") {
    // alert("Username is required.");
    toast("Please enter a username");
    return;
  }

  if (userProfile === "") {
    toast("Profile picture is required.");
    return;
  }

  if (!emailRegex.test(email)) {
    toast("Please enter a valid email address.");
    return;
  }

  if (!phoneRegex.test(phone)) {
    toast("Please enter a valid phone number.");
    return;
  }

  console.log("formData");
  let formData = new FormData($("#userForm")[0]);
  for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  $.ajax({
    url: "/addUser",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      greenToast(response.message);
      $("#userForm")[0].reset();
      loadUsers();
    },
    error: function (xhr) {
      if (xhr.status === 400 && xhr.responseJSON) {
        toast(xhr.responseJSON.message);
      } else {
        toast("An unexpected error occurred.");
      }
    },
  });
});

$("#editUserForm").submit(function (e) {
  e.preventDefault();

  const username = $("#editUsername").val().trim();
  // const userProfile = $("#userProfile").val();
  const email = $("#editEmail").val().trim();
  const phone = $("#editPhone").val().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (username === "") {
    // alert("Username is required.");
    toast("Please enter a y username");
    return;
  }

  // if (userProfile === "") {
  //   toast("Profile picture is required.");
  //   return;
  // }

  if (!emailRegex.test(email)) {
    toast("Please enter a valid email address.");
    return;
  }

  if (!phoneRegex.test(phone)) {
    toast("Please enter a valid phone number.");
    return;
  }

  let formData = new FormData(this);
  $.ajax({
    url: "/updateUser", 
    method: "PUT",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      greenToast(response.message);
      $("#editModal").modal("hide");
      loadUsers();
      $("#editUserForm")[0].reset();
    },
    error: function (xhr) {
      toast("Error: " + xhr.responseText);
    },
  });
});

function editUser(id) {
  $.ajax({
    url: "/getUser/" + id,
    method: "GET",
    success: function (user) {
      $("#editUserId").val(user._id);
      $("#editUsername").val(user.username);
      $("#profile").val(user.userProfile);
      $("#editEmail").val(user.email);
      $("#editPhone").val(user.phone);
      $("#editModal").modal("show");

      // $("#editModal").modal('show');
      // $("#userId").val(user._id);
      // $("#username").val(user.username);
      // $("#email").val(user.email);
      // $("#phone").val(user.phone);

      // if (user.userProfile) {
      //   $("#profilePreviews").attr("src", "/uploads/" + user.userProfile);
      //   console.log("image inserted");
      // } else {
      //   console.log("no image set");
      //   $("#profilePreviews").attr("src", "");
      // }
    },
    error: function (xhr) {
      toast("Error loading user: " + xhr.responseText);
    },
  });
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    $.ajax({
      url: "/deleteUser/" + id,
      method: "DELETE",
      success: function (response) {
        greenToast(response.message);
        loadUsers();
      },
    });
  }
}

$(document).ready(function () {
  loadUsers();
});
