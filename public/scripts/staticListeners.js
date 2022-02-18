const loadStaticListeners = function() {
  $("#keyword").on('input', () => {
    // evt.preventDefault();
    let passwordSearch = $("#keyword").val();

    if (passwordSearch.length > 0) {
      $.ajax({
        url: "/api/credentials/search",
        data: { website: passwordSearch },
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

  const categoryIcon = $(".category-display");
  const boxIcon = $(".box-display");
  const listIcon = $(".list-display");
  const icons = [categoryIcon, boxIcon, listIcon];

  // event listeners for display icons
  categoryIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, categoryIcon);
    renderDisplay("category");
  });

  boxIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, boxIcon);
    renderDisplay("box");
  });

  listIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, listIcon);
    renderDisplay("list");
  });

  (document.querySelectorAll('.js-modal-trigger-static') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', function() {
      openModal(target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot') || []).forEach((close) => {
    const target = close.closest('.modal');

    close.addEventListener('click', () => {
      closeModal(target);
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;

      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });

  (document.querySelectorAll('.password-input') || []).forEach((trigger) => {
    $(trigger).on("change", function() {
      const pass = $(trigger).val();
      const strength = testPassStrength(pass);
      const form = $(trigger).closest("form");
      const passwordStrengthBar = form.find(".password-strength-bar");

      if (strength === "failure") {
        passwordStrengthBar.val(0);
        passwordStrengthBar.removeClass('is-warning');
        passwordStrengthBar.removeClass('is-success');
        passwordStrengthBar.removeClass('is-danger');
      }
      if (strength === "weak") {
        passwordStrengthBar.val(25);
        passwordStrengthBar.removeClass('is-success');
        passwordStrengthBar.removeClass('is-warning');
        passwordStrengthBar.removeClass('is-info');
        passwordStrengthBar.addClass('is-danger');
      }
      if (strength === "medium") {
        passwordStrengthBar.val(50);
        passwordStrengthBar.removeClass('is-danger');
        passwordStrengthBar.removeClass('is-success');
        passwordStrengthBar.removeClass('is-info');
        passwordStrengthBar.addClass('is-warning');
      }
      if (strength === "strong") {
        passwordStrengthBar.val(75);
        passwordStrengthBar.removeClass('is-warning');
        passwordStrengthBar.removeClass('is-danger');
        passwordStrengthBar.removeClass('is-success');
        passwordStrengthBar.addClass('is-info');
      }
      if (strength === "absolute") {
        passwordStrengthBar.val(100);
        passwordStrengthBar.removeClass('is-warning');
        passwordStrengthBar.removeClass('is-danger');
        passwordStrengthBar.removeClass('is-info');
        passwordStrengthBar.addClass('is-success');
      }
    });
  });

  (document.querySelectorAll('.reveal') || []).forEach((trigger) => {
    trigger.addEventListener('click', function() {
      let type = $(".password-hidden").attr('type');
      if (type == 'password') {
        $('.password-hidden').attr('type', 'text');
      } else {
        $('.password-hidden').attr('type', 'password');
      }
    });
  });

  (document.querySelectorAll('.incl-upper') || []).forEach((trigger) => {
    trigger.addEventListener("input", function() {
      const form = $(trigger).closest("form");
      const target = form.find(".password-input");
      generateNewPass(form);
      target.trigger("change");
    });
  });

  (document.querySelectorAll('.incl-number') || []).forEach((trigger) => {
    trigger.addEventListener("input", function() {
      const form = $(trigger).closest("form");
      const target = form.find(".password-input");
      generateNewPass(form);
      target.trigger("change");
    });
  });

  (document.querySelectorAll('.incl-special') || []).forEach((trigger) => {
    trigger.addEventListener("input", function() {
      const form = $(trigger).closest("form");
      const target = form.find(".password-input");
      generateNewPass(form);
      target.trigger("change");
    });
  });

  (document.querySelectorAll('.passRange') || []).forEach((trigger) => {
    trigger.addEventListener("input", function() {
      const parent = $(trigger).closest(".slidecontainer");
      const passLength = parent.find(".pass-length");
      const form = $(trigger).closest("form");
      const target = form.find(".password-input");
      passLength.text($(trigger).val());
      generateNewPass(form);
      target.trigger("change");
    });
  });

  (document.querySelectorAll('.generate') || []).forEach((trigger) => {
    trigger.addEventListener('click', function() {
      $(".auto-gen-password-section").removeClass("is-hidden");
      const form = $(trigger).closest("form");
      const target = form.find(".password-input");
      generateNewPass(form);
      target.trigger("change");
    });
  });

  $('#create-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#create-credential-form").serialize();
    const password = escapeScript($("#password").val());
    if ($("#name").val() === undefined || $("#name").val() === "") {
      showErrorMessage("Please enter an account name!");
      return;
    }
    urlReg = /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/;
    if (!urlReg.test($("#url").val())) {
      showErrorMessage("Please enter a valid URL!");
      return;
    }
    if ($("#username").val() === undefined || $("#username").val() === "" || $("#username").val().includes(" ")) {
      showErrorMessage("Please enter a valid username!");
      return;
    }
    if (password.length < 6) {
      showErrorMessage("Password needs to be at least 6 character!");
      return;
    };
    $.post('/credentials', params).then((credential) => {
      muteErrorMessage();
      // close popup
      $("#username").val("");
      $("#password").val("");
      $("#name").val("");
      $("#url").val("");
      $("#new-password-modal").removeClass('is-active');

      // Inject new credential code goes here
      renderDisplay();
    })
  });

  $('#edit-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#edit-credential-form").serialize();
    const form = $("#edit-credential-form");
    const name = form.find(".edit-form-name");
    const url = form.find(".edit-form-url");
    const username = form.find(".edit-form-username");
    const unescapedPassword = form.find(".edit-form-password");
    const password = escapeScript(unescapedPassword.val());

    if (name.val() === undefined || name.val() === "") {
      showErrorMessage("Please enter an account name!");
      return;
    }
    urlReg = /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/;
    if (!urlReg.test(url.val())) {
      showErrorMessage("Please enter a valid URL!");
      return;
    }
    if (username.val() === undefined || username.val() === "" || username.val().includes(" ")) {
      showErrorMessage("Please enter a valid username!");
      return;
    }
    if (password.length < 6) {
      showErrorMessage("Password needs to be at least 6 character!");
      return;
    };

    const data = $("#edit-credential-form").serializeArray();
    $("#edit-password-modal").removeClass('is-active');

    $.ajax({
      url: "/api/credentials/edit",
      data: data,
      type: "POST",
      success: function(res) {
        closeAllModals();
        renderDisplay();
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

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
        renderDisplay();
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
        renderDisplay();
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#login-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#login-form").serialize();
    $.post('/api/login', params).then((user) => {
      $("#login-button").hide();
      $("#login-email").text(user.email);
      $("#login-email").show();
      $("#create-new-button").attr("hidden", false);
      // revealing search box when user is logged in
      $(".search-box").attr("hidden", false);
      $(".icons-display").attr("hidden", false);
      renderDisplay();
    })
    $("#login-modal").removeClass('is-active');
  });
}
