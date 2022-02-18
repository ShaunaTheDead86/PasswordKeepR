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
          reloadListeners();
        });
    });
}

const renderQuerySiteLayout = (dataset) => {
  $(".category-container").empty();
  //hide new category that hardcoded in main layout, make sure to return back visibility when input field is clear
  $(".new-category").removeClass("is-flex");
  $(".new-category").css("display", "none");

  for (let data of dataset) {
    const querySiteLayout = categoryPasswordLayout(data);
    $(".category-container").append(querySiteLayout);
    app.reloadPage();
  }
}
