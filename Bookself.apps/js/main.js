const books = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKS-APPS";
function generateId() {
  return +new Date();
}
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("not-read");
  uncompletedBOOKList.innerHTML = "";
  const completedBOOKList = document.getElementById("finish-read");
  completedBOOKList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted == false) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (listBook of data) {
      books.push(listBook);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function generateObject(id, title, author, year, isCompleted) {
  return {
    id, //number
    title, // string
    author, // string
    year, // number
    isCompleted, // boolean
  };
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("penulis").value;
  const year = document.getElementById("number").value;

  const generatedID = generateId();
  const addObject = generateObject(generatedID, title, author, year, false);
  books.push(addObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  // books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const numYear = document.createElement("p");
  numYear.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, numYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo");
    undoButton.innerText = "Baca Ulang";
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove");
    removeButton.innerText = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(undoButton, removeButton);
  } else {
    const clearButton = document.createElement("button");
    clearButton.classList.add("clear");
    clearButton.innerText = "Selesai";
    clearButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove");
    removeButton.innerText = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(clearButton);
    container.append(removeButton);
  }

  return container;
}
