// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
  if ($el.id === "new-password-modal") {
    loadCreateNewPasswordForm();
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

const populateCategoryDropdown = function(dropDownTarget, defaultCategory) {
  $.get('/categories').then((categories) => {
    let $dropdown = $(dropDownTarget);
    $dropdown.empty();

    for (const item of categories) {
      if (item.id === defaultCategory) {
        $dropdown.append(`<option value="${item.id}" selected="selected">${item.name}</option>`);
      } else {
        $dropdown.append(`<option value="${item.id}">${item.name}</option>`);
      }
    }
  });
}

const loadCreateNewPasswordForm = function() {
  $(".new-password-password").val("");
  $("#password-strength-bar").val(0);
  populateCategoryDropdown("#category");
};

const reloadEventListeners = function() {
  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', function() {
      const passwordID = $(trigger).children(".password-id").val();

      if (modal === "edit-password-modal") {
        $.ajax({
          url: "/api/credentials/id",
          data: { passwordID: passwordID },
          type: "GET",
          success: function(res) {
            $(".edit-password-id").attr("value", `${passwordID}`);
            $(".edit-form-name").val(res[0].name);
            $(".edit-url").val(res[0].url);
            $(".edit-form-username").val(res[0].username);
            $(".edit-form-password").val(res[0].password);
            return populateCategoryDropdown(".edit-category", res[0].category_id);
          },
          error: function(err) {
            console.log(err);
          }
        });
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
    const data = $("#edit-credential-form").serializeArray();
    const password = escapeScript(data[4].value);

    if (password.length < 6) {
      return showErrorMessage("Password is not strong enough!");
    }

    $.ajax({
      url: "/api/credentials/edit",
      data: data,
      type: "POST",
      success: function(res) {
        closeAllModals();
        return renderCategories();
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  // prevent default action on all links (action will be handled in code)
  $("a").click(function(event) {
    event.preventDefault();
  });

  // Add a click event on buttons
  (document.querySelectorAll(".delete-button") || []).forEach((trigger) => {
    trigger.addEventListener('click', function(event) {
      const deleteTarget = $(this).closest(".div-password");
      const passwordID = deleteTarget.find(".password-id").val();

      $.ajax({
        url: "/api/credentials/delete",
        data: { passwordID: passwordID },
        type: "GET",
        success: function(res) {
          renderCategories();
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  });
};
