// Client facing scripts here
$(() => {
  $.get("/api/categories")
  .then((data) => {
    const categories = $("#categories");

    for (let category of data.categories) {
      const li = `<li>${category.name}</li>`
      categories.append(li);
    }

  })
});
