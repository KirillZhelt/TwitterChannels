import { createListItem, createSpan, createImage } from "./utils.js";

let addedCategories = [];

setupBar();
loadAddedCategories();

function setupBar() {
    const input = document.querySelector('.search-bar__input');

    const addCategoryButton = document.querySelector('.search-bar__button_add-category');
    addCategoryButton.addEventListener('click', e => {
        if (input.value.length > 0) {
            addCategory(input.value);
        }
    });
}

function addCategory(categoryName) {
    const categoriesList = document.querySelector('.categories-list');

    categoriesList.append(createCategoryItem(categoryName));

    addedCategories.push(categoryName);
    localStorage.setItem('addedCategories', JSON.stringify(addedCategories));
}

function createCategoryItem(categoryName) {
    const categoryItem = createListItem('categories-list__category');
    categoryItem.append(createSpan('categories-list__category-name', categoryName));
    categoryItem.append(createImage('delete-icon categories-list__category-delete', 'media/recycle-bin.png'));
    
    setupCategoryItem(categoryItem);

    return categoryItem;
}

function setupCategoryItem(categoryItem) {
    const categoryDeleteButton = categoryItem.querySelector('.categories-list__category-delete');
    categoryDeleteButton.addEventListener('click', e => {
        categoryItem.remove();

        const categoryName = categoryItem.querySelector('.categories-list__category-name').textContent;
        addedCategories.splice(addedCategories.indexOf(categoryName), 1);
        localStorage.setItem('addedCategories', JSON.stringify(addedCategories));
    });
}

function loadAddedCategories() {
    addedCategories = JSON.parse(localStorage.getItem('addedCategories'));
    if (addedCategories === null) {
        addedCategories = [];
    }

    const categoriesList = document.querySelector('.categories-list');
    for (const category of addedCategories) {
        categoriesList.append(createCategoryItem(category));
    }
}