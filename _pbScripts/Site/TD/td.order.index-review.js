
//$("#divMajorActions").show();
var orderId = $("#hidOrderId").val(); 

$(document).ready(function () {

    loadDeliveryAddresses();

    var allChecked = $(".chkUrgent:checkbox:not(:checked)").length < 1;

    if (allChecked) {
        $("#urgentALL").prop("checked", true);
    }

    $("#urgentALL").change(function () {
        var checkAll = $(this).is(":checked");
        $(".chkUrgent").each(function () {
            if (checkAll) {
                $(".chkUrgent").prop("checked", true);

            }
            else {
                $(".chkUrgent").prop("checked", false);
            }
        });

        saveAllUrgencyValues(checkAll);
    });

    $(".chkUrgent").click(function () {
        urgencyCheckboxChanged(this);
    });

    $(".btnSaveDraft").click(function () {
        saveDraft();
    });

    $(".btnSaveQuote").click(function () {
        saveQuote();
    });
    

    $(".btnSaveAndContinue").click(function () {
        submitToAx();
    });
});

function loadDeliveryAddresses() {
    $.post("/Order/GetOrderDeliveryAddresses", { orderId: orderId})
      .done(function (data) {
          $("#divMajorActions").show();
          $(".pageIsLoading").hide();

          $("#selDelivery").append($("<option>", {
              value: "",
              text: "* TransDiesel to confirm delivery address *"
          }));

          if (data.length > 0) {
              for (i = 0; i < data.length; i++) {
                  var isDefault = data[i].IsDefault;
                  if (isDefault) {
                      $("#selDelivery").append($("<option>", {
                          value: data[i].AxDeliveryId,
                          text: data[i].Address,
                          selected: "selected"
                      }));
                  }
                  else {
                      $("#selDelivery").append($("<option>", {
                          value: data[i].AxDeliveryId,
                          text: data[i].Address
                      }));
                  }
                  
              }              
          }
          // User no longer required to have an address since they can use the 'TD to confirm' below.
          //else {
          //    // There are no addresses setup
          //    $("#selDelivery").hide();
          //    $(".btnSaveAndContinue").fadeOut("slow");//prop("disabled", "disabled");
          //    $("#divNoAddresses").fadeIn("slow");
          //}

        

          $("#divDelivery").show();
      });
}

function urgencyCheckboxChanged(theCheckbox) {
    var orderItemId = $(theCheckbox).attr("data-orderitemid");
    var isUrgent = $(theCheckbox).is(":checked");
    $.post("/Order/SaveOrderItemUrgency", { orderItemId: orderItemId, isUrgent: isUrgent })
       .done(function (data) {
           //savingComplete();
       });
}

function saveAllUrgencyValues(isUrgent) {
    var orderItemIds = [];
    $(".chkUrgent").each(function () {
        var orderItemId = $(this).attr("data-orderitemid");
        orderItemIds.push(orderItemId);
    });

    $.post("/Order/saveorderitemurgencymultiple", { orderItemIds: orderItemIds, isUrgent: isUrgent })
       .done(function (data) {
           //savingComplete();
       });
}

function saveDraft() {
    var orderType = "Draft";
    saveOrder(orderType);
}

function saveQuote() {
    var orderType = "Quote";
    saveOrder(orderType);
}

var isSaving = false;
function submitToAx() {

    if (isSaving) {
        alert("The order is saving. Please wait.");
        return;
    }

    var btnSaveAndContinueText = $(".btnSaveAndContinue").text();
    $(".btnSaveAndContinue").text("Saving...");
    isSaving = true;

    $("#selDelivery").prop("disabled", "disabled");
    $(".divErrorSubmittingToAx").hide();
      
    var poNumber = $("#txtPoNumber").val();
    var axDeliveryId = $("#selDelivery").val();
    var notes = $("#txtNotes").val();

    $.post("/Order/SubmitOrderToAx", { orderId: orderId, poNumber: poNumber, axDeliveryId: axDeliveryId, notes: notes })
    .done(function (data) {
        
        $(".btnSaveAndContinue").text("Saving...");
        
        // check for errors
        
        // If error, re-enabled button, else send to Processing page        
        if (!data.Success) {
            $("#divSaving").hide();
            $(".btnSaveAndContinue").prop("disabled", null);
            $("#selDelivery").prop("disabled", null);
            $(".btnSaveAndContinue").text(btnSaveAndContinueText);
            $(".divErrorSubmittingToAx").show();
            isSaving = false;
        }
        else {
            document.location = "/order/processing";
        }


    });
}

function saveOrder(orderType) {
    savingStart();
    var poNumber = $("#txtPoNumber").val();
    $.post("/Order/SaveOrderTypeAndPoNumber", { orderType: orderType, poNumber: poNumber })
    .done(function (data) {
        savingComplete();
    });
}


function savingStart() {
    
    $("#divSaved").hide();
    $("#divSaving").show();

}

function savingComplete() {
    $("#divSaving").hide();
    $("#divSaved").show();
}