// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
  $($el).find("input")[0].focus(); // focus the first input

  if ($el.id === "new-password-modal") {
    $("#new-password-password").val("");
    $("#password-strength-bar").val(0);
    $("#pass-length").val(0);
    $("#auto-gen-password-section").addClass("is-hidden");
    populateCategoryDropdown(".new-form-category");
  }

  if ($el.id === "login-modal") {
    $("#login-username").focus();
  }
}

function closeModal($el) {
  $el.classList.remove('is-active');
}

function closeAllModals() {
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
    closeModal($modal);
  });
}
