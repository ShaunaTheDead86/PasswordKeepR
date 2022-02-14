// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
  if ($el.id === "new-password-modal") {
    loadCreateNewPasswordForm();
  } else if ($el.id === "edit-password-modal") {
    loadEditPasswordForm();
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


const populateCategoryDropdown = function() {
  $.get('/categories').then((categories) => {
    let $dropdown = $(".edit-category");
    $dropdown.empty();

    for (const item of categories) {
      console.log(item);
      $dropdown.append(`<option>${item.name}</option>`);
    }
  });
}

const loadCreateNewPasswordForm = function() {
  $("#password").val("");
  $.get('/categories').then((categories) => {
    let $dropdown = $(".category");
    $dropdown.empty();
    $.each(categories, function() {
      $dropdown.append($("<option />").val(this.id).text(this.name));
    });
  });
};

const loadEditPasswordForm = function() {
  $(".password").val("");
  populateCategoryDropdown();
};

const reloadEventListeners = function() {
  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', () => {
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
}