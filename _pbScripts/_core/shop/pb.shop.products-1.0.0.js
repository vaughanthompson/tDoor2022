// Page / Master page requirements for using the Shopping system:
// 1. If using 'Add to Cart' from the 'Products list' page, must have button / lnk with class of 'pbshop-add-to-cart'
//    A click event is attached to each of these to add the item to the cart.
//    Must have an attribute of data-productid containing the product id.

// 2. Must have an associated element with an id of Quantity{productid} from which to get the quantity to add to cart. 


$(document).ready(function () {
    // Setup the 'add to cart' functionality on the products page.
    $(document).ready(function () {
        pb_Shop_Products.setupShopProductsHtml();
    });
});


var pb_Shop_Products = {
    productAddedToCart: function (productId,quantity) {
        $(".ProductAdded_p" + productId).fadeIn("fast");
    },
    
    getShopProductsViewHtml: function (pageId, productSortOption) {

        $.post("/pbShop/GetShopProductsHtml", { pageId: pageId, productSortOption: productSortOption })
         .done(function (data) {
             $("#divPageShopProducts").replaceWith(data.Html);             
             pb_Shop_Products.setupShopProductsHtml();
         });

    },
    setupShopProductsHtml: function () {
        $(".pbshop-add-to-cart").click(function () {

            var productId = $(this).attr("data-productid");
            var categoryId = $(this).attr("data-categoryid");

            $("#ProductAdded_p" + productId).hide();
            $(this).attr("disabled", "disabled");
            var quantity = $("#Quantity_p" + productId + "_c" + categoryId).val();
            pb_Shop_Core.addProductToCart(productId, quantity, $(this), pb_Shop_Products.productAddedToCart);

        });

        // See MaoriHoney Layout for example of sorting/products on page.
        $(".pbProducts-Sort").click(function () {
            $(this).html("Loading...");            
            var productSortOption = $(this).attr("data-sortby");
            var pageId = $("#pbPageId").val();
            pb_Shop_Products.getShopProductsViewHtml(pageId, productSortOption);
        });
    }
}


