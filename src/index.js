import './pages/index.css'; 
import {initialCards} from "./components/cards.js";
import {getCardElem, deleteCard, likeCard} from "./components/card.js";
import {openModal, closeModal, closeModalByOverlay} from "./components/modal.js";

// DOM узлы
const placesList = document.querySelector(".places__list");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profilePopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImg = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Формы
const profilePopupForm = profilePopup.querySelector(".popup__form");
const newCardPopupForm = newCardPopup.querySelector(".popup__form");

// Кнопки
const popupCloseButtonList = document.querySelectorAll(".popup__close");

// Объекты
const cardListenersFunctions = {
  deleteCardFunction: deleteCard,
  likeCardFunction: likeCard,
  openImageFunction: openCardImage
};

// Вывод карточек на страницу
initialCards.forEach((cardObj) => {
  const currentCard = getCardElem(cardObj, cardListenersFunctions);
  if (currentCard) {
    placesList.append(currentCard);
  }
});

// Рeдактирование профиля
document.querySelector(".profile__edit-button").addEventListener("click", (evt) => {
  profilePopupForm.elements.name.value = profileTitle.textContent;
  profilePopupForm.elements.description.value = profileDescription.textContent;
  openModal(profilePopup);
});

// Создание новой карточки
document.querySelector(".profile__add-button").addEventListener("click", (evt) => {
  openModal(newCardPopup);
});

// Открытие изображения 
function openCardImage(cardObj) {
  imagePopupImg.setAttribute("src", cardObj.link);
  imagePopupImg.setAttribute("alt", cardObj.name);
  imagePopupCaption.textContent = cardObj.name;
  openModal(imagePopup);
}

popupCloseButtonList.forEach((btn) => {
  const popup = btn.closest(".popup");
  // Очистка форм
  if (popup === profilePopup) {
    profilePopupForm.reset();
  } else if (popup === newCardPopup) {
    newCardPopupForm.reset();
  }
  // Закрытие модального окна по клику на крестик
  btn.addEventListener("click", () => closeModal(popup));
  // Закрытие модального окна по клику на оверлей 
  popup.addEventListener("mousedown", closeModalByOverlay);
});

// Сохранение изменнённых данных профиля
profilePopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileTitle.textContent = evt.target.elements.name.value;
  profileDescription.textContent = evt.target.elements.description.value;
  profilePopupForm.reset();
  closeModal(profilePopup);
});

// Добавление новой карточки в начало
newCardPopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCardObj = {
    name: evt.target.elements["place-name"].value,
    link: evt.target.elements.link.value
  };
  const currentCard = getCardElem(newCardObj, cardListenersFunctions);
  if (currentCard) {
    placesList.prepend(currentCard);
  }
  newCardPopupForm.reset();
  closeModal(newCardPopup);
});