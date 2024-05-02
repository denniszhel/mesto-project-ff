import "./pages/index.css"; 
import {getUserData, getCardList, setUserData, addNewCard, deleteCreatedCard, editAvatar} from "./components/api.js";
import {getCardElem, deleteCardConfirm, likeCard} from "./components/card.js";
import {openModal, closeModal} from "./components/modal.js";
import {enableValidation, clearValidation} from "./components/validation.js"
import { Promise } from "core-js";

// DOM узлы
const placesList = document.querySelector(".places__list");
const profileAvatar = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profilePopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const deleteConfirmPopup = document.querySelector(".popup_type_delete-confirm");
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupImg = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const editAvatarPopup = document.querySelector(".popup_type_edit-avatar");

// Формы
const profilePopupForm = profilePopup.querySelector(".popup__form");
const newCardPopupForm = newCardPopup.querySelector(".popup__form");
const deleteConfirmPopupForm = deleteConfirmPopup.querySelector(".popup__form");
const editAvatarPopupForm = editAvatarPopup.querySelector(".popup__form");

// Кнопки
const popupCloseButtonList = document.querySelectorAll(".popup__close");

// Объекты
const cardListenersFunctions = {
  deleteCardFunction: deleteCardConfirm,
  likeCardFunction: likeCard,
  openImageFunction: openCardImage
};

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_invalid",
  errorClass: "popup__error_visible"
};

// Вспомогательные функции
function getPopupFormElement(popup) {
  const mapPopupForm = new Map;
  
  mapPopupForm.set(profilePopup, profilePopupForm);
  mapPopupForm.set(newCardPopup, newCardPopupForm);
  mapPopupForm.set(editAvatarPopup, editAvatarPopupForm);

  return mapPopupForm.get(popup);
}

function clearPopupFormElement(popupFormElement) {
  if (popupFormElement) {
    popupFormElement.reset();
    clearValidation(popupFormElement, validationConfig);
  }
}

function renderFetching(popupForm, isFetching) {
  const submitButton = popupForm.querySelector(".popup__button");
  submitButton.textContent = isFetching ? "Сохранение..." : "Сохранить";
}

// Начальная загрузка данных пользователя и карточек
Promise.all([getUserData(), getCardList()]).then(([dataUser, dataCardList]) => {
  // Заполнение профиля пользователя
  profileAvatar.style.backgroundImage = `url('${dataUser.avatar}')`;
  profileTitle.textContent = dataUser.name;
  profileDescription.textContent = dataUser.about;
  // Создание карточек
  dataCardList.forEach(cardObj => {
    const currentCard = getCardElem(cardObj, cardListenersFunctions, dataUser._id);
    if (currentCard) {
      placesList.append(currentCard);
      placesList.lastElementChild.setAttribute("data-card-id", cardObj._id);
    }
  });
})

// Рeдактирование профиля
document.querySelector(".profile__edit-button").addEventListener("click", (evt) => {
  profilePopupForm.elements.name.value = profileTitle.textContent;
  profilePopupForm.elements.description.value = profileDescription.textContent;
  profilePopupForm.elements.description.dispatchEvent(new Event("input"));
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
  // Закрытие модального окна по клику на крестик
  btn.addEventListener("click", () => {
    const popupFormElement = getPopupFormElement(popup);
    if (popupFormElement) {
      clearPopupFormElement(popupFormElement);
    }
    closeModal(popup);
  });
  // Закрытие модального окна по клику на оверлей 
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) { 
      const popupFormElement = getPopupFormElement(popup);
      if (popupFormElement) {
        clearPopupFormElement(popupFormElement);
      }
      closeModal(popup); 
    };
  });
});

// Сохранение изменнённых данных профиля
profilePopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderFetching(profilePopupForm, true);
  const name = evt.target.elements.name.value;
  const description = evt.target.elements.description.value;
  setUserData(name, description).then(res => {
    if (res.ok) {
      profileTitle.textContent = name;
      profileDescription.textContent = description;
    } else {
      Promise.reject(res.status);
    }
  }).catch(err => {
    console.log(`Ошибка сохранения данных профиля пользователя: ${err}`);
  }).finally(() => {
    profilePopupForm.reset();
    closeModal(profilePopup);
    clearValidation(profilePopupForm, validationConfig);
    renderFetching(profilePopupForm, false);
  });
});

// Добавление новой карточки в начало
newCardPopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderFetching(newCardPopupForm, true);
  const newCardObj = {
    name: evt.target.elements["place-name"].value,
    link: evt.target.elements.link.value
  };
  addNewCard(newCardObj).then(data => {
    const currentCard = getCardElem(data, cardListenersFunctions);
    if (currentCard) {
      placesList.prepend(currentCard);
      placesList.firstElementChild.setAttribute("data-card-id", data._id);
    }
  }).catch(err => {
    alert(`Ошибка добавления новой карточки: ${err}`);
  }).finally(() => {
    newCardPopupForm.reset();
    closeModal(newCardPopup);
    clearValidation(newCardPopupForm, validationConfig);
    renderFetching(newCardPopupForm, false);
  });
});

// Удаление карточки
deleteConfirmPopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const cardId = deleteConfirmPopup.getAttribute("data-card-id");
  deleteCreatedCard(cardId).then(res => {
    if (res.ok) {
      const cardElem = document.querySelector(`[data-card-id="${cardId}"]`);
      cardElem.remove();
      closeModal(deleteConfirmPopup);
    } else {
      return Promise.reject(res.status);
    }
  }).catch(err => {
    console.log(`Ошибка удаления карточки: ${err}`);
  });
});

profileAvatar.addEventListener("click", () => {
  openModal(editAvatarPopup);
});

editAvatarPopupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderFetching(editAvatarPopupForm, true);
  editAvatar(editAvatarPopupForm.elements.link.value).then(res => {
    if (res.ok) {
      profileAvatar.style.backgroundImage = `url('${editAvatarPopupForm.elements.link.value}')`;
      editAvatarPopupForm.reset();
      closeModal(editAvatarPopup);
      clearValidation(editAvatarPopup, validationConfig);
    } else {
      return Promise.reject(res.status);
    }
  }).catch(err => {
    console.log(`Ошибка изменения аватара пользователя: ${err}`);
  }).finally(() => {
    renderFetching(editAvatarPopupForm, false);
  });
});

// Добавление валидации элементам форм
enableValidation(validationConfig);