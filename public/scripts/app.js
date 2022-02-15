// Client facing scripts here

// Le Minh
const login = function(str) {
  $('#login-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#login-form").serialize();
    $.post('/api/login', params).then((user) => {
      $("#login-button").hide();
      $("#login-email").text(user.email);
      $("#login-email").show();
    })
    $("#login-modal").removeClass('is-active');
  });
};

const createNewItemOnSubmit = function(str) {
  $('#create-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#create-credential-form").serialize();
    const password = escapeScript($("#password").val());
    if (password.length < 6) {
      showErrorMessage("Password is not strong enough!");
      return;
    };
    $.post('/credentials', params).then((credential) => {
      muteErrorMessage();
      // close popup
      $("username").val("");
      $("password").val("");
      $("name").val("");
      $("url").val("");
      $("#new-password-modal").removeClass('is-active');

      // Inject new credential code goes here
      loadCategories();
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
    characterPool += "0123456789";
  }
  if (inclSpecial) {
    characterPool += "!@#$%^&*()[]{}";
  }
  let password = "";
  const poolLength = characterPool.length;
  for (let i = 0; i < passLength; i++) {
    password += characterPool.charAt(Math.floor(Math.random() * poolLength));
  }
  $("#password").val(password);
}

const togglePassword = function() {
  $('#reveal').on('click', (evt) => {
    var type = document.getElementById("password").type;
    if (type == 'password') {
      document.getElementById("password").type = "text";
    } else {
      document.getElementById("password").type = "password";
    }
  })
};

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

const getCredentials = async function() {

}

// assign each pswd to corresponding website_name as an obj and add this obj to an array that assigned to corresponding category name
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
  console.log(categoryWithPassword)
  return categoryWithPassword;
}

// Shauna
const generateLayouts = function(credentials, categories) {
  for (const category of categories) {
    const categoryLayout = createCategoryLayout(category.name)
    $(".category-container").append(categoryLayout)
  }

  for (const category of categories) {
    for (const credential of credentials) {
      if (category.id === credential.category_id) {
        const passwordLayout = createPswdLayout({ id: credential.id, name: credential.name })
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
          loadEventListenerCopyBtn();

        });
    });
}

const createCategoryLayout = (category) => {
  const categoryLayout = `
  <details>
    <summary class="has-background-primary">
      <div class="is-size-5 has-text-white mx-2">
        <i class="fa-solid fa-vault mx-2"></i> ${category}
        <a href=" " class="has-text-white mx-2">
          <i class="fa-solid fa-pen-to-square"></i>
        </a>
        <a href=" " class="has-text-white mx-2">
          <i class="fa-solid fa-rectangle-xmark"></i>
        </a>
      </div>
    </summary>
    <p id="${category}-pswd" class="is-size-6 has-text-weight-bold has-text-primary">

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
  <a href=" " class="mx-2">
  <i class="fa-solid fa-copy"></i>
  </a>
  <div class="field is-grouped is-grouped-right mx-2">
  <p class="control">
  <a class="js-modal-trigger mx-2" data-target="edit-password-modal">
    <input class="is-hidden password-id " value="${data.id}" />
  <i class="fa-solid fa-pen-to-square"></i>
  </a>
  </p>
  </div>
  <a href="" class="mx-2">
  <i class="fa-solid fa-rectangle-xmark"></i>
  </a>
  </div>
  `
  return passwordLayout;
}


$(document).ready(function() {
  // render category and corresponding pswd which are already in db
  renderCategories();
  createNewItemOnSubmit();
  generatePassOnEvents();
  togglePassword();
  login();
});
