// Client facing scripts here

const loadCategories = () => {

  // fetch obj with db data from server
  $.get("/api/categories")
  .then((data) => {
    renderCategories(data);
  })
};

// Le Minh
const createNewItemOnSubmit = function (str) {
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
      $("#new-item-modal").removeClass('is-active');

      // Inject new credential code goes here

      loadCategories();
    })
  });
};

// helper to prevent Cross Site Scripting
const escapeScript = function (str) {
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
}

const createCategoryLayout = (category) => {
  const categoryLayout = `

  <summary class="message-header has-background-primary">
          <p class="title is-size-4">
            <i class="fa-solid fa-vault mx-2"></i> ${category}
            <i class="fa-solid fa-pen-to-square mx-2"></i>
            <i class="fa-solid fa-rectangle-xmark mx-2"></i>
          </p>
  </summary>

  <div class="message-body has-background-primary-light">
      <div class="message-body-content">
        <div id="${category}-pswd" class="is-flex is-flex-direction-column">
        </div>
      </div>
    </div>
  `
  return categoryLayout;
}

const createPswdLayout = (passwordName) => {
  const passwordLayout = `

        <p class="title is-size-6 has-text-grey-darker">
                <a href="">
                  <i class="fa-solid fa-key password-icon "></i> ${passwordName}
                </a>
                <a href="">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a>
                <a href="">
                  <i class="fa-solid fa-rectangle-xmark"></i>
                </a>
        </p>

  `
  return passwordLayout;
}



$(() => {


  // render category and corresponding pswd which are already in db
  createNewItemOnSubmit();
  loadCategories();
});


