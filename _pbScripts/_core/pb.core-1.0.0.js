$(document).ready(function () {
    if ($('.pbLoggedIn').length) {
        pb_Core.processLoginStatus();
    }
});

var pb_Core = {
    processLoginStatus: function () {
        $.post("/Account/GetUserInfo")
          .done(function (data) {
              if (data.Username.length > 0) {
                  // User is logged in.
                  $('.pbLoggedIn').show();
                  //if ($('#pbDivLoggedInAs').length) {
                  //    $('#pbDivLoggedInAs').html(data.Username);
                  //}

                  if ($('.pbLoggedOut').length) {
                      $('.pbLoggedOut').hide();
                  }
              } 
          });
    }
}