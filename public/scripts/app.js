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
      // revealing search box when user is logged in
      $(".search-box").attr("hidden", false);
    })
    $("#login-modal").removeClass('is-active');
  });
};

// const createNewPasswordOnSubmit = function(str) {
//   $('#create-credential-form').on('submit', (evt) => {
//     evt.preventDefault();
//     const params = $("#create-credential-form").serialize();
//     const password = escapeScript($("#password").val());
//     if ($("#name").val() === undefined || $("#name").val() === "") {
//       showErrorMessage("Please enter an account name!");
//       return;
//     }
//     urlReg = /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/;
//     if (!urlReg.test($("#url").val())) {
//       showErrorMessage("Please enter a valid URL!");
//       return;
//     }
//     if ($("#username").val() === undefined || $("#username").val() === "" || $("#username").val().includes(" ")) {
//       showErrorMessage("Please enter a valid username!");
//       return;
//     }
//     if (password.length < 6) {
//       showErrorMessage("Password needs to be at least 6 character!");
//       return;
//     };
//     $.post('/credentials', params).then((credential) => {
//       muteErrorMessage();
//       // close popup
//       $("#username").val("");
//       $("#password").val("");
//       $("#name").val("");
//       $("#url").val("");
//       $("#new-password-modal").removeClass('is-active');

//       // Inject new credential code goes here
//       renderDisplay();
//     })
//   });
// };

// const generatePassOnEvents = function() {

//   $('#incl-upper').on('change', (evt) => {
//     generateNewPass();
//   });
//   $('#incl-number').on('change', (evt) => {
//     generateNewPass();
//   });
//   $('#incl-special').on('change', (evt) => {
//     generateNewPass();
//   });
//   $('#passRange').on('change', (evt) => {
//     generateNewPass();
//     $("#pass-length").text($('#passRange').val());
//   });
//   $('#generate').on('click', (evt) => {
//     generateNewPass();
//     $("#auto-gen-password-section").removeClass("is-hidden");
//   });
// }

// const generateNewPass = function() {
//   const inclUpper = $("#incl-upper").is(":checked");
//   const inclNum = $("#incl-number").is(":checked");
//   const inclSpecial = $("#incl-special").is(":checked");
//   const passLength = $('#passRange').val();

//   let characterPool = "abcdefghijklmnopqrstuvxyz";
//   if (inclUpper) {
//     characterPool += "ABCDEFGHIJKLMNOPQRSTUVXYZ";
//   }
//   if (inclNum) {
//     characterPool += "012345678901234567890123456789";
//   }
//   if (inclSpecial) {
//     characterPool += "!@#$%^&*()[]{}!@#$%^&*()[]{}!@#$%^&*()[]{}!@#$%^&*()[]{}";
//   }
//   let password = "";
//   const poolLength = characterPool.length;
//   for (let i = 0; i < passLength; i++) {
//     password += characterPool.charAt(Math.floor(Math.random() * poolLength));
//   }
//   $("#password").val(password);
//   $("#password").trigger('input');
// }

const createNewPasswordOnSubmit = function(str) {
  $('#edit-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#edit-credential-form").serialize();
    const password = escapeScript($(".password").val());
    if ($(".name").val() === undefined || $(".name").val() === "") {
      showErrorMessage("Please enter an account name!");
      return;
    }
    urlReg = /https?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|www\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/;
    if (!urlReg.test($(".url").val())) {
      showErrorMessage("Please enter a valid URL!");
      return;
    }
    if ($(".username").val() === undefined || $(".username").val() === "" || $(".username").val().includes(" ")) {
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
      $(".username").val("");
      $(".password").val("");
      $(".name").val("");
      $(".url").val("");
      $(".new-password-modal").removeClass('is-active');

      // Inject new credential code goes here
      renderDisplay();
    })
  });
};

const generatePassOnEvents = function() {

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
}

const generateNewPass = function() {
  const inclUpper = $(".incl-upper").is(":checked");
  const inclNum = $(".incl-number").is(":checked");
  const inclSpecial = $(".incl-special").is(":checked");
  const passLength = $('.passRange').val();

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
  $(".password").val(password);
  $(".password").trigger('input');
}

