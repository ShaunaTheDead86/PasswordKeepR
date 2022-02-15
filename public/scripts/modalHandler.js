// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
  if ($el.id === "new-password-modal") {
    loadCreateNewPasswordForm();
  } else if ($el.id === "edit-password-modal") {
    loadEditPasswordForm();
  } else if ($el.id === "login-modal") {
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

const populateCategoryDropdown = function(dropDownTarget) {
  $.get('/categories').then((categories) => {
    let $dropdown = $(dropDownTarget);
    $dropdown.empty();

    for (const item of categories) {
      $dropdown.append(`<option value="${item.id}">${item.name}</option>`);
    }
  });
}

const loadCreateNewPasswordForm = function() {
  $(".new-password-password").val("");
  populateCategoryDropdown("#category");
};

const loadEditPasswordForm = function() {
  $(".edit-form-password").val("");
  populateCategoryDropdown(".edit-category");
};

const reloadEventListeners = function() {
  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', function() {
      if (modal === "edit-password-modal") {
        const passwordID = $(this).children(".password-id").attr("value");
        $("#edit-credential-form").append(`<div class="field">
        <label class="label is-large edit-form-name"></label>
        <div class="control">
        <input type="hidden" id="password-id" type="text" name="password-id" value="${passwordID}">
        </div>
      </div>`);
      }
      openModal(target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach((close) => {
    const target = close.closest('.modal');

    close.addEventListener('click', () => {
      closeModal(target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });

  $('#edit-credential-form').on('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.entries(), formData.values());
    const params = $("#create-credential-form").serializeArray();
    const password = escapeScript($("#password").val());
    console.log(params);
  });
};
