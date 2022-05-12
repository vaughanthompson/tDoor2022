$(document).ready(function () {

    $("#frmProductSearch").submit(function (submitEvent) {
        $(".search-error").fadeOut("fast");

        var search = $("#SearchList").val();
        if (search.length < 1) {
            $("#divEmptySearch").fadeIn("fast");
            submitEvent.preventDefault();
        }

    });

    $("#SearchList").keyup(function () {
        $(".search-error").fadeOut("fast");
    });

    $("#frmProductSearchUploadFile").submit(function (submitEvent) {

        $("#btnUpload").val("Uploading...");
        $("#btnUpload").prop("disabled", "disabled");
        $(".uploadFile-error").fadeOut("fast");

        // get the file name, possibly with path (depends on browser)
        var filename = $("#SearchListUpload").val();

        // Use a regular expression to trim everything before final dot
        var extension = filename.replace(/^.*\./, '');

        // Iff there is no dot anywhere in filename, we would have extension == filename,
        // so we account for this possibility now
        if (extension == filename) {
            extension = '';
        } else {
            // if there is an extension, we convert to lower case
            // (N.B. this conversion will not effect the value of the extension
            // on the file upload.)
            extension = extension.toLowerCase();
        }

        switch (extension) {
            case 'xls':
            case 'xlsx':
            case 'csv':
            case 'txt':
                // Allow submit for above file types
                break;

            case '':
                enableUpload();
                $("#divNoFileSelected").fadeIn("fast");
                submitEvent.preventDefault();
                break;
            default:
                // Cancel the form submission and show error for incorrect file type.
                enableUpload();
                $("#divInvalidFileType").fadeIn("fast");
                submitEvent.preventDefault();
        }

    });

    function enableUpload() {
        $("#btnUpload").val("Upload");
        $("#btnUpload").prop("disabled", null);
    }
});