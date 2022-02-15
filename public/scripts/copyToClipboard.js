// const copyToClipboard = () => {

//   const copyButton = document.getElementsByClassName("fa-copy");

//   copyButton.addEventListener('click', (event) => {
//     event.preventDefault()
//   alert('clicked');
// })
// }

const copyToClipboard = (target) => {

}


const loadEventListenerCopyBtn = () => {
  $(".copy").on('click', (evt) => {
    evt.preventDefault()

    let password = $(evt.target).attr("password")
    let $tempEl = $("<input>");
    $tempEl.style.display = "none"
    $(".copy").append($tempEl);

    $tempEl.val($(password).text()).select();
    document.execCommand("copy");
    $tempEl.remove();

    // let textarea = document.createElement("textarea");
    // textarea.textContent = password;
    // textarea.style.display = "none";
    // document.body.appendChild(textarea);
    // textarea.select();
    // document.execCommand("copy");

    // document.body.removeChild(textarea);

  })
}



