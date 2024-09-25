/*--------------------Toggle Theme - light and dark theme--------------------*/
function toggleTheme() {
    if (localStorage.getItem("sketch-theme") !== null) {
        if (localStorage.getItem("sketch-theme") === "dark") {
            $("body").addClass("dark");
        } else {
            $("body").removeClass("dark");
        }
    }
    updateIcon();
}
toggleTheme();
$("#darkModeToggle").on("click", function () {
    $("body").toggleClass("dark");
    if ($("body").hasClass("dark")) {
        localStorage.setItem("sketch-theme", "dark");
    } else {
        localStorage.setItem("sketch-theme", "light");
    }
    updateIcon();
});
function updateIcon() {
    if ($("body").hasClass("dark")) {
        $("#darkModeToggle i").removeClass("bx-moon");
        $("#darkModeToggle i").addClass("bx-sun");
    } else {
        $("#darkModeToggle i").removeClass("bx-sun");
        $("#darkModeToggle i").addClass("bx-moon");
    }
}
