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

  (document.querySelectorAll('.reveal') || []).forEach((trigger) => {
    trigger.addEventListener('input', function() {
      const pass = $('.password').val(); // TODO
      const strength = testPassStrength(pass); // TODO

      if (strength === "failure") {
        $(".password-strength-bar").val(0);
        $(".password-strength-bar").removeClass('is-warning');
        $(".password-strength-bar").removeClass('is-success');
        $(".password-strength-bar").removeClass('is-danger');
      }
      if (strength === "weak") {
        $(".password-strength-bar").val(25);
        $(".password-strength-bar").removeClass('is-success');
        $(".password-strength-bar").removeClass('is-warning');
        $(".password-strength-bar").removeClass('is-info');
        $(".password-strength-bar").addClass('is-danger');
      }
      if (strength === "medium") {
        $(".password-strength-bar").val(50);
        $(".password-strength-bar").removeClass('is-danger');
        $(".password-strength-bar").removeClass('is-success');
        $(".password-strength-bar").removeClass('is-info');
        $(".password-strength-bar").addClass('is-warning');
      }
      if (strength === "strong") {
        $(".password-strength-bar").val(75);
        $(".password-strength-bar").removeClass('is-warning');
        $(".password-strength-bar").removeClass('is-danger');
        $(".password-strength-bar").removeClass('is-success');
        $(".password-strength-bar").addClass('is-info');
      }
      if (strength === "absolute") {
        $(".password-strength-bar").val(100);
        $(".password-strength-bar").removeClass('is-warning');
        $(".password-strength-bar").removeClass('is-danger');
        $(".password-strength-bar").removeClass('is-info');
        $(".password-strength-bar").addClass('is-success');
      }
    });
  });

  (document.querySelectorAll('.reveal') || []).forEach((trigger) => {
    trigger.addEventListener('click', function() {
      let type = $(".password-hidden").attr('type'); // TODO
      if (type == 'password') {
        $('.password-hidden').attr('type', 'text');
      } else {
        $('.password-hidden').attr('type', 'password');
      }
    });
  });

  $('.incl-upper').on('change', (evt) => {
    generateNewPass();
  });
  $('.incl-number').on('change', (evt) => {
    generateNewPass();
  });
  $('.incl-special').on('change', (evt) => {
    generateNewPass();
  });
  $('.passRange').on('change', (evt) => {
    generateNewPass();
    $(".pass-length").text($('.passRange').val());
  });
  $('.generate').on('click', (evt) => {
    generateNewPass();
    $(".auto-gen-password-section").removeClass("is-hidden");
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
    console.log(data);
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
    console.log(data);

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
