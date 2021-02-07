$(document).ready(function() {

    $(window).resize(function(){
        $(".pic").css({"height" :$(".pic").width() + "px"});
    });

    $("#profile-form").submit(async function(e) {
        e.preventDefault();
        const userData = {
            name: $("#name-input").val(),
            email: $("#email-input").val(),
            location: $("#location-input").val(),
            bio: $("#bio-input").val()
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        };
        const response = await fetch("/user/edit-profile", options);
        console.log(response)
        if (response.redirected)
            window.location.href = response.url;
    });

    $("#change-password").click(function() {
        $("#change-password-popup").fadeIn(400);
        $("#new-pass2").on("input", function() {
            if ($(this).val() === $("#new-pass1").val())
                $("#submit-pass-change").removeClass("unavailable");
            else
                $("#submit-pass-change").addClass("unavailable");
        });
        $("#change-password-form").submit(async function(event) {
            event.preventDefault();
            if ($("#submit-pass-change").hasClass("unavailable")) return;
            const oldPass = $("#old-pass").val();
            const newPass = $("#new-pass1").val();
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({oldPass: oldPass, newPass: newPass})
            };
            const response = await fetch("/user/change-password", options);
            const json = await response.json();
            if (response.status === 401) {
                console.warn(json.message);
                $("#wrong-old-pass").css("opacity", "1");
            }
            else {
                console.log(json.message);
                $("#wrong-old-pass").css("opacity", "0");
                $("#change-password-popup").fadeOut(400)
            }
        });

        $(".close-icon").click(function() {
            $("#change-password-popup").fadeOut(400);
        });
    });

    $("#delete-account").click(function() {
        $("#delete-account-popup").fadeIn(400);

        $(".close-icon").click(function() {
            $("#delete-account-popup").fadeOut(400);
        });
        $("#no-delete").click(function() {
            $("#delete-account-popup").fadeOut(400);
        });
        $("#yes-delete").click(async function() {
            const response = await fetch("/user/delete-account", { method: "POST", headers: { "Content-Type": "applications/json" }});
            console.log(response);
            if (response.redirected)
                window.location.href = response.url;
        });
    });

    $("#signout").click(async function() {
        const response = await fetch("/user/signout", { method: "GET", headers: { "Content-Type": "application/json" }});
        console.log(response);
        if (response.redirected)
            window.location.href = response.url;
    })
});

$.get("/user/profile-info", function(user) {
    $("#name-input").val(user.name);
    $("#email-input").val(user.email);
    $("#location-input").val(user.location);
    $("#bio-input").val(user.bio);
});

$.ajax({
    url: '/user/picture',
    type: 'GET',
    success: function(data){
        $("#user-icon>img").attr("src", data);
        $(".user-info-image>img").attr("src", data);
        $(".pic>img").attr("src", data);
        $(".pic").css({"height" :$(".pic").width() + "px"});
    },
    error: function(data) {
        $("#user-icon>img").attr("src", "../images/userIcon.svg");
        $(".user-info-image>img").attr("src", "../images/userIcon.svg");
        $(".pic>img").attr("src", "../images/userIcon.svg");
        $(".pic").css({"height" :$(".pic").width() + "px"});
        console.warn('Could not load profile picture. You must authenticate.');
    }
});