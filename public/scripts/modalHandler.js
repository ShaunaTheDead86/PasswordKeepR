// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
  $($el).find("input")[0].focus(); // focus the first input
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
    // currently filter out "Uncategorized" from DB, but should be refactored to have additional boolean column.
    const UNCATEGORIZED = "Uncategorized";
    for (const item of categories) {
      if (item.name === UNCATEGORIZED) {
        continue;
      }
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

// load event listeners that aren't on dynamically created HTML elements only once
$(document).ready(function() {
  $("#new-category-form").on("submit", function(event) {
    event.preventDefault();
    const data = $("#new-category-form").serializeArray();

    $.ajax({
      url: "/api/categories/create",
      data: { name: data[0].value },
      type: "POST",
      success: function(res) {
        $(".new-category-name").val("");
        closeAllModals();
        return renderCategories();
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $("#edit-category-form").on("submit", function(event) {
    event.preventDefault();
    const data = $("#edit-category-form").serializeArray();

    $.ajax({
      url: "/api/categories/edit",
      data: { oldName: data[0].value, newName: data[1].value },
      type: "POST",
      success: function(res) {
        $(".edit-category-name").val("");
        closeAllModals();
        return renderCategories();
      },
      error: function(err) {
        console.log(err);
      }
    });
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
});

// reload function for event listeners on dynamically created HTML elements
const reloadEventListeners = function() {
  // prevent default action on all links (action will be handled in code)
  $("a").click(function(event) {
    event.preventDefault();
  });

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', function() {

      if (modal === "edit-password-modal") {
        const passwordID = $(trigger).children(".password-id").val();
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

      if (modal === "edit-category-modal") {
        const categoryID = $(trigger).find(".category-id").val();
        $(".edit-category-id").val(categoryID);
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
          console.log(res)
          return renderCategories();
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  });

  // listener for category delete buttons and on click event
  (document.querySelectorAll(".category-delete-button") || []).forEach((trigger) => {
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      const deleteTarget = $(this).closest(".category-outer");
      const targetCategoryID = deleteTarget.attr("value");

      // get the details of the uncategorized category to use later
      $.ajax({
        url: "/api/categories/uncategorized",
        type: "GET",
        success: function(res) {
          const uncategorizedID = res[0].id;
          $.ajax({
            url: "/api/credentials/move",
            data: { target: targetCategoryID, newCategory: uncategorizedID },
            type: "POST",
            success: function(res) {
              $.ajax({
                url: "/api/categories/delete",
                data: { target: targetCategoryID },
                type: "POST",
                success: function(res) {
                  // on success reload the categories display
                  closeAllModals();
                  return renderCategories();
                },
                error: function(err) {
                  console.log(err);
                }
              });
            },
            error: function(err) {
              console.log(err);
            }
          });
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  });
}
