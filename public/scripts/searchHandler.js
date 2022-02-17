const search = () => {

  //submission of form data to the server using post
  $("#search-form").on('submit', (evt) => {
    evt.preventDefault();
    const passwordSearch = $("#search-form").serializeArray();

    $.ajax({
      url: "/api/credentials/search",
      data: passwordSearch,
      type: "POST",
      success: function(res) {
        //fetch the response of the server
        console.log(res.searchResult[0])

      },
      error: function(err) {
        console.log(err);
      }
    });

  })
};
