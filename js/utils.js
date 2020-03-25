
function createElement(htmlTag, className) {
    const element = document.createElement(htmlTag);
    element.className = className;
    return element;
}

export function createImage(className, imgSrc) {
    const image = createElement('img', className);
    image.src = imgSrc;
    return image;
}

export function createParagraph(className, text) {
    const paragraph = createElement('p', className);
    paragraph.textContent = text;
    return paragraph;
}

export function createLine(className) {
    return createElement('hr', className);
}

export function createSpan(className, text) {
    const span = createElement('span', className);
    span.textContent = text;
    return span;
}

export function createHeader5(className, text) {
    const header = createElement('h5', className);
    header.textContent = text;
    return header;
}

export function createDiv(className) {
    return createElement('div', className);
}

export function createListItem(className) {
    return createElement('li', className);
}