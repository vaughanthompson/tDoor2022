$(document).ready(function () {
    pb_CMS_CategorySelector.initializeCategorySelector();
});

var pb_CMS_CategorySelector = {

    initializeCategorySelector: function () {
        var checkboxes = $(".CatSel").find(':checkbox');
        var isSingleSelect = $(".CatSel").attr("data-singleselect") == "True";
        // For single select option, show all the children.
        if (isSingleSelect) {
            $(".CatSelItemChild").show();
        }

        checkboxes.change(function () {
            pb_CMS_CategorySelector.categoryCheckboxChanged(this,isSingleSelect);            
        });
    },
    categoryCheckboxChanged: function (theCheckbox, isSingleSelect) {
        var categoryId = $(theCheckbox).val();
        var isChecked = theCheckbox.checked;
        // If it is a single select, and item is ticked, then untick all others.
        if (isSingleSelect && isChecked) {
            $(".CatSel").find(':checkbox').removeAttr("checked");
            theCheckbox.checked = true;
        }
        else {
            if (isChecked) {
                $(".CatSelItemChild" + categoryId).show();
            } else {
                // un-check any children 
                var childCheckboxes = $(".CatSelItemChild" + categoryId).find(':checkbox');
                childCheckboxes.removeAttr("checked");

                // hide the children
                $(".CatSelItemChild" + categoryId).hide();
            }
        }
        
    }
}