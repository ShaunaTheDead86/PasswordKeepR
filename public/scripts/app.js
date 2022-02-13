// Client facing scripts here

//takes in category obj and append to container
const renderCategories = (obj) => {
  const categories = $("#category-label");

    for (let category of obj.categories) {
      // const li = `<li>${category.name}</li>`
      // categories.text(category.name);
      console.log(category.name)
      let layout = createCategoryLayout(category.name)

      $(".category-container").append(layout)
    }

}

const createCategoryLayout = (category) => {
  const layout = `
  <section class="category-list">
      <a class="category-header" href="">
        <div class="category-icon"><i class="fa-solid fa-vault"></i></div>
        <div class="category-label text-default-dark">${category}</div>
        <i class="fa-solid fa-pen-to-square category-icon"></i>
        <i class="fa-solid fa-rectangle-xmark category-icon"></i>
      </a>
      <article id="category-passwords">
        <div class="password-box-display">
          <a class="password-box" href="">
            <i class="fa-solid fa-key password-icon"></i>
            <div class="password-label text-default-dark">Compass</div>
            <i class="fa-solid fa-pen-to-square category-icon"></i>
            <i class="fa-solid fa-rectangle-xmark category-icon"></i>
          </a>
        </div>
      </article>
      <article id="category-passwords">
        <div class="password-box-display">
          <a class="password-box" href="">
            <i class="fa-solid fa-key password-icon"></i>
            <div class="password-label text-default-dark">Lighthouse Labs</div>
            <i class="fa-solid fa-pen-to-square category-icon"></i>
            <i class="fa-solid fa-rectangle-xmark category-icon"></i>
          </a>
        </div>
      </article>
      <article id="category-passwords">
        <div class="password-box-display">
          <a class="password-box" href="">
            <i class="fa-solid fa-key password-icon"></i>
            <div class="password-label text-default-dark">Compass for Teachers</div>
            <i class="fa-solid fa-pen-to-square category-icon"></i>
            <i class="fa-solid fa-rectangle-xmark category-icon"></i>
          </a>
        </div>
      </article>
  `
  return layout;
}


$(() => {

  const loadCategories = () => {
    $.get("/api/categories")
    .then((data) => {

      renderCategories(data);


    })
  };


  // render categories which are already in db
  loadCategories()
});
