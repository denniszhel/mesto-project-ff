// Темплейт карточки
const cardTemplate = document.querySelector("#card-template");

/**
 * Функция создания карточки
 * @param {{name:string, link:string}} cardObj 
 * @param {{deleteCardFunction:Function, likeCardFunction:Function, openImageFunction:Function}} funcObj 
 * @returns 
 */
export function getCardElem(cardObj, funcObj, currentUserId = undefined) {
  let cardElem;
  if ("name" in cardObj && "link" in cardObj) {
    cardElem = cardTemplate.content.cloneNode(true);
    const cardImage = cardElem.querySelector(".card__image");
    cardImage.setAttribute("src", cardObj.link);
    cardImage.setAttribute("alt", cardObj.name);
    cardImage.addEventListener('click', () => funcObj.openImageFunction(cardObj));
    cardElem.querySelector(".card__title").textContent = cardObj.name; 
    if (!currentUserId || cardObj.owner._id === currentUserId) {
      cardElem.querySelector(".card__delete-button").addEventListener("click", funcObj.deleteCardFunction);
    } else {
      cardElem.querySelector(".card__delete-button").classList.add("card__delete-button_no-display");
    }
    cardElem.querySelector(".card__like-button").addEventListener("click", funcObj.likeCardFunction);
    if ("likes" in cardObj) {
      const likeElem = cardElem.querySelector(".card__like-button");
      const likeCount = cardObj.likes.length;
      const likeCountElem = cardElem.querySelector(".card__like-count");
      likeCountElem.textContent = likeCount;
      if (likeCount) {
        likeCountElem.classList.remove("card__like-count_zero");
        if (cardObj.likes.find(likeUser => likeUser._id === currentUserId)) {
          likeElem.classList.add("card__like-button_is-active");
        }
      }
    }
  }
  return cardElem;
}
