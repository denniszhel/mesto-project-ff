// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template");

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function getCardElem(cardObj, deleteFunction) {
  let cardElem;
  if ("name" in cardObj && "link" in cardObj) {
    cardElem = cardTemplate.content.cloneNode(true);
    const cardImage = cardElem.querySelector(".card__image");
    cardImage.setAttribute("src", cardObj.link);
    cardImage.setAttribute("alt", cardObj.name);
    cardElem.querySelector(".card__title").textContent = cardObj.name; 
    cardElem.querySelector(".card__delete-button").addEventListener("click", deleteFunction);
  }
  return cardElem;
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
  evt.target.closest(".places__item").remove();  
}

// @todo: Вывести карточки на страницу
initialCards.forEach((cardObj) => {
  const currentCard = getCardElem(cardObj, deleteCard);
  if (currentCard) {
    placesList.append(currentCard);
  }
});