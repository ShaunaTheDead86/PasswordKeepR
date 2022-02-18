const listCreateNewLayout = function() {
  const layout = `
  <div class="is-flex is-flex-direction-row is-align-items-center is-size-6 p-1 div-password">
  <div class="is-link-primary js-modal-trigger-dynamic" data-target="new-password-modal">
  <i class="fa-solid fa-key mx-2 password-icon"></i>
  Create New Password
  <i class="fa-solid fa-plus mx-2"></i>
  </div>
  </div>
  `

  return layout;
}

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
  <div class="is-link-light is-size-5 category-name">
  <i class="fa-solid fa-vault mx-2"></i>${category.name}
  </div>
  <div class="is-link-light is-size-5">
  <i class="fa-solid fa-pen-to-square is-link-light mx-2 js-modal-trigger-dynamic" data-target="edit-category-modal">
  <input class="is-hidden category-id" value="${category.id}" />
  <input class="is-hidden category-name" value="${category.name}" /></i>
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
        <i class="fa-solid fa-pen-to-square is-link-primary js-modal-trigger-dynamic mx-2" data-target="edit-password-modal">
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
  <div class="is-link-primary js-modal-trigger-dynamic" data-target="new-password-modal">
  <i class="fa-solid fa-plus"></i>
  Create New</div>
  </div>
  `;

  return layout;
}

const boxCreateNewCategoryLayout = function() {
  const layout = `
  <div class="box is-flex is-flex-direction-row has-background-primary py-2 px-4 m-2">
  <div class="is-link-light is-size-5 js-modal-trigger-dynamic" data-target="new-category-modal">
  <i class="fa-solid fa-vault mx-2"></i>
  Create New Category
  <i class="fa-solid fa-plus"></i>
  </div>
  </div>
  `;

  return layout;
}

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
        <div class="is-link-light category-name">
          <i class="fa-solid fa-vault mx-2"></i>${category.name}
        </div>
        <i class="fa-solid fa-pen-to-square is-link-light mx-2 js-modal-trigger-dynamic" data-target="edit-category-modal">
        <input class="is-hidden category-id" value="${category.id}" />
        <input class="is-hidden category-name" value="${category.name}" /></i>
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
  <i class="fa-solid fa-pen-to-square is-link-primary js-modal-trigger-dynamic mx-2" data-target="edit-password-modal">
  <input class="is-hidden password-id" value="${data.id}" />
  </i>
  <i class="fa-solid fa-rectangle-xmark is-link-primary mx-2 delete-button"></i>
  </div>
  `
  return layout;
}

const categoryCreateNewLayout = function() {
  const layout = `<div class="new-category is-flex is-flex-direction-row is-align-items-center  is-size-5 has-background-primary p-1 js-modal-trigger-dynamic" data-target="new-category-modal">
  <div class="is-link-light">
  <i class=" fa-solid fa-vault mx-2"></i>Create New Category
  </div>
  </div>`;

  return layout;
}
