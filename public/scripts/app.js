// Client facing scripts here

// Le Minh

const registerNewPasswordFormEvents = function() {
  createNewPasswordOnSubmit();
  generatePassOnEvents();
  togglePassword();
  updatePasswordStrengthBar();

}

const login = function(str) {
  $('#login-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#login-form").serialize();
    $.post('/api/login', params).then((user) => {
      $("#login-button").hide();
      $("#login-email").text(user.email);
      $("#login-email").show();
      $("#create-new-button").attr("hidden", false);
    })
    $("#login-modal").removeClass('is-active');
  });
};

const createNewPasswordOnSubmit = function(str) {
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
      $("#password-strength-bar").val(0);
      $("#new-password-modal").removeClass('is-active');

      // Inject new credential code goes here
      renderCategories();
    })
  });
};

const generatePassOnEvents = function() {

  $('#incl-upper').on('change', (evt) => {
    generateNewPass();
  });
  $('#incl-number').on('change', (evt) => {
    generateNewPass();
  });
  $('#incl-special').on('change', (evt) => {
    generateNewPass();
  });
  $('#pass-length').on('change', (evt) => {
    generateNewPass();
  });
  $('#passRange').on('change', (evt) => {
    generateNewPass();
    $("#pass-length").text($('#passRange').val());
  });
}

const generateNewPass = function() {
  const inclUpper = $("#incl-upper").is(":checked");
  const inclNum = $("#incl-number").is(":checked");
  const inclSpecial = $("#incl-special").is(":checked");
  const passLength = $('#passRange').val();

  let characterPool = "abcdefghijklmnopqrstuvxyz";
  if (inclUpper) {
    characterPool += "ABCDEFGHIJKLMNOPQRSTUVXYZ";
  }
  if (inclNum) {
    characterPool += "012345678901234567890123456789";
  }
  if (inclSpecial) {
    characterPool += "!@#$%^&*()[]{}!@#$%^&*()[]{}!@#$%^&*()[]{}!@#$%^&*()[]{}";
  }
  let password = "";
  const poolLength = characterPool.length;
  for (let i = 0; i < passLength; i++) {
    password += characterPool.charAt(Math.floor(Math.random() * poolLength));
  }
  $("#password").val(password);
  $("#password").trigger('input');
}

const togglePassword = function() {
  $('#reveal').on('click', (evt) => {
    let type = $("#password").attr('type');
    if (type == 'password') {
      $('#password').attr('type', 'text');
    } else {
      $('#password').attr('type', 'password');
    }
  })
};

const updatePasswordStrengthBar = function() {
  $('#password').on('input', (evt) => {
    const pass = $('#password').val();
    const strength = testPassStrength(pass);

    if (strength === "failure") {
      $("#password-strength-bar").val(0);
      $("#password-strength-bar").removeClass('is-warning');
      $("#password-strength-bar").removeClass('is-success');
      $("#password-strength-bar").removeClass('is-danger');
    }
    if (strength === "weak") {
      $("#password-strength-bar").val(25);
      $("#password-strength-bar").removeClass('is-success');
      $("#password-strength-bar").removeClass('is-warning');
      $("#password-strength-bar").removeClass('is-info');
      $("#password-strength-bar").addClass('is-danger');
    }
    if (strength === "medium") {
      $("#password-strength-bar").val(50);
      $("#password-strength-bar").removeClass('is-danger');
      $("#password-strength-bar").removeClass('is-success');
      $("#password-strength-bar").removeClass('is-info');
      $("#password-strength-bar").addClass('is-warning');
    }
    if (strength === "strong") {
      $("#password-strength-bar").val(75);
      $("#password-strength-bar").removeClass('is-warning');
      $("#password-strength-bar").removeClass('is-danger');
      $("#password-strength-bar").removeClass('is-success');
      $("#password-strength-bar").addClass('is-info');
    }
    if (strength === "absolute") {
      $("#password-strength-bar").val(100);
      $("#password-strength-bar").removeClass('is-warning');
      $("#password-strength-bar").removeClass('is-danger');
      $("#password-strength-bar").removeClass('is-info');
      $("#password-strength-bar").addClass('is-success');
    }
  })
};

