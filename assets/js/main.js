const books = [];
const searchBook = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_APPS";

const search = document.getElementById("searchSubmit");

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBooks(id) {
  for (const BooksItem of books) {
    if (BooksItem.id === id) {
      return BooksItem;
    }
  }
  return null;
}

function searchBooksByTitle(title) {
  searchBook.length = 0;
  for (const BooksItem of books) {
    if (BooksItem.title === title) {
      searchBook.push(BooksItem);
    }
  }
}

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
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
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function showData(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  //   let innerHTML;
  const article = document.createElement("article");
  article.classList.add("book_item");

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;
  const textYear = document.createElement("p");
  textYear.innerText = year;

  const btnGreen = document.createElement("button");
  btnGreen.classList.add("green");
  const btnRed = document.createElement("button");
  btnRed.classList.add("red");
  btnRed.innerText = "Hapus buku";

  const containerAction = document.createElement("div");
  containerAction.classList.add("action");

  console.log(isCompleted);
  if (isCompleted) {
    btnGreen.addEventListener("click", function () {
      changeBookUnCompleted(id);
    });
    btnGreen.innerText = "Belum Selesai dibaca";

    btnRed.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });

    containerAction.append(btnGreen, btnRed);

    article.append(textTitle, textAuthor, textYear, containerAction);
    article.setAttribute("id", `book-${id}`);
  } else {
    btnGreen.addEventListener("click", function () {
      changeBookCompleted(id);
    });
    btnGreen.innerText = "Belum Selesai dibaca";

    btnRed.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });

    containerAction.append(btnGreen, btnRed);

    article.append(textTitle, textAuthor, textYear, containerAction);
    article.setAttribute("id", `book-${id}`);
  }

  return article;
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isRead = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isRead
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBooks(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  let confirmation = confirm("Anda yakin akan menghapus data buku ini ?");
  if (confirmation == true) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function changeBookUnCompleted(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function changeBookCompleted(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBooks() {
  const searchTitle = document.getElementById("searchBookTitle").value;
  const searchResult = document.getElementById("searchResult");
  searchBooksByTitle(searchTitle);
  searchResult.innerHTML = "";
  for (const bookItem of searchBook) {
    const bookElement = showDataSearch(bookItem);
    searchResult.innerHTML += bookElement;
  }
}

function showDataSearch(bookObject) {
  const { title, author, year, isCompleted } = bookObject;

  let innerHTML = `
             <article class="book_item">
                <h3>${title}</h3>
                <p>Penulis: ${author}</p>
                <p>Tahun: ${year}</p>
                <p> Keterangan : ${
                  isCompleted ? "Sudah dibaca" : "Belum selesai dibaca"
                }</p>
            </article>
        `;

  return innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("inputBook");

  submit.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("tesst saha");
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

search.addEventListener("click", function (event) {
  event.preventDefault();
  searchBooks();
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = showData(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
