$(document).ready(function () {
    const modeText = $("#modeText");

    // Check and apply stored theme
    if (localStorage.getItem("theme") === "dark") {
        enableDarkMode();
        $("#modeToggle").prop("checked", true);
    }

    $("#modeToggle").change(function () {
        if ($(this).is(":checked")) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        $("body").addClass("dark-mode");
        $(".navbar").removeClass("bg-light navbar-light").addClass("bg-dark navbar-dark");
        $(".card").removeClass("bg-light").addClass("bg-dark text-light");
        $(".accordion-item").removeClass("bg-light").addClass("bg-dark text-light");
        $(".list-group-item").addClass("dark-mode");
        $(".btn-dark").removeClass("btn-dark").addClass("btn-light");
        $(".sun-icon").css("opacity", "0");
        $(".moon-icon").css("opacity", "1");
        $(".slider:before").css("transform", "translateX(32px)");
        modeText.text("Enable Light Mode");
        localStorage.setItem("theme", "dark");
    }

    function disableDarkMode() {
        $("body").removeClass("dark-mode");
        $(".navbar").removeClass("bg-dark navbar-dark").addClass("bg-light navbar-light");
        $(".card").removeClass("bg-dark text-light").addClass("bg-light");
        $(".accordion-item").removeClass("bg-dark text-light").addClass("bg-light");
        $(".list-group-item").removeClass("dark-mode");
        $(".btn-light").removeClass("btn-light").addClass("btn-dark");
        $(".sun-icon").css("opacity", "1");
        $(".moon-icon").css("opacity", "0");
        $(".slider:before").css("transform", "translateX(0)");
        modeText.text("Enable Dark Mode");
        localStorage.setItem("theme", "light");
    }

    const roles = ["Cybersecurity Enthusiast", "Software Developer", "Open Source Contributor", "Bug Bounty Hunter"];
    let index = 0;
    function changeText() {
        $('#changing-text').fadeOut(400, function () {
            $(this).text(roles[index]).fadeIn(400);
        });
        index = (index + 1) % roles.length;
    }
    setInterval(changeText, 2000);
});