var orderId = $("#hidOrderId").val();
var productsLoaded = 0;
var productsToLoad = orderItems.length;
var countOfOrderItems = 0; // This is used for the recursive function to get orders items details, so that only one call is made at a time.
var currentOrderItem = 0; // the current item being processed
var countOfItemsToReplace = 0;

// Used for iteritive processing of order items
var arrayOfSplitOrderItemsCount = 0;
var arrayOfSplitOrderItems = [];
var arrayOfSplitQuantities = [];
var arrayOfSplitOrderItemsCurrentProcessingItem = 0;


$(document).ready(function () {

    var allChecked = $(".chkPriceCheck:checkbox:not(:checked)").length < 1;

    if (allChecked) {
        $("#chkPriceAll").prop("checked", true);
    }

    $("#chkPriceAll").change(function () {
        var checkAll = $(this).is(":checked");
        $(".chkPriceCheck").each(function () {
            if (checkAll) {
                $(".chkPriceCheck").prop("checked", true);

            }
            else {
                $(".chkPriceCheck").prop("checked", false);
            }
        });

        saveAllPricecheckValues(checkAll);
    });

    $(".txtQuantity").change(function () {
        setupQuantityChange(this);
    });

    $(".chkPriceCheck").change(function () {
        setupPriceCheck(this);
    });

    $(".btnDeleteResult").click(function () {
        setupDelete(this);
    });


    $(".btnSaveDraft").click(function () {
        saveDraft(true);
    });

    $(".btnSaveQuote").click(function () {
        saveQuote(true);
    });

    $(".btnSaveAndContinue").click(function () {
        $(this).html("Loading...");
        $(this).attr("disabled", "disabled");
        $(this).unbind("click");

        var orderType = $(this).attr("data-ordertype");
        if (orderType == "Quote") {
            saveQuote(false);
        }
        else {
            saveDraft(false);
        }

        document.location = "/order/review/" + orderId;
    });


    // For each product code, loop through and do a lookup.
    if (orderItems.length < 1) {

        // if there are no matched items, don't need to show the loading.
        pageLoadingState(true);
    }
    else {

        $("#divTotalItems").html(productsToLoad);
        countOfOrderItems = orderItems.length;

        // Due to bug with GetProductDEtails, only using hte GetProductDetailsMultiple now

        // Show warning if over 10 items
        if (countOfOrderItems > 10) {
            var estimate = Math.round((countOfOrderItems * 3) / 60);
            if (estimate > 0) {
                $("#divLoadTimeWarning").html("This may take up to " + estimate + "min to process.");
            }

        }

        // Loop through in chunks of 20 items (this is to get around timeouts on azure when request over 3.8min)
        
        var i, j, splitOrderItems, splitQuantities, chunk = 30;
        for (i = 0, j = orderItems.length; i < j; i += chunk) {
            splitOrderItems = orderItems.slice(i, i + chunk);
            splitQuantities = quantities.slice(i, i + chunk);

            arrayOfSplitOrderItems.push(splitOrderItems);
            arrayOfSplitQuantities.push(splitQuantities);
            arrayOfSplitOrderItemsCount++;
        }

        getProductDetailsMultipleUsingSplitArray();
    }

});

function setupPriceCheck(elementSelector) {
    var id = getDataId(elementSelector);
    saveOrderItem(id);
}

function setupDelete(elementSelector) {
    var id = getDataId(elementSelector);
    var orderItemId = $(elementSelector).attr("data-orderitemid");
    deleteResult(id, orderItemId);
}

function setupQuantityChange(elementSelector) {
    var id = getDataId(elementSelector);
    var axCode = $(elementSelector).attr("data-axcode");
    var orderItemId = $(elementSelector).attr("data-orderitemid");
    var productId = $(elementSelector).attr("data-productid");
    if (axCode.length > 0 && productId > 0) {
        productsLoaded--;
        pageLoadingState(false);
        $(".divLoading" + orderItemId).html("Updating qty...");

        var quantity = $(".txtQuantity" + orderItemId).val();
        var quantities = [];
        quantities.push(quantity);
        var orderItemIds = [];
        orderItemIds.push(orderItemId);
        getProductDetailsMultiple(orderItemIds, quantities);
    } else {
        // Save the order item here, since it won't have updated in the getProductDetails call 
        saveOrderItem(id);
    }
}

