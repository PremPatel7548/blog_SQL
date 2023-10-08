var rowUpdateButtons = "<a onclick='updateCategory()'><button class='btn btn-success btn-save'> Edit </button></a>";

$('#tblData').on('click', '.btn-edit', function () {
    const id = $(this).parent().parent().find(".categoryID").html();
    $(this).parent().parent().find(".categoryID").html("<input type='hidden' value='" + id.trim() + "' class='form-control txtid' />");

    const category = $(this).parent().parent().find(".category").html();

    $(this).parent().parent().find(".category").html("<input type='text' value='" + category.trim() + "' class='form-control txtcategory'/>");

    $(this).parent().parent().find(".tdAction").html(rowUpdateButtons);

});

function updateCategory() {
    var id = $('.txtid').val();
    var category = $('.txtcategory').val();

    $.ajax({
        type: 'patch',
        url: "/editCategory/" + id + "",
        data: {
            category: category,
        },
        success: function (data) {
            alert("Update Category SuccessFully");
            window.location.replace('/Category');
        }
    })
}