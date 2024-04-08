let currentCard;
let cardElem;
let cardImage;

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template");

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function getCardElem(cardObj, deleteFunction) {
  if ("name" in cardObj && "link" in cardObj) {
    cardElem = cardTemplate.content.cloneNode(true);
    cardImage = cardElem.querySelector(".card__image");
    cardImage.setAttribute("src", cardObj.link);
    cardImage.setAttribute("alt", cardObj.name);
    cardElem.querySelector(".card__title").textContent = cardObj.name; 
    cardElem.querySelector(".card__delete-button").addEventListener('click', deleteFunction);
  } else {
    cardElem = undefined;
  }
  return cardElem;
}

// @todo: Функция удаления карточки
function deleteCard() {
  event.target.parentNode.remove();  
}

// @todo: Вывести карточки на страницу
initialCards.forEach((cardObj) => {
  currentCard = getCardElem(cardObj, deleteCard);
  if (currentCard) {
    placesList.append(cardElem);
  }
});