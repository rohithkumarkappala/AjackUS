document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("index.html")) {
    initDashboard();
  } else if (path.includes("add-edit.html")) {
    initForm();
  }
});

// ---------- DASHBOARD ----------
function initDashboard() {
  let currentPage = 1;
  let itemsPerPage = 10;
  let searchTerm = "";
  let sortBy = "";
  let filters = {};

  const renderList = () => {
    let filtered = [...mockEmployees];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm) ||
          emp.lastName.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filters
    if (filters.firstName) {
      filtered = filtered.filter((emp) =>
        emp.firstName.toLowerCase().includes(filters.firstName)
      );
    }
    if (filters.department) {
      filtered = filtered.filter((emp) =>
        emp.department.toLowerCase().includes(filters.department)
      );
    }
    if (filters.role) {
      filtered = filtered.filter((emp) =>
        emp.role.toLowerCase().includes(filters.role)
      );
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) =>
        a[sortBy].localeCompare(b[sortBy], undefined, { sensitivity: "base" })
      );
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    const container = document.getElementById("employee-list-container");
    container.innerHTML = "";
    if (paginated.length === 0) {
      container.innerHTML = "<p>No employees found.</p>";
    } else {
      paginated.forEach((emp) => {
        const div = document.createElement("div");
        div.className = "employee-card";
        div.innerHTML = `
          <p><strong>ID:</strong> ${emp.id}</p>
          <p><strong>Name:</strong> ${emp.firstName} ${emp.lastName}</p>
          <p><strong>Email:</strong> ${emp.email}</p>
          <p><strong>Department:</strong> ${emp.department}</p>
          <p><strong>Role:</strong> ${emp.role}</p>
          <button onclick="editEmployee(${emp.id})">Edit</button>
          <button onclick="deleteEmployee(${emp.id})">Delete</button>
        `;
        container.appendChild(div);
      });
    }

    renderPagination(totalPages);
  };

  const renderPagination = (totalPages) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    if (totalPages === 0) return;
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.onclick = () => {
        currentPage = i;
        renderList();
      };
      pagination.appendChild(btn);
    }
  };

  // Event bindings
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    renderList();
  });

  document.getElementById("sortBy").addEventListener("change", (e) => {
    sortBy = e.target.value;
    currentPage = 1;
    renderList();
  });

  document.getElementById("toggleFilter").addEventListener("click", () => {
    const filterPanel = document.getElementById("filterPanel");
    filterPanel.classList.toggle("visible");
  });

  document.getElementById("applyFilter").addEventListener("click", () => {
    filters.firstName = document
      .getElementById("filterFirstName")
      .value.toLowerCase().trim();
    filters.department = document
      .getElementById("filterDepartment")
      .value.toLowerCase().trim();
    filters.role = document.getElementById("filterRole").value.toLowerCase().trim();
    currentPage = 1;
    renderList();
  });

  document.getElementById("clearFilter").addEventListener("click", () => {
    filters = {};
    document.getElementById("filterFirstName").value = "";
    document.getElementById("filterDepartment").value = "";
    document.getElementById("filterRole").value = "";
    renderList();
  });

  window.editEmployee = (id) => {
    localStorage.setItem("editId", id);
    window.location.href = "add-edit.html";
  };

  window.deleteEmployee = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      mockEmployees = mockEmployees.filter((emp) => emp.id !== id);
      saveEmployees();
      renderList();
    }
  };

  renderList();
}

// ---------- FORM ----------
function initForm() {
  const id = localStorage.getItem("editId");
  const form = document.getElementById("employeeForm");

  if (id) {
    const emp = mockEmployees.find((e) => e.id == id);
    if (emp) {
      document.getElementById("formTitle").textContent = "Edit Employee";
      document.getElementById("employeeId").value = emp.id;
      document.getElementById("firstName").value = emp.firstName;
      document.getElementById("lastName").value = emp.lastName;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const empId = document.getElementById("employeeId").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();
    const role = document.getElementById("role").value.trim();

    let isValid = true;
    if (!firstName) {
      document.getElementById("errorFirstName").textContent = "First Name is required";
      isValid = false;
    } else {
      document.getElementById("errorFirstName").textContent = "";
    }

    if (!lastName) {
      document.getElementById("errorLastName").textContent = "Last Name is required";
      isValid = false;
    } else {
      document.getElementById("errorLastName").textContent = "";
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById("errorEmail").textContent = "Please enter a valid email";
      isValid = false;
    } else {
      document.getElementById("errorEmail").textContent = "";
    }

    if (!department) {
      document.getElementById("errorDepartment").textContent = "Department is required";
      isValid = false;
    } else {
      document.getElementById("errorDepartment").textContent = "";
    }

    if (!role) {
      document.getElementById("errorRole").textContent = "Role is required";
      isValid = false;
    } else {
      document.getElementById("errorRole").textContent = "";
    }

    if (!isValid) return;

    const newEmp = {
      id: empId ? Number(empId) : Date.now(),
      firstName,
      lastName,
      email,
      department,
      role,
    };

    if (empId) {
      const index = mockEmployees.findIndex((e) => e.id == empId);
      if (index !== -1) {
        mockEmployees[index] = newEmp;
      }
    } else {
      mockEmployees.push(newEmp);
    }

    saveEmployees();
    localStorage.removeItem("editId");
    window.location.href = "index.html";
  });
}