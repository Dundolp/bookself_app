document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-book");

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});
