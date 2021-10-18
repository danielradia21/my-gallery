'use strict';
var gBooks = [];
const PAGE_SIZE = 5;
var gPageIdx = 0;
var gSortBy = 'text';

_createBooks();

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0;
    }
}

function getPageSize() {
    return PAGE_SIZE;
}

function getBooksForDisplay() {
    sortBy();
    var startIdx = gPageIdx * PAGE_SIZE;
    return gBooks.slice(startIdx, startIdx + PAGE_SIZE);
}

function getBookById(bookId) {
    return gBooks.find((book) => {
        return book.id === bookId;
    });
}

function removeBook(id) {
    var idx = gBooks.findIndex((book) => {
        return book.id === id;
    });
    gBooks.splice(idx, 1);
    _saveBooksToStorage();
}

function updateBook(id, price) {
    var idx = gBooks.findIndex((book) => {
        return book.id === id;
    });
    gBooks[idx].price = price;
    _saveBooksToStorage();
}

function updateRating(id, rate) {
    var idx = gBooks.findIndex((book) => {
        return book.id === id;
    });
    gBooks[idx].rate = rate;
    _saveBooksToStorage();
}

function addBook(bookName, price, imgUrl, rate = 1) {
    var book = {
        id: _makeId(),
        bookName,
        price,
        imgUrl,
        rate,
    };
    gBooks.unshift(book);
    _saveBooksToStorage();
}

function _createBooks() {
    var books = loadFromStorage('BooksDB');
    if (books && books.length) {
        gBooks = books;
    } else {
        addBook(
            `Harry Potter and the Deathly Hallows`,
            49.99,
            './imgs/1.jpg',
            4
        );
        addBook(
            `Harry Potter and the Half-Blood Prince`,
            39.99,
            './imgs/2.jpg',
            4
        );
        addBook(
            `Harry Potter and the Order of the Phoenix`,
            39.99,
            './imgs/3.jpg',
            5
        );
        addBook(
            `Harry Potter and the Goblet of Fire`,
            39.99,
            './imgs/4.jpg',
            5
        );
        addBook(
            `Harry Potter and the Prisoner of Azkaban`,
            29.99,
            './imgs/5.jpg',
            5
        );
        addBook(
            `Harry Potter and the Chamber of Secrets`,
            29.99,
            './imgs/6.jpg',
            4
        );
        addBook(
            `Harry Potter and the Philosopher's Stone`,
            29.99,
            './imgs/7.jpg',
            3
        );
        addBook(
            'The Lord of the Rings: The Return of The King',
            35.99,
            './imgs/8.jpg',
            4
        );
        addBook(
            'The Lord of the Rings: The Two Towers',
            32.99,
            './imgs/9.jpg',
            3
        );
        addBook(
            'The Lord of the Rings: The Fellowship of the Ring',
            29.99,
            './imgs/10.jpg',
            5
        );
    }
}

function makeLorem(size = 50) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        'created',
        'All',
        'this happened',
        'more or less',
        'by',
        'Daniel',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'radia',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ];
    var txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt;
}

function _saveBooksToStorage() {
    saveToStorage('BooksDB', gBooks);
}

function _makeId(length = 5) {
    var txt = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function setSortBy(value) {
    gSortBy = value;
}

function sortBy() {
    //todo sort to 2 directions (a-z <-> z-a)
    if (gSortBy === 'text') {
        gBooks.sort(function (a, b) {
            var titleA = a.bookName.toLowerCase(),
                titleB = b.bookName.toLowerCase();
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
        });
    }
    if (gSortBy === 'price') {
        gBooks.sort((a, b) => a.price - b.price);
    }
    if (gSortBy === 'rating') {
        gBooks.sort((a, b) => b.rate - a.rate);
    }
    _saveBooksToStorage();
}
