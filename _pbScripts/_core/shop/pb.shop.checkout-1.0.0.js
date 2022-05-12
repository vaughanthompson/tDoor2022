// NOTE: Must have checkoutCartId AND forgotPasswordLink variables set on the checkout page.

$(document).ready(function () {
    $("#btnContinueAsGuest").click(function () {
        continueAsGuest();
    });

    $("#btnLoginRegister").click(function () {
        loginRegister();
    });

    $("#txtPassword").keypress(function (event) {
        if (event.which == 13) {
            loginRegister();
        }
    });

    $("#lnkChangeEmail").click(function () {
        changeEmail();
    });

    $("#CountryId").change(function () {
        updateCheckoutFreightZoneSelector($(this).val());
    });


    // If the Enter key is pressed in the discount code box, 
    // don't submit the form but rather check the code.
    $("#Code").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            processDiscountCode();
        }
    });

    $("#btnCheckCode").click(function () {
        processDiscountCode();
    });

    setupCart();
    setupFreightZoneSelector();

});

function processDiscountCode() {
    var code = $("#Code").val();

    if (code.length < 1) {
        $("#Code").focus();
        return;
    }

    var originalText = $("#btnCheckCode").val();
    $("#btnCheckCode").val("Checking code...")
    $("#btnCheckCode").attr("disabled", "disabled");

    $("#divValidCode").hide();
    $("#divInvalidCode").hide();

    var freightZoneId = $("#FreightZoneId").val();
    var priceBeforeDiscountAndFreight = $("#PriceBeforeDiscountAndFreight").val();
    
    $.post("/pbShop/AddDiscountCodeToCart", { freightZoneId: freightZoneId, cartId: checkoutCartId, code: code, priceBeforeDiscountAndFreight: priceBeforeDiscountAndFreight })
         .done(function (data) {
             
             if (data.IsValid) {
                 $("#divCartDisplay").replaceWith(data.CartHtml);
                 $("#divDiscountCodeResult").html(data.Description);
                 $("#divValidCode").show();
                 // Setup the cart functionality
                 setupCart();
                 
             } else {
                 $("#divDiscountCodeResult").html("<p>The voucher code was not valid.</p>");
                 $("#divInvalidCode").show();
             }

             $("#btnCheckCode").val(originalText)
             $("#btnCheckCode").removeAttr("disabled");

         });
}

function forgotPassword() {
    var email = $("#txtEmail").val();
    document.location = forgotPasswordLink + "?email=" + email;
}

function setupCart() {
    $(".pb-cart-quant").change(function () {
        var productId = $(this).attr("data-productid");
        var quanity = $(this).val();
        updateCartQuantity(productId, quanity);
    });

    $(".pb-cart-removeline").click(function () {
        if (confirm("Are you sure you wish to remove this line from the cart?")) {
            var productId = $(this).attr("data-productid");
            updateCartQuantity(productId, -1); // -1 to remove line
        }

    });
}

function updateCheckoutFreightZoneSelector(countryId) {

    // Disable the inputs while the cart updates.
    $("#FreightZoneId").attr("disabled", "disabled");
    $("btnSubmit").attr("disabled", "disabled");

    // Get's the freight zone selector and also saves the countryid onto the cart.
    $.post("/pbShop/GetCheckoutFreightZoneSelector", { cartId: checkoutCartId, countryId: countryId  })
         .done(function (data) {
             $("#divFreightZone").html(data);
             setupFreightZoneSelector();
             var freightZoneId = $("#FreightZoneId").val();

             getCartHtml(freightZoneId);
             $("btnSubmit").removeAttr("disabled");

         });
}

function setupFreightZoneSelector() {
    $("#FreightZoneId").change(function () {
        getCartHtml($(this).val());
    });
}

function getCartHtml(freightZoneId) {

    if (freightZoneId == "") {
        $("#pChooseFreightText").show();
        $("#btnSubmit").attr("disabled", "disabled");
    }
    else {
        $("#pChooseFreightText").hide();
        $("#btnSubmit").removeAttr("disabled");
    }

    $.post("/pbShop/GetCartHtml", { freightZoneId: freightZoneId, cartId: checkoutCartId })
         .done(function (data) {
             $("#divCartDisplay").replaceWith(data.Html);
             var freightDisplay = "";
             if (data.FreightAmountDisplay.length > 0) {
                 freightDisplay = "Freight amount: " + data.FreightAmountDisplay;
             }
             $(".freightAmountDisplay").html(freightDisplay);
             setupCart();
         });
}

function updateCartQuantity(productId, quantity) {

    var freightZoneId = $("#FreightZoneId").val();

    // Disable the inputs while the cart updates.
    $("#divCartDisplay").find("select").attr("disabled", "disabled");
    $("#divCartDisplay").find("a").unbind("click").removeAttr("href");
    $.post("/pbShop/SaveCartProductQuantity", { productId: productId, quantity: quantity, cartId: checkoutCartId, freightZoneId: freightZoneId })
         .done(function (data) {
             $("#divCartDisplay").replaceWith(data.ShopCartHtml);
             pb_Shop_Core.updateCartSummaryLink(data.CartSummaryHtml);
             setupCart();
         });
}

