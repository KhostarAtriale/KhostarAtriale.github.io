// data.js

// Load employees from localStorage or use default data if not found
let employees = JSON.parse(localStorage.getItem('employees')) || [
    { Id: 1, Name: "Mao", Color: "Red", WheelCount: 0, ImagePath: "/images/mao.jpg" },
    { Id: 2, Name: "Archil", Color: "Blue", WheelCount: 0, ImagePath: "/images/archil.jpg" },
    { Id: 3, Name: "Khostar", Color: "Pink", WheelCount: 0, ImagePath: "/images/khostar.jpg" },
    { Id: 4, Name: "Nika Arsena", Color: "Green", WheelCount: 0, ImagePath: "/images/arsena.jpg" },
    { Id: 5, Name: "Nika Tabagari", Color: "Gold", WheelCount: 0, ImagePath: "/images/tabagari.jpg" },
    { Id: 6, Name: "Nika Kirakosiani", Color: "Purple", WheelCount: 0, ImagePath: "/images/kirakosian.jpg" },
    { Id: 7, Name: "Mariam", Color: "Pink", WheelCount: 0, ImagePath: "/images/mariam.jpg" },
    { Id: 8, Name: "Zura", Color: "White", WheelCount: 0, ImagePath: "/images/zura.jpg" },
    { Id: 9, Name: "Bidzina", Color: "Orange", WheelCount: 0, ImagePath: "/images/bidzina.jpg" }
];

// Save employees to localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}
