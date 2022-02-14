document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    console.log($el.id);
    $el.classList.add('is-active');
    if ($el.id === "new-password-modal") {
      loadCreateNewPasswordForm();
    } else if ($el.id === "edit-password-modal") {
      console.log($el.id);
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

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    console.log($target);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });

  const loadCreateNewPasswordForm = function() {
    $("#password").val("");
    $.get('/categories').then((categories) => {
      let $dropdown = $("#category");
      $dropdown.empty();
      $.each(categories, function() {
        $dropdown.append($("<option />").val(this.id).text(this.name));
      });
    });
  };

  const loadEditPasswordForm = function() {
    $("#edit-password").val("");
    $.get('/categories').then((categories) => {
      let $dropdown = $("#category");
      $dropdown.empty();
      $.each(categories, function() {
        $dropdown.append($("<option />").val(this.id).text(this.name));
      });
    });
  };
});