//helper to test password strength level
function testPassStrength(pass) {
  // Regex to check if a string contains uppercase, lowercase, special character & numeric value
  const hasNum = /\d/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasSpecial = /[!@#$%^&*()\[\]{}]/.test(pass);
  const length = pass.length;

  if (length < 6) {
    return "failure"
  }
  // all 3 criterias met
  if (hasUpper && hasNum && hasSpecial) {
    return "absolute";
  }
  // 2 out of 3 criterias met
  if ((hasUpper && hasNum && !hasSpecial) || (hasUpper && !hasNum && hasSpecial) || (!hasUpper && hasNum && hasSpecial)) {
    return "strong";
  }
  // 1 out of 3 criterias met
  if ((hasUpper && !hasNum && !hasSpecial) || (!hasUpper && !hasNum && hasSpecial) || (!hasUpper && hasNum && !hasSpecial)) {
    return "medium";
  }
  return "weak";
}


// helper to prevent Cross Site Scripting
const escapeScript = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// helper to show the error message
const showErrorMessage = function(errorMessage) {
  $(".error-message").html(errorMessage);
  $(".error-message").slideDown("slow");
}

// helper to clear the error message
const muteErrorMessage = function() {
  $(".error-message").slideUp()
  $(".error-message").html("");
}

// assign each pswd to corresponding website_name as an obj and add this obj to an array that assigned to corresponding category name

//can remove that function since it never called
const groupCategWithPswds = (obj) => {

  const categoryWithPassword = {};

  for (let item of obj.categories) {
    let newObj = {};
    newObj[item.password_name] = item.password;

    let categoryName = item.category;
    if (!categoryWithPassword[categoryName]) {
      categoryWithPassword[categoryName] = [];


      categoryWithPassword[categoryName].push(newObj);
    } else {
      categoryWithPassword[categoryName].push(newObj);
    }
  }

  return categoryWithPassword;
}

// Shauna
const generateLayouts = function(credentials, categories) {
  $(".category-container").empty();
  $(`#${category.name}-pswd`).empty();

  let uncategorized;

  for (const category of categories) {
    if (category.name !== "Uncategorized") {
      const categoryLayout = createCategoryLayout(category)
      $(".category-container").append(categoryLayout)
    } else {
      uncategorized = category;
    }
  }

  // create uncategorized last
  const categoryLayout = createUncategorized(uncategorized)
  $(".category-container").append(categoryLayout)

  for (const category of categories) {

    for (const credential of credentials) {
      if (category.id === credential.category_id) {

        const passwordLayout = createPswdLayout({ id: credential.id, name: credential.name, password: credential.password })
        $(`#${category.name}-pswd`).append(passwordLayout);
      }
    }
  }
}

// gets data from the server and appends to the main layout
const renderCategories = () => {
  $(".category-container").empty();
  $.get("/api/credentials")
    .then((credentials) => {
      $.get("/api/categories")
        .then((categories) => {
          generateLayouts(credentials.credentials, categories.categories);
          reloadEventListeners();
          // copy to clip
          copyPswdToClipboard();

        });
    });
}

const createUncategorized = function(category) {
  const uncategorizedLayout = `
  <details class="category-outer" value="${category.id}">
    <summary class="has-background-primary">
      <div class="is-size-5 has-text-white mx-2">
        <i class="fa-solid fa-vault mx-2"></i> ${category.name}
      </div>
    </summary>
    <p id="${category.name}-pswd" class="is-size-6 has-text-weight-bold has-text-primary">

    </p>
  </details>
  `;

  return uncategorizedLayout;
}

const createCategoryLayout = (category) => {
  const categoryLayout = `
  <details class="category-outer" value="${category.id}">
  <summary class="has-background-primary">
  <div class="is-size-5 has-text-white mx-2">
  <i class="fa-solid fa-vault mx-2"></i> ${category.name}
  <a href=" " class="has-text-white mx-2">
  <i class="fa-solid fa-pen-to-square js-modal-trigger" data-target="edit-category-modal">
  <input class="is-hidden category-id" value="${category.id}" />
  </i>
  </a>
  <a href=" " class="has-text-white mx-2">
  <i class="fa-solid fa-rectangle-xmark category-delete-button"></i>
  </a>
  </div>
  </summary>
  <p id="${category.name}-pswd" class="is-size-6 has-text-weight-bold has-text-primary">

  </p>
  </details>
  `
  return categoryLayout;
}

const createPswdLayout = (data) => {

  const passwordLayout = `
  <div class="is-flex flex-direction-row div-password">
  <a href="" class="mx-2">
  <i class="fa-solid fa-key password-icon"></i> ${data.name}
  </a>
  <div class="mx-2 copy">

  <i password=${data.password} class="fa-solid fa-copy pswd-icon"></i>
  <p class="notification is-success is-light">Copied!</p>
  </div>
  <div class="field is-grouped is-grouped-right mx-2 ">
  <p class="control">
  <a class="js-modal-trigger mx-2" data-target="edit-password-modal">
<<<<<<< HEAD
    <input class="is-hidden password-id" value="${data.id}" />
  <i class="fa-solid fa-pen-to-square pswd-icon"></i>
=======
  <input class="is-hidden password-id" value="${data.id}" />
  <i class="fa-solid fa-pen-to-square"></i>
>>>>>>> master
  </a>
  </p>
  </div>
  <a href="" class="mx-2">
  <i class="fa-solid fa-rectangle-xmark delete-button"></i>
  </a>
  </div>
  `
  return passwordLayout;
}

$(document).ready(function() {
  // render category and corresponding pswd which are already in db
  renderCategories();
  registerNewPasswordFormEvents();
  login();
});


// copying password to clipboard on click
const copyPswdToClipboard = () => {
  $(".copy").on('click', (evt) => {
    evt.preventDefault()

    let password = $(evt.target).attr("password")
    let tempEl = document.createElement('input');
    tempEl.setAttribute('type', 'text');

    document.body.appendChild(tempEl);
    tempEl.value = password;
    tempEl.select();

    document.execCommand("copy");
    document.body.removeChild(tempEl);

    // shows a msg that pswd is copied to clipboard
    $(evt.target).next().show();

    setTimeout(() => {$(evt.target).next().hide(1000);}, 1000);
    console.log('copied')

  })
}
