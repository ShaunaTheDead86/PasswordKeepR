// Client facing scripts here
const createNewItemOnSubmit = function (str) {
  $('#create-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#create-credential-form").serialize();
    const password = escapeScript($("#password").val());
    if (password.length < 6) {
      showErrorMessage("Password is not strong enough!");
      return;
    };
    $.post('/api/credentials', params).then((credential) => {
      muteErrorMessage();
      // close popup
      $("#new-item-modal").removeClass('is-active');  

      // Inject new credential code goes here
    });
  });
};

// helper to prevent Cross Site Scripting
const escapeScript = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// helper to show the error message
const showErrorMessage = function(errorMessage) {
  $("#error-message").html(errorMessage);
  $("#error-message").slideDown("slow");
}

// helper to clear the error message
const muteErrorMessage = function() {
  $("#error-message").slideUp()
  $("#error-message").html("");
}

$( document ).ready(function() {
  createNewItemOnSubmit();
});