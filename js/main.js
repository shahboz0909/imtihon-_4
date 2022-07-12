"use strict";

let elResultList = document.querySelector(".books-list")
let elBtnLogout = document.querySelector(".login-section__btn");
let elForm = document.querySelector(".header__form")
let elInput = document.querySelector(".header__input");
let elTemplate = document.querySelector("#template").content;
let sortingBtn = document.querySelector(".showing__btn");
let elResultNumber = document.querySelector(".showing__span");
let bookmarksResultList = document.querySelector(".result-bookmark");
let apple = document.querySelector(".modal-wrapper");
let elCloseModal = document.querySelector(".modal__close-btn");

let fullArr=[];


// pageNation
let elPrevBtn = document.querySelector(".prev-button");
let elNextBtn = document.querySelector(".next-button");



// localStorage
let localStorageBookmark = JSON.parse(window.localStorage.getItem("bokmarkLocal"));


let valueSearch = "search+terms"
let page = 1;
let unpersent = "&";
let newSort =  (page - 1) * 15 + 1;
let books
let bookmarks = localStorageBookmark || [];


let libraryRender = function(library, htmlElement) {
    elResultList.innerHTML = null
    let libraryFragment =document.createDocumentFragment();
    library.forEach((book) => {
        let libraryCopy = elTemplate.cloneNode(true);
        libraryCopy.querySelector(".books-img").src = book.volumeInfo.imageLinks?.thumbnail;
        libraryCopy.querySelector(".book-title").textContent = book.volumeInfo.title;
        libraryCopy.querySelector(".book-author").textContent = book.volumeInfo.authors; 
        libraryCopy.querySelector(".book-year").textContent = book.volumeInfo.publishedDate;
        libraryCopy.querySelector(".el-bookmark").dataset.bookmarkBtnId = book.id;
        libraryCopy.querySelector(".el-modal").dataset.modalBtnId = book.id;
        libraryCopy.querySelector(".el-read").href = book.volumeInfo.previewLink;
        libraryFragment.appendChild(libraryCopy);
        htmlElement.appendChild(libraryFragment);
    })
    
    
    // bookmarklarni render qilib UI chiqarish
    let renderBookmark = function(arr, htmlElement) {
        arr.forEach(bookmark => {
            
            // elementlar yaratish
            let newItem = document.createElement("li");
            let newDivWrapper = document.createElement("div");
            let newDivInnerLeft = document.createElement("div");
            let newDivInner = document.createElement("div");
            let newPi = document.createElement("p");
            let newPiAuthors = document.createElement("p");
            let newBtnDelete = document.createElement("button");
            let newBtnRead = document.createElement("button");
            let newImgRead = document.createElement("img");
            let newImgDelete = document.createElement("img");
            
            // elementlarga klass va stillar berish
            newDivWrapper.setAttribute("class", "d-flex  justify-content-between");
            newDivInner.setAttribute("class", "d-flex  justify-content-between");
            newItem.setAttribute("class", "bookmark-list__item");
            newBtnDelete.setAttribute("class", "delete-bookmark-btn border-0 bg-transparent");
            newBtnRead.setAttribute("class", "border-0 bg-transparent");
            newPi.setAttribute("class", "bookmark-text m-0 p-0");
            newImgRead.setAttribute("class", "bookmark-read-img");
            newImgDelete.setAttribute("class", "bookmark-delete-img");
            newPiAuthors.setAttribute("class", "bookmark-authors m-0 p-0")
            newImgRead.src = `./img/read-img.svg`;
            newImgDelete.src = `./img/delete-img.svg`;
            newPi.textContent = bookmark.volumeInfo.title;
            newPiAuthors.textContent = bookmark.volumeInfo.authors;
            newBtnDelete.dataset.deleteBookmarks = bookmark?.id; 
            newImgDelete.dataset.deleteBookmarks = bookmark?.id;
            
            
            newBtnRead.append(newImgRead);
            newDivInner.append(newBtnRead,newBtnDelete);
            newDivInnerLeft.append(newPi,newPiAuthors)
            newDivWrapper.append(newDivInnerLeft,newDivInner);
            newItem.append(newDivWrapper);
            newBtnDelete.append(newImgDelete)
            htmlElement.append(newItem);
            
        });
    }
    
    
    // bookmarkga data-set berish
    elResultList.addEventListener("click", function(evt){
        if(evt.target.matches(".el-bookmark")){
            let bookmarkBtnId = evt.target.dataset.bookmarkBtnId
            let foundBookmark = library.find(bok => bok.id === bookmarkBtnId)
            
            if(!bookmarks.includes(foundBookmark)){
                bookmarks.push(foundBookmark);
                window.localStorage.setItem("bokmarkLocal", JSON.stringify(bookmarks))
            };
            
            bookmarksResultList.innerHTML = null;
            renderBookmark(bookmarks, bookmarksResultList);
        };
    });
    
    // delette
    bookmarksResultList.addEventListener("click", function(evt) {
        const deleteBtn = evt.target.dataset.deleteBookmarks;
        const foundTodoIndex = bookmarks.findIndex((body) => body.id === deleteBtn)
        if(evt.target.matches(".bookmark-delete-img")) {
            bookmarks.splice(foundTodoIndex, 1)
            bookmarksResultList.innerHTML = "";
            window.localStorage.setItem("bokmarkLocal", JSON.stringify(bookmarks)) 
            if(bookmarks.length === 0) {
                window.localStorage.removeItem("bokmarkLocal")
            }
            renderBookmark(bookmarks, elBookmarkList)
        };
    })
    renderBookmark(bookmarks, elBookmarkList)
    
};



