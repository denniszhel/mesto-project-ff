import './pages/index.css'; 
import {initialCards} from "./components/cards.js";
import {getCardElem, deleteCard, likeCard} from "./components/card.js";
import {openModal, closeModal, closeModalByButton, closeModalByOverlay, closeModalByEscape} from "./components/modal.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// @todo: Вывести карточки на страницу
initialCards.forEach((cardObj) => {
  const currentCard = getCardElem(cardObj, deleteCard, likeCard, openCardImage);
  if (currentCard) {
    placesList.append(currentCard);
  }
});

// Рeдактирование профиля
document.querySelector(".profile__edit-button").addEventListener("click", (evt) => {
  evt.stopPropagation();
  openModal(document.querySelector(".popup_type_edit"), {
    profileTitle: profileTitle.textContent,
    profileDescription: profileDescription.textContent
  });
});

// Создание новой карточки
document.querySelector(".profile__add-button").addEventListener("click", (evt) => {
  evt.stopPropagation();
  openModal(document.querySelector(".popup_type_new-card"));
});

// Открытие изображения 
function openCardImage(evt) {
  evt.stopPropagation();
  openModal(document.querySelector(".popup_type_image"), {
    imageName: evt.target.getAttribute("alt"),
    imageLink: evt.target.getAttribute("src")
  });
}

// Закрытие модального окна по клику на крестик
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", closeModalByButton);
});

// Закрытие модального окна по клику на оверлей 
document.addEventListener("click", closeModalByOverlay);

// Закрытие модального окна при нажатии клавиши Escape
document.addEventListener("keyup", closeModalByEscape);

// Сохранение изменнённых данных профиля
document.forms["edit-profile"].addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileTitle.textContent = evt.target.elements.name.value;
  profileDescription.textContent = evt.target.elements.description.value;
  closeModal(evt.target.closest(".popup_is-opened"));
});

// Добавление новой карточки в начало
document.forms["new-place"].addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardObj = {
    name: evt.target.elements["place-name"].value,
    link: evt.target.elements.link.value
  };
  const currentCard = getCardElem(newCardObj, deleteCard, likeCard, openCardImage);
  if (currentCard) {
    placesList.prepend(currentCard);
  }
  closeModal(evt.target.closest(".popup_is-opened"));
});