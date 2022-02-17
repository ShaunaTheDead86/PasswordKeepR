const search = () => {

  //submission of form data to the server using post
  $("#keyword").on('input', () => {
    // evt.preventDefault();
    let passwordSearch = $("#keyword").val();

    if (passwordSearch.length > 0) {
    $.ajax({
      url: "/api/credentials/search",
      data: {website: passwordSearch},
      type: "POST",
      success: function(res) {
        //fetch the response of the server

        const searchResultArr = res.searchResult;

        renderQuerySiteLayout(searchResultArr);

      },
      error: function(err) {
        console.log(err);
      }
    });
  } else {
    renderDisplay()
  }
  })
};

const renderQuerySiteLayout = (dataset) => {
  $(".category-container").empty();
  //hide new category that hardcoded in main layout, make sure to return back visibility when input field is clear
  $(".new-category").removeClass("is-flex");
  $(".new-category").css("display", "none");

  for (let data of dataset) {
    const querySiteLayout = categoryPasswordLayout(data);
    $(".category-container").append(querySiteLayout);
    reloadEventListeners();
  }
}
