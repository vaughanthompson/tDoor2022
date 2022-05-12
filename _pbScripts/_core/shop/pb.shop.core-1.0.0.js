$(document).ready(function () {
    // due to potential caching of page on server, need to 'get cart' after the page loads, not before...
    pb_Shop_Core.getCart();
});

var pb_Shop_Core = {
    // doneFunection is a function passed in as a parameter which is executed once the product is added to the cart.
    addProductToCart: function (productId, quantity, addButton, doneFunction) {
        var originalText = $(addButton).val();
        $(addButton).val("Updating cart");
        $(addButton).attr("disabled", "disabled");
        $.post("/pbShop/AddProductToCart", { productId: productId, quantity: quantity })
          .done(function (data) {
              pb_Shop_Core.updateCartSummaryLink(data);
              $(addButton).val(originalText);
              doneFunction(productId, quantity);
              $(addButton).removeAttr("disabled");
          });
    },
    updateCartSummaryLink: function (newHtml) {
        $(".cartSummaryLink").replaceWith(newHtml);
    },
    getCart: function () {
        $.post("/pbShop/GetCart")
          .done(function (data) {
              pb_Shop_Core.updateCartSummaryLink(data);
          });
    }
}