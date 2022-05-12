var originalButtonText = ""; 
$(document).ready(function () {
    originalButtonText = $("#btnSubmitContactRequest").val();
});

// Set on the ContactForm.cshtml page and is called when the AJAX request succeeds.
function ContactRequestSucceeded() {
    // See if there is a page to redirect to after the details have been saved
    if ($("#PostRequestRedirectPageName").length) {
        document.location = $("#PostRequestRedirectPageUrl").val();
    }

    $("#divContactForm").hide();
    $("#divContactRequestSuccess").fadeIn("fast");


    $("html,body").animate({
        scrollTop: $("#divContactRequestSuccess").offset().top - 20
    }, 500);
}

function ContactRequestBegin() {
    var response = grecaptcha.getResponse();
    $("#btnSubmitContactRequest").attr("disabled", "disabled");
    $("#btnSubmitContactRequest").val("Sending...");
    if (response.length == 0) {
        alert("Please tick the 'I'm not a robot' box.")
        enableSubmit();
        return false;
    }    
}

function ContactRequestFailed() {
    alert("Sorry, something went wrong and your contact request could not be completed.");
    enableSubmit();
}

function enableSubmit() {
    $("#btnSubmitContactRequest").val(originalButtonText);
    $("#btnSubmitContactRequest").removeAttr("disabled");
}