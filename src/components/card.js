// Темплейт карточки
const cardTemplate = document.querySelector("#card-template");

// Функция создания карточки
export function getCardElem(cardObj, deleteFunction, likeFunction, openImageFunction) {
  let cardElem;
  if ("name" in cardObj && "link" in cardObj) {
    cardElem = cardTemplate.content.cloneNode(true);
    const cardImage = cardElem.querySelector(".card__image");
    cardImage.setAttribute("src", cardObj.link);
    cardImage.setAttribute("alt", cardObj.name);
    cardImage.addEventListener("click", openImageFunction);
    cardElem.querySelector(".card__title").textContent = cardObj.name; 
    cardElem.querySelector(".card__delete-button").addEventListener("click", deleteFunction);
    cardElem.querySelector(".card__like-button").addEventListener("click", likeFunction);
  }
  return cardElem;
}

// Функция удаления карточки
export function deleteCard(evt) {
  evt.target.closest(".places__item").remove();  
}

// Функция проставления лайка
export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

