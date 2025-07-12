// Initialize mockEmployees from localStorage or use default data
let mockEmployees = JSON.parse(localStorage.getItem("employees")) || [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "HR",
    role: "Manager",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    department: "Engineering",
    role: "Developer",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    department: "Marketing",
    role: "Executive",
  },
];

// Function to save employees to localStorage
function saveEmployees() {
  localStorage.setItem("employees", JSON.stringify(mockEmployees));
}