const loadDynamicListeners = function() {
  (document.querySelectorAll('.js-modal-trigger-dynamic') || []).forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', function() {
      if (modal === "edit-password-modal") {
        const passwordID = $(trigger).find(".password-id").val();
        $.ajax({
          url: "/api/credentials/id",
          data: { passwordID: passwordID },
          type: "GET",
          success: function(res) {
            $(".edit-password-id").attr("value", `${passwordID}`);
            $(".edit-form-name").val(res[0].name);
            $(".edit-form-url").val(res[0].url);
            $(".edit-form-username").val(res[0].username);
            $(".edit-form-password").val(res[0].password);
            populateCategoryDropdown(".edit-form-category", res[0].category_id);
          },
          error: function(err) {
            console.log(err);
          }
        });
      }

      if (modal === "edit-category-modal") {
        const categoryID = $(trigger).find(".category-id").val();
        const categoryName = $(trigger).find(".category-name").val();

        const form = $("#edit-category-form");
        const name = form.find(".edit-category-name");
        const id = form.find(".edit-category-id");

        name.val(categoryName);
        id.val(categoryID);
      }

      openModal(target);
    });
  });

  (document.querySelectorAll(".category-delete-button") || []).forEach((trigger) => {
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      const deleteTarget = $(this).closest(".category-outer");
      const targetCategoryID = deleteTarget.attr("value");

      // get the details of the uncategorized category to use later
      $.ajax({
        url: "/api/categories/uncategorized",
        type: "GET",
        success: function(res) {
          const uncategorizedID = res[0].id;
          $.ajax({
            url: "/api/credentials/move",
            data: { target: targetCategoryID, newCategory: uncategorizedID },
            type: "POST",
            success: function(res) {
              $.ajax({
                url: "/api/categories/delete",
                data: { target: targetCategoryID },
                type: "POST",
                success: function(res) {
                  // on success reload the categories display
                  renderDisplay();
                },
                error: function(err) {
                  console.log(err);
                }
              });
            },
            error: function(err) {
              console.log(err);
            }
          });
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  });

  // Add a click event on buttons
  (document.querySelectorAll(".delete-button") || []).forEach((trigger) => {
    trigger.addEventListener('click', function(event) {
      const deleteTarget = $(this).closest(".div-password");
      const passwordID = deleteTarget.find(".password-id").val();

      $.ajax({
        url: "/api/credentials/delete",
        data: { passwordID: passwordID },
        type: "GET",
        success: function(res) {
          console.log(res)
          renderDisplay();
        },
        error: function(err) {
          console.log(err);
        }
      });
    });
  });

  // copying password to clipboard on click
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
    })
  });
}