var onOrderHtml = '<span class="issue"><i class="icon-empty stacked"></i>Back-order</span>';
var partialStockHtml = '<span class="neutral"><i class="icon-half stacked"></i>Partial</span>';
var fullStockHtml = '<span class="progress"><i class="icon-full stacked"></i>Stock</span>';

var totalLoadedRecursively = 0;
function getProductDetailsMultipleUsingSplitArray() {
    var orderItemIds = arrayOfSplitOrderItems[arrayOfSplitOrderItemsCurrentProcessingItem];
    var quantities = arrayOfSplitQuantities[arrayOfSplitOrderItemsCurrentProcessingItem];

    $.post("/Product/GetProductStockAndPricingDetailsMultiple", { orderItemIds: orderItemIds, quantities: quantities, customerAxBranchId: customerAxBranchId })
        .done(function (data) {

            for (i = 0; i < data.length; i++) {
                processProductStockAndPricingDetailsResponse(data[i], quantities[i]);
            }

            processReplacementsRecursive(data, quantities);
            arrayOfSplitOrderItemsCurrentProcessingItem++           

            if (arrayOfSplitOrderItemsCurrentProcessingItem >= arrayOfSplitOrderItemsCount) {
                // Show the 'download as PDF link'
                $("#divPDF").fadeIn("fast");
                $("#divItemLoadingStatus").hide();
            } else {
                // load next chunk
                totalLoadedRecursively += orderItemIds.length;
                var nextArraySize = arrayOfSplitOrderItems[arrayOfSplitOrderItemsCurrentProcessingItem].length;                
                $("#divItemLoadingStatus").html("<p>" + totalLoadedRecursively + " items loaded. Loading next " + nextArraySize + " items...");
                $("#divItemLoadingStatus").fadeIn("slow");
                getProductDetailsMultipleUsingSplitArray();
            }
        })
        .fail(function (xhr, status, error) {

            processClientError();

        });
}


function getProductDetailsMultiple(orderItemIds, quantities) {

    $.post("/Product/GetProductStockAndPricingDetailsMultiple", { orderItemIds: orderItemIds, quantities: quantities, customerAxBranchId: customerAxBranchId })
        .done(function (data) {

            for (i = 0; i < data.length; i++) {
                processProductStockAndPricingDetailsResponse(data[i], quantities[i]);
            }

            processReplacementsRecursive(data, quantities);

            // Show the 'download as PDF link'
            $("#divPDF").fadeIn("fast");
        })
        .fail(function (xhr, status, error) {

            processClientError();

        });
}

function processClientError() {
    var errorMessageToClient = "Something went wrong while processing your request. Please try again by refreshing the page and if the problem persists please contact support.";
    $(".issue").html("An error occured. Please try refreshing the page.");
    $("#secStockAndPricing").html(errorMessageToClient);
    alert(errorMessageToClient);

    //SendClientErrorNotification
    $.post("/pbSystem/SendClientErrorNotification", {
        source: "/Product/GetProductStockAndPricingDetailsMultiple", data: "CustomerBranchId: " + customerAxBranchId + ", OrderId:" + orderId
    });
}

var processReplacementsIndex = 0
function processReplacementsRecursive(data, quantities) {

    if (processReplacementsIndex < data.length) {
        processReplacements(data[processReplacementsIndex], quantities[processReplacementsIndex]);
        processReplacementsIndex++;
        processReplacementsRecursive(data, quantities);
    }
    else {
        processRequiredReplacements();
    }

}


