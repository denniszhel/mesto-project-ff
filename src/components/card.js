import { Promise } from "core-js";
import { deleteCreatedCard, putLike, deleteLike } from "./api.js";
import { openModal } from "./modal.js";

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
      const likeCount = cardObj.likes.length;
      const likeCountElem = cardElem.querySelector(".card__like-count");
      if (likeCount) {
        likeCountElem.classList.remove("card__like-count_zero");
      }
      likeCountElem.textContent = likeCount;
    }
  }
  return cardElem;
}

// Функция удаления карточки
export function deleteCardConfirm(evt) {
  const cardElem = evt.target.closest(".places__item");
  const popup = document.querySelector(".popup_type_delete-confirm");
  popup.setAttribute("data-card-id", cardElem.getAttribute("data-card-id"));
  openModal(popup);
}

// Функция проставления лайка
export function likeCard(evt) {
  const likeElem = evt.target;
  const likeIsActiveClass = "card__like-button_is-active";
  const likeCountZeroClass = "card__like-count_zero";
  const cardId = likeElem.closest(".places__item").getAttribute("data-card-id");
  const likeCountElem = likeElem.closest(".card__like-group").querySelector(".card__like-count");

  const likeFunction = likeElem.classList.contains(likeIsActiveClass) ? deleteLike : putLike;

  likeFunction(cardId).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res.status);
    }
  }).then(data => {
    likeCountElem.textContent = data.likes.length;
    if (data.likes.length) {
      if (likeCountElem.classList.contains(likeCountZeroClass)) {
        likeCountElem.classList.remove(likeCountZeroClass);
      }
    } else {
      if (!likeCountElem.classList.contains(likeCountZeroClass)) {
        likeCountElem.classList.add(likeCountZeroClass);
      }
    }
    likeElem.classList.toggle(likeIsActiveClass);
  }).catch(err => {
    alert(`Ошибка: ${err}`);
  });
}

