// Client facing scripts here

// creates an obj with unique category having an arr of pswds
//
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
      $("#new-item-modal").removeClass('is-active');

      // Inject new credential code goes here
    });
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

  const categoryWithPassword = combineCategWithPswd(obj)


  // $(".category-container").clear();
  const categoryArr = Object.keys(categoryWithPassword);

    for (let category of categoryArr) {
      let categoryLayout = createCategoryLayout(category);
      $(".category-container").append(categoryLayout);
      console.log(category)
      let pswdArr = categoryWithPassword[category]

      for (let pswd of pswdArr) {
        console.log(pswd)

        let pswdLayout = createPswdLayout(pswd);
        $(`#${category}-pswd`).append(pswdLayout);
      }
    }

}

const createCategoryLayout = (category) => {
  const categoryLayout = `
  <section class="category-list">
      <a class="category-header" href="">
        <div class="category-icon"><i class="fa-solid fa-vault"></i></div>
        <div class="category-label text-default-dark">${category}</div>
        <i class="fa-solid fa-pen-to-square category-icon"></i>
        <i class="fa-solid fa-rectangle-xmark category-icon"></i>
      </a>
      <article id="${category}-pswd"></article>
  </section>
  `
  return categoryLayout;
}

const createPswdLayout = (passwordName) => {
  const passwordLayout = `

        <div class="password-box-display">
          <a class="password-box" href="">
            <i class="fa-solid fa-key password-icon"></i>
            <div class="password-label text-default-dark">${passwordName}</div>
            <i class="fa-solid fa-pen-to-square category-icon"></i>
            <i class="fa-solid fa-rectangle-xmark category-icon"></i>
          </a>
        </div>

  `
  return passwordLayout;
}

$(() => {

  const loadCategories = () => {

    // fetch obj with db data from server
    $.get("/api/categories")
    .then((data) => {
      renderCategories(data);
    })
  };

  // render category and corresponding pswd which are already in db
  loadCategories();
  createNewItemOnSubmit();
});