function processReplacements(data, quantity) {
    var orderItemId = data.OrderItemId;

    if (data.ReplacementItems) {
        for (i = 0; i < data.ReplacementItems.length; i++) {
            var replacementItem = data.ReplacementItems[i];

            // if there are any required replacements the 'continue' functionality should be disabled
            if (replacementItem.IsRequired == true) {
                //requiredReplacements.push(orderItemId);

                $(".trResult_oi_" + orderItemId).attr("requiresReplacement", true);


                countOfItemsToReplace++;

                // Add a strikethrough to the product description/code
                $(".divProductDescription" + orderItemId).addClass("product-replacement-required");
            }
            else {
                $(".trResult_oi_" + orderItemId).attr("requiresReplacement", false);
                $(".divProductDescription" + orderItemId).addClass("product-replacement-notrequired");
            }

            // Add the links to 'replace' the items
            var replacementText = "Replace with " + replacementItem.AxProductCode + " (" + replacementItem.ReplacementQuantity * quantity + " required)";
            var replacementLink = "<div><a style='display:inline;' href='javascript:void(0);' onclick='replaceItem(" + orderItemId + "," + replacementItem.ReplacementQuantity + ",\"" + replacementItem.AxProductCode + "\")'>" + replacementText + "</a></div>";
            $(".divReplacements" + orderItemId).append(replacementLink);

        }
        var headerHtml = "<div><b>Replacements:</b></div>";
        if (data.ReplacementItems.length == 1) {
            headerHtml = "<div><b>Replacement:</b></div>";
        }
        $(".divReplacements" + orderItemId).prepend(headerHtml);
        $(".divReplacements" + orderItemId).show();
    }
}


function processProductStockAndPricingDetailsResponse(data, quantity) {
    var orderItemId = data.OrderItemId;
    productsLoaded++;

    // Process any replacement items    
    // reset the replacement links html
    $(".divReplacements" + orderItemId).html("");

    // Change page loading state
    if (productsLoaded >= productsToLoad) {
        pageLoadingState(true);
    }

    $(".divCustomerPrice" + orderItemId).html(data.CustomerPriceDisplay);
    $(".divRRP" + orderItemId).html(data.RRPDisplay);

    // Get the stock they require for this product
    // NOTE: This has to account for ALL products on the page -> might be separate lines with the same product code
    var requiredStock = 0;
    var productId = data.ProductId;
    $(".txtProductQuantity" + productId).each(function () {
        requiredStock += parseFloat($(this).val());
    })

    var branchStockHtml = getStockLevelHtml(data.Stock_DefaultBranch, requiredStock, data.IsSuccess);
    var niStockHtml = getStockLevelHtml(data.Stock_NorthIsland, requiredStock, data.IsSuccess);
    var siStockHtml = getStockLevelHtml(data.Stock_SouthIsland, requiredStock, data.IsSuccess);

    $(".divCustomerBranchStock" + productId).html(branchStockHtml);
    $(".divSouthIsStock" + productId).html(siStockHtml);
    $(".divNorthIsStock" + productId).html(niStockHtml);

    // If an error occurred in the API (e.g. timeout) mark with TD to confirm
    if (data.ErrorOccurred) {
        $(".divCustomerBranchStock" + productId).html("TD to confirm");
        $(".divSouthIsStock" + productId).html("TD to confirm");
        $(".divNorthIsStock" + productId).html("TD to confirm");
    }

    $(".divPriceCheck" + orderItemId).show();
    currentOrderItem++;
}


function processRequiredReplacements() {

    if (countOfItemsToReplace > 0) {
        $("#divMajorActions").hide();
        $(".requiredReplacementsExist").fadeIn("slow");
        $(".requiredReplacementsExist").fadeOut("slow");
        $(".requiredReplacementsExist").fadeIn("slow");
    } else {
        $(".requiredReplacementsExist").hide();

        if (productsLoaded >= productsToLoad) {
            $("#divMajorActions").show();
        }
    }

}


