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

// helper to prevent Cross Site Scripting
const escapeScript = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const showErrorMessage = function(errorMessage) {
  $(".error-message").html(errorMessage);
  $(".error-message").slideDown("slow");
}

// helper to clear the error message
const muteErrorMessage = function() {
  $(".error-message").slideUp()
  $(".error-message").html("");
}

const populateCategoryDropdown = function(dropDownTarget, defaultCategory) {
  $.get('/categories').then((categories) => {
    let $dropdown = $(dropDownTarget);
    $dropdown.empty();
    // currently filter out "Uncategorized" from DB, but should be refactored to have additional boolean column.
    const UNCATEGORIZED = "Uncategorized";
    for (const item of categories) {
      if (item.name === UNCATEGORIZED) {
        continue;
      }
      if (item.id === defaultCategory) {
        $dropdown.append(`<option value="${item.id}" selected="selected">${item.name}</option>`);
      } else {
        $dropdown.append(`<option value="${item.id}">${item.name}</option>`);
      }
    }
  });
}