let functionBooks = async function() {
    newSort =  (page - 1) * 15 + 1;
    let request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${valueSearch}&maxResults=15&startIndex=${newSort}${unpersent}`);
    let books = await request.json();
    elResultNumber.textContent = books.totalItems
    arr(books.items)
    libraryRender(books.items, elResultList);
    
}
functionBooks()
elForm.addEventListener("submit", function(evt){
    evt.preventDefault()
    valueSearch = elInput.value
    functionBooks();
})

sortingBtn.addEventListener("click", function(){
    unpersent = "&";
    unpersent += "orderBy=newest"
    functionBooks()
})


let token = window.localStorage.getItem("token");

elBtnLogout.addEventListener("click", function(){
    window.localStorage.removeItem("token");
    window.location.replace("index.html")
})



elPrevBtn.addEventListener("click", function(){
    if(page > 1){
        page --
    }
    functionBooks()
})


elNextBtn.addEventListener("click", function(){
    page ++
    functionBooks()
})


let renderModal = function (arr, apple) {
    apple.innerHTML = null;
    
    let html = `
    <div class="modal__wrapper d-flex justify-content-between align-items-center">
    <h2 class="modal__book-title">${arr.volumeInfo.title}</h2>
    <button  class="modal__close-btn bg-transparent border-0 fs-2">X</button>
    </div>
    <div class="main-wrapper">
    <div class="modal__section-main">
    <img class="modal__img text-center d-block ms-auto mt-3 me-auto" src="${arr.volumeInfo.imageLinks.thumbnail}" width="140" heigth="auto" alt="modal-img">
    <p class="modal__text">${arr.volumeInfo.description}</p>
    </div>
    <div class="modal__footer">
    <ul class="modal__list list-unstyled">
    <li class="modal__item d-flex">
    Author: <p class="modal__author fw-bold  ms-3">${arr.volumeInfo.authors}</p>
    </li>
    <li class="modal__item d-flex ">
    Published: <p class="modal__year fw-bold  ms-3">${arr.volumeInfo.publishedDate}</p>
    </li>
    <li class="modal__item d-flex">
    Publishers: <p class="modal__publishers fw-bold  ms-3">${arr.volumeInfo.publisher}</p>
    </li>
    <li class="modal__item d-flex">
    Categories: <p class="modal__categories fw-bold  ms-3">${arr.volumeInfo.categories}</p>
    </li>
            <li class="modal__item d-flex">
            Page Count: <p class="modal__count fw-bold  ms-3">${arr.volumeInfo.pageCount}</p>
            </li>
            </ul>
            </div>
            </div>
            <div class="modal__btn">
            <a class="modal__link text-center ms-auto" href="${arr.volumeInfo.previewLink}">Read</a>
            </div>
            `;
            apple.insertAdjacentHTML("beforeend", html);
        };
        
        function arr(arr){
            elResultList.addEventListener('click',e=>{
                if(e.target.matches('.el-modal')){
                    let elModalId=e.target.dataset.modalBtnId;
                    let elModolItem=arr.find(item=>item.id===elModalId);
                    renderModal(elModolItem,apple);
                    apple.classList.remove("hidden")
                }

                
            });
        };
        
        
        apple.addEventListener("click", function(evt){
        if(evt.target.marches(".modal__close-btn")){
            apple.classList.add("modal")
        }
        })




        