function replaceItem(orderItemId, replacementQuantityMultiplier, replacementProductCode) {
    //$(".trResult_oi_" + orderItemId).fadeOut("fast");
    $(".trResult_oi_" + orderItemId).html("<td style='color:green;'>Replacing with " + replacementProductCode + "... please wait.");
    countOfItemsToReplace--;
    productsLoaded--;

    $.post("/Order/ReplaceOrderItem", { orderItemId: orderItemId, replacementQuantityMultiplier: replacementQuantityMultiplier, replacementProductCode: replacementProductCode })
        .done(function (data) {
            $(".trResult_oi_" + orderItemId).replaceWith(data.Data);

            var theQtyElement = $(".trResult_oi_" + orderItemId).find(".txtQuantity");
            //$(theQtyElement).fadeOut("slow");

            $(theQtyElement).change(function () {
                setupQuantityChange(this);
            });

            $(theQtyElement).change(function () {
                setupPriceCheck(this);
            });

            $(theQtyElement).click(function () {
                setupDelete(this);
            });


            pageLoadingState(false);
            var quantity = $(".txtQuantity" + orderItemId).val();
            var quantities = [];
            quantities.push(quantity);
            var orderItemIds = [];
            orderItemIds.push(orderItemId);
            getProductDetailsMultiple(orderItemIds, quantities);
        });
}

function pageLoadingState(isLoaded) {
    if (isLoaded) {
        $("#divMajorActions").show();
        $(".pageIsLoading").hide();
        $("#divPriceAll").show();
        $(".btnDeleteResult").show();
    } else {
        $("#divMajorActions").hide();
        $("#divPriceAll").hide();
        $(".pageIsLoading").show();
        $(".btnDeleteResult").hide();
    }
}

function getStockLevelHtml(stockLevel, requiredStock, isSuccess) {
    var result = "N/A";
    if (!isSuccess) {
        result;
    }

    if (stockLevel == null) {
        result = onOrderHtml;
    }

    else if (stockLevel > 0) {
        if (stockLevel >= requiredStock) {
            result = fullStockHtml;
        }
        else if (stockLevel > 0) {
            result = partialStockHtml;
        }
        else {
            result = onOrderHtml;
        }
    }
    else {
        result = onOrderHtml;
    }
    return result;// + " instock: " + stockLevel +  " req: " + requiredStock;// = result + " > " + requiredStock;
}

function getDataId(element) {
    return $(element).attr("data-id");
}

function deleteResult(id, orderItemId) {
    var tr = $("#trResult" + id);
    var orderItemHadRequiredReplacement = $(tr).attr("requiresReplacement");
    tr.remove();
    $.post("/order/deleteorderitem", { orderItemId: orderItemId })
        .done(function (data) {

            if (orderItemHadRequiredReplacement) {
                countOfItemsToReplace--;
                processRequiredReplacements();
            }

        });
}

function saveQuote(showSaving) {
    var orderType = "Quote";
    saveOrder(orderType, showSaving);
}

function saveDraft(showSaving) {
    var orderType = "Draft";
    saveOrder(orderType, showSaving);
}

function saveOrderItem(id) {
    //savingStart();
    var qty = $("#txtQuantity" + id).val();
    var isPriceCheck = $("#chkPriceCheck" + id) != 'undefined' && $("#chkPriceCheck" + id).is(":checked");
    var orderItemId = $("#txtQuantity" + id).attr("data-orderitemid");
    $.post("/Order/SaveOrderItem", { orderItemId: orderItemId, quantity: qty, isPriceCheck: isPriceCheck })
        .done(function (data) {
            //savingComplete();
        });
}

function saveOrder(orderType) {
    saveOrder(orderType, false);
}

function saveOrder(orderType, showSaving) {
    if (showSaving) {
        savingStart();
    }

    var poNumber = $("#txtPoNumber").val();
    $.post("/Order/SaveOrderTypeAndPoNumber", { orderType: orderType, poNumber: poNumber })
        .done(function (data) {

            if (showSaving) {
                savingComplete();
            }

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

function saveAllPricecheckValues(isPricecheck) {
    var orderItemIds = [];
    $(".chkPriceCheck").each(function () {
        var orderItemId = $(this).attr("data-orderitemid");

        orderItemIds.push(orderItemId);
    });

    $.post("/Order/saveurderitempricecheckmultiple", { orderItemIds: orderItemIds, isPricecheck: isPricecheck })
        .done(function (data) {
            //savingComplete();
        });
}