function changeEmail() {
    // Make sure they are signed out if changing email.
    $.post("/Account/CheckoutSignOut")
         .done(function (data) {
             $("#divCheckoutDetails").hide();
             $("#divCheckoutDetailsTop").hide();

             $("#divSignInOption").fadeIn("fast");
             $("#divSignInOptionTop").fadeIn("fast");
             var title = "Checkout. 1 of 4";
             $("#hPageTitle").html();
             $(document).prop('title', title);
             // Update the progress bar
             $("#divProgress2").removeClass("progress");
             $("#divProgress1").addClass("progress");
             scrollToElement("#hPageTitle");
         });
}

var valErrorClass = "validationError";

function clearLoginErrors() {
    $("#divLoginErrors").hide();
    $("#lblEmail").removeClass(valErrorClass);
    $("#lblPassword").removeClass(valErrorClass);
    $("#txtEmail").removeClass(valErrorClass);
    $("#txtPassword").removeClass(valErrorClass);
}

function setValidationError(itemLabelId, itemFieldId) {
    $("#" + itemLabelId).addClass(valErrorClass);
    $("#" + itemFieldId).addClass(valErrorClass);
}

function loginRegister() {

    clearLoginErrors();

    var email = $("#txtEmail").val();
    var password = $("#txtPassword").val();
    var errorText = "";
    if (email.length < 1) {
        errorText += "<p>Please enter your email address</p>";
        setValidationError("lblEmail", "txtEmail");
    }

    if (password.length < 5) {
        errorText += "<p>Please enter a password that is 5 characters or more.</p>";
        setValidationError("lblPassword", "txtPassword");
    }

    if (errorText.length > 0) {
        setLoginError(errorText);
    } else {
        var initialButtonText = $("#btnLoginRegister").val();
        $("#btnLoginRegister").val("Loading...");
        $("#btnLoginRegister").attr("disabled", "disabled");
        $.post("/Account/CheckoutLoginOrRegister", { email: email, password: password})
          .done(function (data) {
              $("#btnLoginRegister").removeAttr("disabled");
              $("#btnLoginRegister").val(initialButtonText);

              if (data.LoginSuccess) {
                  // Success: Show the form with values loaded...
                  if (data.IsExisting) {
                      $("[name='FirstName']").val(data.FirstName);
                      $("[name='LastName']").val(data.LastName);
                      $("[name='MobilePhone']").val(data.MobilePhone);
                      $("[name='Phone']").val(data.Phone);

                      $("[name='DeliveryAddress']").val(data.DeliveryAddress);
                      $("[name='DeliveryAddress2']").val(data.DeliveryAddress2);
                      $("[name='DeliveryCity']").val(data.DeliveryCity);
                      $("[name='DeliveryPostcode']").val(data.DeliveryPostcode);
                      $("[name='DeliveryCountryId']").val(data.DeliveryCountryId);
                  }

                  $("[name='Email']").attr("readonly", "readonly").addClass("readonly");
                  $("[name='Email']").val(email);

                  showCheckoutDetails(true);
              }
              else {
                  // There was an issue, process the errors.


                  // Possible returned error keys: InvalidEmail InvalidPassword InvalidEmailPasswordCombination
                  for (var i = 0; i < data.Errors.length; i++) {
                      var errorKey = data.Errors[i].ErrorKey;
                      switch (errorKey) {
                          case "InvalidEmail":
                              errorText += "<div>Please enter a valid email address.</div>";
                              setValidationError("lblEmail", "txtEmail");
                              break;

                          case "InvalidPassword":
                              errorText += "<div>Please enter a valid password.</div>";
                              setValidationError("lblPassword", "txtPassword");
                              break;

                          case "InvalidEmailPasswordCombination":
                              errorText += "<div>Incorrect email/password combination.</div>";
                              setValidationError("lblEmail", "txtEmail");
                              setValidationError("lblPassword", "txtPassword");
                              break;

                          default:
                              errorText += "<div>An unknown error has occurred.</div>";
                              break;
                      }
                  }

                  if (errorText.length > 0) {
                      setLoginError(errorText);
                  }
              }
          });
    }
}

function setLoginError(errorText) {
    $("#divLoginErrors").show();
    $("#divErrorDetails").html(errorText);
    scrollToElement("#divLoginErrors");
}

function scrollToElement(element) {
    // Scroll to the errors
    $("html, body").animate({
        scrollTop: $(element).offset().top
    }, 100);
}

function continueAsGuest() {
    showCheckoutDetails();
    $("#Email").focus();
    $("#divChangeEmail").hide();
    $("#Email").removeAttr("readonly").removeClass("readonly");

}

function showCheckoutDetails(isLoginRegister) {
    $("#divSignInOption").hide();
    $("#divSignInOptionTop").hide();
    $("#divCheckoutDetails").fadeIn("fast");
    $("#divCheckoutDetailsTop").fadeIn("fast");

    var title = "Checkout. 2 of 4";
    $("#hPageTitle").html(title);
    $(document).prop('title', title);

    // Update the progress bar
    $("#divProgress1").removeClass("progress");
    $("#divProgress2").addClass("progress");

    if (isLoginRegister) {
        $("#divChangeEmail").show();
    }

    scrollToElement("#hPageTitle");
}