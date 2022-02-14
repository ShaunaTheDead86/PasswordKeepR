// Client facing scripts here

const loadCategories = () => {

  // fetch obj with db data from server
  $.get("/api/categories")
    .then((data) => {
      renderCategories(data);
    })
};

// Le Minh
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
  for (let i = 0; i < passLength; i++ ) {
    password += characterPool.charAt(Math.floor(Math.random() * poolLength));
  }
  $("#password").val(password);
}

// Shauna
const editItemOnSubmit = function(str) {
  $('#edit-credential-form').on('submit', (evt) => {
    evt.preventDefault();
    const params = $("#edit-credential-form").serialize();
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
      $("#edit-password-modal").removeClass('is-active');

      // Inject new credential code goes here
      loadCategories();
    })
  });
};

// helper to prevent Cross Site Scripting
const escapeScript = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// helper to show the error message
const showErrorMessage = function(errorMessage) {
  $("#error-message").html(errorMessage);
  $("#error-message").slideDown("slow");
}

// helper to clear the error message
const muteErrorMessage = function() {
  $("#error-message").slideUp()
  $("#error-message").html("");
}


/// Nastasi

const combineCategWithPswd = (obj) => {

  const categoryWithPassword = {};

  for (let item of obj.categories) {

    let categoryName = item.category;
    if (!categoryWithPassword[categoryName]) {
      categoryWithPassword[categoryName] = []
      categoryWithPassword[categoryName].push(item.password_name)
    } else {
      categoryWithPassword[categoryName].push(item.password_name)
    }
  }

  return categoryWithPassword;

}

//takes in category/pswd obj and append to the main layout
const renderCategories = (obj) => {
  $(".category-container").empty();
  const categoryWithPassword = combineCategWithPswd(obj)



  const categoryArr = Object.keys(categoryWithPassword);

  for (let category of categoryArr) {
    let categoryLayout = createCategoryLayout(category);
    $(".category-container").append(categoryLayout);

    let pswdArr = categoryWithPassword[category]

    for (let pswd of pswdArr) {


      let pswdLayout = createPswdLayout(pswd);
      $(`#${category}-pswd`).append(pswdLayout);
    }
  }

  reloadEventListeners();
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

const createPswdLayout = (passwordName) => {
  const passwordLayout = `
  <div class="is-flex flex-direction-row">
    <a href="" class="mx-2">
      <i class="fa-solid fa-key password-icon "></i> ${passwordName}
    </a>
    <a href=" " class="mx-2">
      <i class="fa-solid fa-copy"></i>
    </a>
    <div class="field is-grouped is-grouped-right mx-2">
      <p class="control">
        <a class="js-modal-trigger mx-2" data-target="edit-password-modal">
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



$(() => {
  // render category and corresponding pswd which are already in db
  createNewItemOnSubmit();
  generatePassOnEvents();
  loadCategories();
  
});
