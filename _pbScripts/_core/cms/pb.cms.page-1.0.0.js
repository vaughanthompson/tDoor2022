$(document).ready(function () {
    pb_CMS_Page.initializeCMS();
});

var pb_CMS_Page = {

    initializeCMS: function () {

        // When an articletype / content area is selected from the drop down, scroll the page to the top of that area
        
        $("#selArticleType").unbind("change");
        $("#selArticleType").bind("change", function () {
            var articleType = $(this).val();
            $("#divArticles" + articleType + "End").show();
            $('html, body').stop().animate({
                'scrollTop': $("#divArticles" + articleType + "End").offset().top - 400
            }, 1000, 'swing', function () {
                $("#divArticles" + articleType + "End").html("<div style='position:relative;margin-top:-10px;color:red;background-color:white;padding:5px;border:1px solid red;'>CONTENT WILL GO HERE...</div>");
                $("#divArticles" + articleType + "End").fadeOut("fast");                
                $("#divArticles" + articleType + "End").fadeIn("fast");
                $("#divArticles" + articleType + "End").fadeOut("slow");
                $("#divArticles" + articleType + "End").fadeIn("slow");
                $("#divArticles" + articleType + "End").fadeOut("slow");
            });

        });


        // On each page there is one btnAddArticle when the page is in EditMode.
        $("#btnAddArticle").unbind("click");
        $("#btnAddArticle").bind("click", function () {
            var pageId = $("#PageId").val();
            var wrapperId = $("#divAddArticle #selWrapper").val();

            if (wrapperId == -1) {
                $("#divAddArticle #selWrapper").focus();
                return;
            }

            var articleType = $("#divAddArticle #selArticleType").val();
            pb_CMS_Page.addArticleToPage(wrapperId, articleType, pageId, $(this));
        });

        // There are zero or many buttons to show the 'add content' hidden stuff.
        $(".cms-btn-show-add-content").unbind("click");
        $(".cms-btn-show-add-content").bind("click", function () {
            var articleId = $(this).attr("data-id");
            $("#divAddContent" + articleId).fadeToggle();
        });

        // There are zero of many buttons to add the content to the article (one for each article)
        $(".cms-btn-add-content").unbind("click");
        $(".cms-btn-add-content").bind("click", function () {
            var articleId = $(this).attr("data-id");
            var contentTypeId = $("#selContentType" + articleId).val();
            var column = $("#selColumn" + articleId).val();
            pb_CMS_Page.addContentToArticle(articleId, contentTypeId, column, $(this));
        });

        $(".cms-btn-del-article").unbind("click");
        $(".cms-btn-del-article").bind("click", function () {
            if (confirm("Are you sure you want to delete this article? You will not be able to undo this action.")) {
                var articleId = $(this).attr("data-id");
                pb_CMS_Page.deleteArticle(articleId, $(this));
            }
        });

        $(".cms-btn-edit-content").unbind("click");
        $(".cms-btn-edit-content").bind("click", function () {
            var contentId = $(this).attr("data-id");
            var displayEditor = true;
            pb_CMS_Page.getContent(contentId, displayEditor, $(this));
        });

        $(".cms-btn-del-content").unbind("click");
        $(".cms-btn-del-content").bind("click", function () {
            if (confirm("Are you sure you want to delete this content? You will not be able to undo this action.")) {
                var contentId = $(this).attr("data-id");
                pb_CMS_Page.deleteContent(contentId, $(this));
            }
        });

        $(".cms-btn-save-content").unbind("click");
        $(".cms-btn-save-content").bind("click", function () {
            var contentId = $(this).attr("data-id");
            var displayEditor = false;
            var htmlContent = pb_CMS_Core.getHtmlEditorContents("txtContent" + contentId);
            var htmlContentAdminOnly = $("#txtContentAdminOnly" + contentId).val();            
            var cssClass = $("#txtCssClass" + contentId).val();
            var url = $("#txtUrl" + contentId).val();
            pb_CMS_Page.saveContent(contentId, htmlContent, htmlContentAdminOnly, cssClass,url, displayEditor, $(this));
        });

        $(".cms-btn-manage-images").unbind("click");
        $(".cms-btn-manage-images").bind("click", function () {
            var contentId = $(this).attr("data-id");
            $("#divEditContentImages" + contentId).fadeToggle();
        });

         $(".cms-btn-manage-advancedimages").unbind("click");
         $(".cms-btn-manage-advancedimages").bind("click", function () {
            var contentId = $(this).attr("data-id");
            $("#divEditContentImagesAdvanced" + contentId).fadeToggle();
        });

        $(".cms-btn-cancel-content").unbind("click");
        $(".cms-btn-cancel-content").bind("click", function () {

            var contentId = $(this).attr("data-id");

            // to fix issue in Firefox, need to remove the editor first.
            tinymce.remove("#txtContent" + contentId);

            var displayEditor = false;
            pb_CMS_Page.getContent(contentId, displayEditor, $(this));


        });

        $(".cms-btn-up-article").unbind("click");
        $(".cms-btn-up-article").bind("click", function () {
            var articleId = $(this).attr("data-id");
            pb_CMS_Page.moveArticleUp(articleId);
        });

        $(".cms-btn-down-article").unbind("click");
        $(".cms-btn-down-article").bind("click", function () {
            var articleId = $(this).attr("data-id");
            pb_CMS_Page.moveArticleDown(articleId);
        });

        $(".cms-btn-up-content").unbind("click");
        $(".cms-btn-up-content").bind("click", function () {
            var contentId = $(this).attr("data-id");
            pb_CMS_Page.moveContentUp(contentId);
        });

        $(".cms-btn-down-content").unbind("click");
        $(".cms-btn-down-content").bind("click", function () {
            var contentId = $(this).attr("data-id");
            pb_CMS_Page.moveContentDown(contentId);
        });

        // Set the up/down buttons for articles
        $(".cms-article-edit").each(function () {
            var thisItem = $(this);
            pb_CMS_Page.processUpDownControls(thisItem, "article");
        });

        // Set the up/down buttons for contents
        $(".cms-content-edit").each(function () {
            var thisItem = $(this);
            pb_CMS_Page.processUpDownControls(thisItem, "content");
        });

        $("#divAddArticle").show();
    },

    // Shows the image group selector pop-up on the page with the target elements passed in for return.
    showImageGroupSelectorForContentImageType: function (siteId, contentId, imageType, theLinkToOpenImageSelector) {
        var targetForImageGroupId = "#hidContentImageTypeGroupId_" + contentId + "_" + imageType;
        var targetForImageUrl = "#imgContentImageTypeImage_" + contentId + "_" + imageType;

        pb_CMS_Core.showImageSelector(siteId, "#divCMSPageImageSelector", targetForImageGroupId, targetForImageUrl, theLinkToOpenImageSelector);
    },

    processUpDownControls: function (theElement, itemType) {
        var previousItem = theElement.prev();
        var previousClass = previousItem.attr("class");
        if (typeof previousClass === "undefined") {
            theElement.find(".cms-btn-up-" + itemType).first().hide();
        }
        else {
            if (previousClass.toLowerCase().indexOf("cms-" + itemType + "-edit") >= 0) {
                theElement.find(".cms-btn-up-" + itemType).first().show();
            }
            else {
                theElement.find(".cms-btn-up-" + itemType).first().hide();
            }
        }

        var nextItem = theElement.next();
        var nextClass = nextItem.attr("class");
        if (typeof nextClass === "undefined") {
            theElement.find(".cms-btn-down-" + itemType).first().hide();
        }
        else {
            if (nextClass.toLowerCase().indexOf("cms-" + itemType + "-edit") >= 0) {
                theElement.find(".cms-btn-down-" + itemType).first().show();
            }
            else {
                theElement.find(".cms-btn-down-" + itemType).first().hide();
            }
        }
    },
    moveArticleUp: function (articleId) {

        $.post("/pbAdmin/MoveArticleUpOrDown", { articleId: articleId, isMoveUp: true })
          .done(function (data) {
              // Get article above this one
              var thisItem = $("#divEditArticle" + articleId);
              var previousItem = thisItem.prev();
              var previousClass = previousItem.attr("class");

              // If the item is a cms article, then we can move the item above it.
              if (previousClass.toLowerCase().indexOf("cms-article-edit") >= 0) {
                  thisItem.fadeOut("fast");
                  thisItem.insertBefore(previousItem);
                  thisItem.fadeIn("fast");
                  pb_CMS_Page.processUpDownControls(thisItem, "article");
                  pb_CMS_Page.processUpDownControls(previousItem, "article");
              }
          });
    },
    moveArticleDown: function (articleId) {
        $.post("/pbAdmin/MoveArticleUpOrDown", { articleId: articleId, isMoveUp: false })
          .done(function (data) {
              // Get article below this one
              var thisItem = $("#divEditArticle" + articleId);
              var nextItem = thisItem.next();
              var nextItemClass = nextItem.attr("class");

              // If the item is a cms article, then we can move the item below it.
              if (nextItemClass.toLowerCase().indexOf("cms-article-edit") >= 0) {
                  thisItem.fadeOut("fast");
                  thisItem.insertAfter(nextItem);
                  thisItem.fadeIn("fast");
                  pb_CMS_Page.processUpDownControls(thisItem, "article");
                  pb_CMS_Page.processUpDownControls(nextItem, "article");
              }
          });
    },
    moveContentUp: function (contentId) {

        $.post("/pbAdmin/MoveContentUpOrDown", { contentId: contentId, isMoveUp: true })
          .done(function (data) {
              var thisItem = $("#divEditContent" + contentId);
              var previousItem = thisItem.prev();
              var previousClass = previousItem.attr("class");
              if (previousClass.toLowerCase().indexOf("cms-content-edit") >= 0) {
                  thisItem.fadeOut("fast");
                  thisItem.insertBefore(previousItem);
                  thisItem.fadeIn("fast");
                  pb_CMS_Page.processUpDownControls(thisItem, "content");
                  pb_CMS_Page.processUpDownControls(previousItem, "content");
              }
          });
    },
    moveContentDown: function (contentId) {
        $.post("/pbAdmin/MoveContentUpOrDown", { contentId: contentId, isMoveUp: false })
          .done(function (data) {
              var thisItem = $("#divEditContent" + contentId);
              var nextItem = thisItem.next();
              var nextItemClass = nextItem.attr("class");
              if (nextItemClass.toLowerCase().indexOf("cms-content-edit") >= 0) {
                  thisItem.fadeOut("fast");
                  thisItem.insertAfter(nextItem);
                  thisItem.fadeIn("fast");
                  pb_CMS_Page.processUpDownControls(thisItem, "content");
                  pb_CMS_Page.processUpDownControls(nextItem, "content");
              }
          });
    },

    //Add a new article to the page ready for editing.
    addArticleToPage: function (wrapperId, articleType, pageId, button) {

        var initVal = button.val();
        button.val("processing...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/AddArticleToPage", { wrapperId: wrapperId, articleType: articleType, pageId: pageId })
          .done(function (data) {
              var addBeforeThis = $("#divArticles" + articleType + "End");
              addBeforeThis.before(data); // add the new pbArticle html to the page in the relevant area.
              pb_CMS_Page.initializeCMS();
              button.val(initVal);
              button.removeAttr("disabled");
              pb_CMS_Core.makeHtmlEditor(".cms-htmleditor");

              // Scroll the page to where the new content is
              $('html, body').stop().animate({
                  'scrollTop': $("#divArticles" + articleType + "End").offset().top - 400
              }, 1500, 'swing', function () {
                  // Can do something after here...
              });

          });
    }
    ,
    //Add new content to the article ready for editing.
    addContentToArticle: function (articleId, contentTypeId, column, button) {
        var initVal = button.val();
        button.val("processing...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/AddContentToArticle", { articleId: articleId, contentTypeId: contentTypeId, column: column })
          .done(function (data) {
              var addBeforeThis = $("#divArticle" + articleId + "Col" + column + "End").last(); // Add new items before this
              addBeforeThis.before(data); // add the new pbContent html to the article in the relevant area.
              pb_CMS_Page.initializeCMS();
              button.val(initVal);
              button.removeAttr("disabled");
              pb_CMS_Core.makeHtmlEditor(".cms-htmleditor");


              // Scroll to where the new content is
              $('html, body').stop().animate({
                  'scrollTop': $("#divArticle" + articleId + "Col1End").offset().top - 500
              }, 1000, 'swing', function () {
                  // Can do something after here...
              });

          });
    },
    //get content.
    getContent: function (contentId, displayEditor, button) {
        var initVal = button.val();
        button.val("processing...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/GetContent", { contentId: contentId, displayEditor: displayEditor })
          .done(function (data) {
              $("#divEditContent" + contentId).replaceWith(data);
              pb_CMS_Page.initializeCMS();
              button.val(initVal);
              button.removeAttr("disabled");
              if (displayEditor) {
                  pb_CMS_Core.makeHtmlEditor("#txtContent" + contentId);
              }
          });
    },
    //Add new content to the article ready for editing.
    saveContent: function (contentId, htmlContent, htmlContentAdminOnly, cssClass,url, displayEditor, button) {

        // Get the imagegroups selected (if any) for this content
        // These are selected on \views\pb\_contentimagetypeadmin.cshtml        
        var contentTypeImageGroups = [];
        $(".hidContentImageTypeGroupId_" + contentId).each(function () {
            var contentType = $(this).attr("data-imagetype");
            var imageGroupId = $(this).val();
            contentTypeImageGroups.push(contentType + "," + imageGroupId);
        });
        
        // Store any widths set in an array for saving
        var contentTypeImageWidths = [];        
        $(".txtContentImageTypeWidth_" + contentId).each(function () {
            var contentType = $(this).attr("data-imagetype");
            var width = $(this).val();
            contentTypeImageWidths.push(contentType + "," + width);
        });


        // Store any cssClass values for Enhancements or DisplayRules in an array for saving.
        var contentImageTypeCssClass_Enhancements = [];        
        $(".selContentImageTypeCssClass_Enhancements_" + contentId).each(function () {
            var contentType = $(this).attr("data-imagetype");
            var cssClass = $(this).val();
            contentImageTypeCssClass_Enhancements.push(contentType + "," + cssClass);
        });
        var contentImageTypeCssClass_DisplayRules = [];
        $(".selContentImageTypeCssClass_DisplayRules_" + contentId).each(function () {
            var contentType = $(this).attr("data-imagetype");
            var cssClass = $(this).val();
            contentImageTypeCssClass_DisplayRules.push(contentType + "," + cssClass);
        });

        var initVal = button.val();
        button.val("saving...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/saveContent", { contentId: contentId, htmlContent: htmlContent, htmlContentAdminOnly: htmlContentAdminOnly, cssClass: cssClass,url:url, displayEditor: displayEditor, contentTypeImageGroups: contentTypeImageGroups, contentTypeImageWidths: contentTypeImageWidths, contentImageTypeCssClass_Enhancements: contentImageTypeCssClass_Enhancements, contentImageTypeCssClass_DisplayRules: contentImageTypeCssClass_DisplayRules })
          .done(function (data) {
              $("#divEditContent" + contentId).replaceWith(data);
              pb_CMS_Page.initializeCMS();
              button.val(initVal);
              button.removeAttr("disabled");
          });
    },
    deleteArticle: function (articleId, button) {
        button.html("deleting...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/deleteArticle", { articleId: articleId })
          .done(function (data) {
              $("#divEditArticle" + articleId).remove();
          });
    },
    deleteContent: function (contentId, button) {
        button.html("deleting...");
        button.attr("disabled", "disabled");
        $.post("/pbAdmin/deleteContent", { contentId: contentId })
          .done(function (data) {
              $("#divEditContent" + contentId).remove();
          });
    }
}