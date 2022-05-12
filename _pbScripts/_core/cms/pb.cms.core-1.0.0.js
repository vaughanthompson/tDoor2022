$(document).ready(function () {
    
});

var pb_CMS_Core = {

    copyToClipboard: function (text){
        window.prompt("Copy to clipboard: Ctrl+C, then press enter or click OK.", text);
    },
    
    // HTML EDITOR FUNCTIONS
    makeHtmlEditor: function (editorSelector) {
        
        // Have to remove first as it won't load second time around if there's already been a TMCE for this text box.
        tinymce.remove("textarea" + editorSelector);

        tinymce.init({
            convert_urls: false,
            selector: "textarea" + editorSelector,
            theme: "modern",
            //width: 300,
            //height: 300,
            plugins: [
                "autoresize paste link hr code"
                 //"advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                 //"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                 //"save table contextmenu directionality emoticons template paste textcolor"
            ],
            menubar: "",
            //content_css: "css/content.css",
            toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | hr | code",
            //image | print preview media fullpage | forecolor backcolor emoticons",

            paste_as_text: true,

            paste_auto_cleanup_on_paste: true,
            paste_remove_styles: true,
            paste_remove_styles_if_webkit: true,
            paste_strip_class_attributes: true,

                    

            //style_formats: [
            //     { title: 'Bold text', inline: 'b' },
            //     { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
            //     { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
            //     { title: 'Example 1', inline: 'span', classes: 'example1' },
            //     { title: 'Example 2', inline: 'span', classes: 'example2' },
            //     { title: 'Table styles' },
            //     { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
            //]
        });
    },
    getHtmlEditorContents: function (editorId) {
        tinyMCE.triggerSave(false, true);
        return $("#" + editorId).val();
    },
    //imageSelectorDialogTargetElement = the element that will be turned into a dialog for the image selector
    //imageGroupIdTargetElement = the element to which the selected imageGroupId will be set
    //imageUrlTargetElement = the element to which the selected imageGroupurl will be set.
    showImageSelector: function (siteId,imageSelectorDialogTargetElement, imageGroupIdTargetElement, imageUrlTargetElement,loadingElement) {
        var originalText = $(loadingElement).html();
        $(loadingElement).html("<span style='color:green;'>Loading...</span>");
        $.post("/pbAdmin/GetImageSelector", { siteId:siteId,imageGroupIdTargetElement: imageGroupIdTargetElement, imageUrlTargetElement: imageUrlTargetElement })
          .done(function (data) {
              $(imageSelectorDialogTargetElement).html(data);
              $(imageSelectorDialogTargetElement).dialog({ title: "Choose an image", width: 800, height: 650 });
              $(loadingElement).html(originalText);
          });
    }
}