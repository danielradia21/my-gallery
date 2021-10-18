'use strict';
var STAR = '&#x2605';
renderBooks();

function renderBooks() {
    var books = getBooksForDisplay();
    var strHTMLs = books.map(function (book) {
        return `<tr>
            <td class="book-id">${book.id}</td>
            <td class="book-name">${book.bookName}</td>
            <td class="book-price">$${book.price}</td>
            <td class="book-action">
                <button onclick="onRead('${book.id}')">Read</button>
                <button onclick="onUpdate('${book.id}')">Update</button>
                <button onclick="onRemove('${book.id}', event)">Delete</button>
                <div class="stars">
                <button onclick="onUpdateRating('${book.id}')">Rate</button>
                <span class="star">${STAR.repeat(book.rate)}</span>
                </div>
            </td>
        </tr>`;
    });
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHTMLs.join('');
}

function onNextPage() {
    nextPage();
    renderBooks();
}

function onAddBookModal() {
    var elModal = document.querySelector('.modal');
    var elModalDes = document.querySelector('h5');
    var elModalImg = document.querySelector('.modal-book-picture');
    var elModalTitle = document.querySelector('h6');
    if (elModal.style.opacity === '1') {
        closeModal();
    } else {
        //think about hardcoded this part to modal
        elModalImg.hidden = true;
        elModalTitle.innerText = 'Add A New Book';
        elModalDes.innerHTML = `<form onsubmit="onAddBook(event)" action="">
        <label for="name"></label>  Book Name :
        <input required maxlength="50" autocomplete="off" placeholder="Full Book Name:" id="name" type="text" />
        <label for="price"></label> Price :
        <input required step="0.01" min="0.99" max="99.99" placeholder="$0.99 - $99.99" id="price" type="number" />
        <label for="url"></label> Url :
        <input autocomplete="off" placeholder="Image Source:" required id="url" type="url" />
        <div class="form-btns">
        <button>Add</button>
        <button type="button" onclick="closeModal()">Cancel</button>
        </div>
    </form>`;
        elModal.style.opacity = '1';
        elModal.style.pointerEvents = 'all';
    }
    renderBooks();
}

function onAddBook(ev) {
    ev.preventDefault(); //onsubmit will refresh the page without this function
    var bookName = document.querySelector('[id="name"]').value;
    var price = document.querySelector('[id="price"]').value;
    price = (Math.round(price * 100) / 100).toFixed(2);
    var imgUrl = document.querySelector('[id="url"]').value;
    if (!bookName || !price || !imgUrl) return;
    addBook(bookName, price, imgUrl);
    renderBooks();
    closeModal();
}

function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.opacity = '0';
    elModal.style.pointerEvents = 'none'; //let you click under the modal content
}

function onRead(bookId) {
    var book = getBookById(bookId);
    var elModal = document.querySelector('.modal');
    var elModalTitle = document.querySelector('h6');
    var elModalDes = document.querySelector('h5');
    var elModalImg = document.querySelector('.modal-book-picture');
    if (elModal.style.opacity === '1') {
        closeModal();
    } else {
        elModalImg.hidden = false;
        elModal.style.opacity = '1';
        elModal.style.pointerEvents = 'all';
        elModalImg.src = book.imgUrl;
        elModalTitle.innerText = book.bookName;
        elModalDes.innerText = makeLorem(26);
        console.log(elModalDes.innerText.length);
    }
}

function onUpdate(bookId) {
    //todo modal
    var price = +prompt('new price?');
    price = (Math.round(price * 100) / 100).toFixed(2);
    if (!price || isNaN(price) || price > 99.99 || price < 0.99) return;
    updateBook(bookId, price);
    renderBooks();
}

function onUpdateRating(bookId) {
    //todo modal
    var currRate = +prompt('rate me');
    if (currRate === 0 || currRate > 5) {
        console.log('choose between 1 - 5');
        return;
    }
    updateRating(bookId, currRate);
    renderBooks();
}

function onRemove(bookId, ev) {
    //todo confirm modal
    ev.stopPropagation();
    if (confirm('Are You Sure You Want To Remove This Book?')) {
        removeBook(bookId);
    }
    renderBooks();
}

function onSort(sortBy) {
    setSortBy(sortBy);
    renderBooks();
}