const togglePassword = function() {
  $('.reveal').on('click', (evt) => {
    let type = $(".password-hidden").attr('type');
    if (type == 'password') {
      $('.password-hidden').attr('type', 'text');
    } else {
      $('.password-hidden').attr('type', 'password');
    }
  })
};

const updatePasswordStrengthBar = function() {
  $('.password').on('input', (evt) => {
    const pass = $('.password').val();
    const strength = testPassStrength(pass);

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

const toggleActive = function(iconArr, target) {
  for (const icon of iconArr) {
    icon.removeClass("display-active");
  }

  target.addClass("display-active");
}

const getActiveDisplay = function() {
  const categoryIcon = $(".category-display");
  const boxIcon = $(".box-display");
  const listIcon = $(".list-display");
  const icons = [categoryIcon, boxIcon, listIcon];

  // iterate through icons and find the active one
  for (const icon of icons) {
    if (icon.hasClass("display-active")) {
      if (icon === categoryIcon) {
        toggleActive(icons, categoryIcon);
        return "category";
      } else if (icon === boxIcon) {
        toggleActive(icons, boxIcon);
        return "box";
      } else {
        toggleActive(icons, listIcon);
        return "list";
      }
    }
  }

  // have a default fallback of "category"
  toggleActive(icons, categoryIcon)
  return "category";
}

// main function that calls all other required functions
const renderDisplay = function() {
  $(".category-container").empty();
  $(".create-new-container").empty();
  $.get("/api/credentials")
    .then((credentials) => {
      $.get("/api/categories")
        .then((categories) => {
          const displayType = getActiveDisplay();
          if (displayType !== "list") {
            generateCategories(categories.categories, displayType);
          }
          generatePasswords(credentials.credentials, categories.categories, displayType);
          reloadEventListeners();
          copyPswdToClipboard();
        });
    });
}

// generate categories layout based on display type
const generateCategories = function(categories, displayType) {
  const categoryContainer = $(".category-container");
  const createNewContainer = $(".create-new-container");
  let uncategorized;

  categoryContainer.empty(); // make sure container is empty
  createNewContainer.empty(); // empty the "create new category" container

  // iterate through catergories to generate category list
  for (const category of categories) {
    if (category.name !== "Uncategorized") {
      if (displayType === "category") {
        const layout = categoryLayout(category);
        categoryContainer.append(layout);
      } else if (displayType === "box") {
        const layout = boxCategoryLayout(category);
        categoryContainer.append(layout);
      }
    } else {
      if (displayType === "category") {
        uncategorized = categoryUncategorizedLayout(category);
      } else if (displayType === "box") {
        uncategorized = boxUncategorizedLayout(category);
      }
    }
  }

  // append after all other categories
  if (displayType === "category") {
    categoryContainer.append(uncategorized);

    const layout = categoryCreateNewLayout();
    createNewContainer.append(layout)
  } else if (displayType === "box") {
    categoryContainer.append(uncategorized);

    const layout = boxCreateNewCategoryLayout();
    createNewContainer.append(layout);
  }
}

// generate password layouts based on display type
const generatePasswords = function(credentials, categories, displayType) {
  const listTarget = $(".category-container")
    // iterate through categories
  for (const category of categories) {
    let target = $(`.${category.name}-password`); // set the target to append to for each category
    // iterate through credentials to generate password list
    for (const credential of credentials) {
      if (category.id === credential.category_id) { // check if password id matches current category id
        if (displayType === "category") {
          const layout = categoryPasswordLayout(credential)
          target.append(layout);
        } else if (displayType === "box") {
          const layout = boxPasswordLayout(credential);
          target.append(layout);
        }

        if (displayType === "list") {
          const layout = categoryPasswordLayout(credential);
          listTarget.append(layout);
        }
      }
    }

    if (displayType === "box") {
      const layout = boxCreateNewPasswordLayout(category);
      target.append(layout);
    } else if (displayType === "category") {
      const layout = listCreateNewLayout();
      target.append(layout);
    }
  }

  if (displayType === "list") {
    const layout = listCreateNewLayout();
    listTarget.append(layout);
  }
}

const listCreateNewLayout = function() {
  const layout = `
  <div class="is-flex is-flex-direction-row is-align-items-center is-size-6 p-1 div-password">
  <div class="is-link-primary js-modal-trigger" data-target="new-password-modal">
  <i class="fa-solid fa-key mx-2 password-icon"></i>
  Create New Password
  <i class="fa-solid fa-plus mx-2"></i>
  </div>
  </div>
  `

  return layout;
}

/*----------------------------
| FORMATTING FOR BOX DISPLAY |
----------------------------*/

// generate dynamic HTML for the uncategorized category
const boxUncategorizedLayout = function(category) {
  const layout = `
  <div class="box has-background-primary py-2 px-4 m-2">
  <div class="is-link-light is-size-5">${category.name}</div>
  </div>
  <input class="is-hidden category-id" value="${category.id}" /></i>
  <article class="box is-flex is-flex-wrap-wrap has-background-primary px-2 py-2 mx-2 ${category.name}-password ">

  </article>
  `
  return layout;
}

// generate dynmic HTML for the other categories
const boxCategoryLayout = (category) => {
  const layout = `
  <div class="category-outer" value=${category.id}>
  <div class="box is-flex is-flex-direction-row has-background-primary py-2 px-4 m-2">
  <div class="is-link-light is-size-5">
  <i class="fa-solid fa-vault mx-2"></i>${category.name}
  </div>
  <div class="is-link-light is-size-5">
  <i class="fa-solid fa-pen-to-square is-link-light mx-2 js-modal-trigger" data-target="edit-category-modal">
  <input class="is-hidden category-id" value="${category.id}" /></i>
  </div>
  <div class="is-link-light is-size-5">
  <input class="is-hidden category-id" value="${category.id}" /></i>
  <i class="fa-solid fa-rectangle-xmark is-link-light mx-2 category-delete-button"></i>
</div>
  </div>
  </div>
  <input class="is-hidden category-id" value="${category.id}" /></i>
  <article class="box is-flex is-flex-wrap-wrap has-background-primary px-2 py-2 mx-2 ${category.name}-password">

  </article>
  </div>
  `
  return layout;
}

// generate dynamic HTML for the passwords
const boxPasswordLayout = (data) => {
  const layout = `
  <div class="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-squareish is-size-6 has-background-white has-text-centered m-2 div-password">
      <img src="${data.logo_url}" class="square"></img><br>
      <div class="is-link-primary">
        <i class="fa-solid fa-pen-to-square is-link-primary js-modal-trigger mx-2" data-target="edit-password-modal">
        <input class="is-hidden password-id" value="${data.id}" />
        </i>
        <i class="fa-solid fa-rectangle-xmark is-link-primary mx-2 delete-button"></i>
      </div>
      <div class="is-link-primary">
        <i class="fa-regular fa-user"></i> ${data.name}<br>
      </div>
      <a href="${data.url}" class="is-link-primary"><i class="fa-solid fa-link"></i> ${data.url}</a><br>
      <div class="is-link-primary">
        <i class="fa-regular fa-user"></i> ${data.username}<br>
      </div>
      <div  class="is-link-primary">
        </div>
        <input class="is-hidden password-id" value="${data.id}" />
        <div class="is-flex">
          <div class="is-link-primary"">
            <i class="fa-solid fa-key"></i>
            Password
            </div>
            <div class="is-link-primary mx-2 copy-button" password="${data.password}">
            <i class="fa-solid fa-copy">
            <div class="tag is-primary has-text-white copied-tag">Copied!</div>
            </i>
            <div>
        </div>
      </div>
    </div>
    `;

  return layout;
}

const boxCreateNewPasswordLayout = function() {
  const layout = `
  <div class="box is-flex is-justify-content-center is-align-items-center is-squareish is-size-6 has-background-white has-text-centered m-2">
  <div class="is-link-primary js-modal-trigger" data-target="new-password-modal">
  <i class="fa-solid fa-plus"></i>
  Create New</div>
  </div>
  `;

  return layout;
}

const boxCreateNewCategoryLayout = function() {
  const layout = `
  <div class="box is-flex is-flex-direction-row has-background-primary py-2 px-4 m-2">
  <div class="is-link-light is-size-5 js-modal-trigger" data-target="new-category-modal">
  <i class="fa-solid fa-vault mx-2"></i>
  Create New Category
  <i class="fa-solid fa-plus"></i>
  </div>
  </div>
  `;

  return layout;
}

/*---------------------------------
| FORMATTING FOR CATEGORY DISPLAY |
---------------------------------*/

// generate dynamic HTML for the uncategorized category
const categoryUncategorizedLayout = function(category) {
  const layout = `
  <details class="category-outer" value="${category.id}">
    <summary class="has-background-primary">
      <div class="is-flex is-flex-direction-row is-align-items-center is-size-5 p-1">
      <div class="is-link-light">
        <i class="fa-solid fa-vault mx-2"></i>${category.name}
        </div>
      </div>
    </summary>
    <p class="has-text-weight-bold has-text-primary ${category.name}-password">

    </p>
  </details>
  `;

  return layout;
}

// generate dynmic HTML for the other categories
const categoryLayout = (category) => {
  const layout = `
  <details class="category-outer" value="${category.id}">
    <summary class="has-background-primary">
      <div class="is-flex is-flex-direction-row is-align-items-center is-size-5 p-1">
        <div class="is-link-light">
          <i class="fa-solid fa-vault mx-2"></i>${category.name}
        </div>
        <i class="fa-solid fa-pen-to-square is-link-light mx-2 js-modal-trigger" data-target="edit-category-modal">
        <input class="is-hidden category-id" value="${category.id}" /></i>
        <i class="fa-solid fa-rectangle-xmark is-link-light mx-2 category-delete-button"></i>
      </div>
    </summary>
    <p class="is-size-6 has-text-weight-bold has-text-primary ${category.name}-password">

    </p>
  </details>
  `
  return layout;
}

// generate dynamic HTML for the passwords
const categoryPasswordLayout = (data) => {

  const layout = `
  <div class="is-flex is-flex-direction-row is-align-items-center is-size-6 p-1 div-password">
  <div class="is-link-primary">
  <i class="fa-solid fa-key mx-2 password-icon"></i> ${data.name}
  </div>
  <div class="is-link-primary mx-2 copy-button" password="${data.password}">
  <i class="fa-solid fa-copy mx-2 is-link-primary copy pswd-icon">
  <div class="tag is-primary has-text-white copied-tag">Copied!</div>
  </i>
  </div>
  <i class="fa-solid fa-pen-to-square is-link-primary js-modal-trigger mx-2" data-target="edit-password-modal">
  <input class="is-hidden password-id" value="${data.id}" />
  </i>
  <i class="fa-solid fa-rectangle-xmark is-link-primary mx-2 delete-button"></i>
  </div>
  `
  return layout;
}

const categoryCreateNewLayout = function() {
  const layout = `<div class="new-category is-flex is-flex-direction-row is-align-items-center  is-size-5 has-background-primary p-1 js-modal-trigger" data-target="new-category-modal">
  <div class="is-link-light">
  <i class=" fa-solid fa-vault mx-2"></i>Create New Category
  </div>
  </div>`;

  return layout;
}

// functions to run on document ready
$(document).ready(function() {
  // render category and corresponding pswd which are already in db
  renderDisplay();
  registerNewPasswordFormEvents();
  login();
  search();

  const categoryIcon = $(".category-display");
  const boxIcon = $(".box-display");
  const listIcon = $(".list-display");
  const icons = [categoryIcon, boxIcon, listIcon];

  // event listeners for display icons
  categoryIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, categoryIcon);
    return renderDisplay("category");
  });

  boxIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, boxIcon);
    return renderDisplay("box");
  });

  listIcon.click(function(event) {
    event.preventDefault();
    // make sure only one is active
    toggleActive(icons, listIcon);
    return renderDisplay("list");
  });
});

// copying password to clipboard on click
const copyPswdToClipboard = () => {
  (document.querySelectorAll(".copy-button") || []).forEach((trigger) => {

    trigger.addEventListener('click', function() {
      const target = $(trigger).find(".copied-tag");
      const password = $(trigger).attr("password");
      let tempEl = document.createElement('input');
      tempEl.setAttribute('type', 'text');

      document.body.appendChild(tempEl);
      tempEl.value = password;
      tempEl.select();

      document.execCommand("copy");
      document.body.removeChild(tempEl);

      // shows a msg that pswd is copied to clipboard
      target.css("visibility", "visible");

      setTimeout(() => { target.css("visibility", "hidden"); }, 1500);
    });


  })
};
