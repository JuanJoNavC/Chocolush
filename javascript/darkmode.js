const toggleBtn = document.getElementById("darkModeToggle");

// Apply mode on page load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleBtn.querySelector("i").classList.remove("fa-moon");
    toggleBtn.querySelector("i").classList.add("fa-sun");
}

toggleBtn.addEventListener("click", () => {
    const icon = toggleBtn.querySelector("i");
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        localStorage.setItem("darkMode", "disabled");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});
