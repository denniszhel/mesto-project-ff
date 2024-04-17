/**
 * Функция открывает модальное окно
 * @param {Event} evt 
 * @param {DOMElement} popup 
 * @param {{profileTitle:string, profileDescription:string, imageName:string, imageLink:string}} params 
 */
export function openModal(popup, params = undefined) {
  if (params) {
    const popupForm = popup.querySelector(".popup__form");
    const popupImage = popup.querySelector(".popup__image");
    if (popupForm) {
      if ("profileTitle" in params) popupForm.elements.name.value = params.profileTitle;
      if ("profileDescription" in params) popupForm.elements.description.value = params.profileDescription;
    }
    if (popupImage) {
      if ("imageLink" in params) popupImage.setAttribute("src", params.imageLink);
      if ("imageName" in params) {
        popupImage.setAttribute("alt", params.imageName);
        popup.querySelector(".popup__caption").textContent = params.imageName;
      }
    }
  }
  popup.classList.add("popup_is-opened");
  document.addEventListener("keyup", closeModalByEscape);
}

/**
 * Функция закрытвает модальное окно
 * @param {DOMElement} popup 
 * @returns 
 */
export function closeModal(popup) {
  const popupForm = popup.querySelector(".popup__form");
  if (popupForm) popupForm.reset();
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", closeModalByEscape);
}

// Функция закрывает модальное окно при нажатии на кнопку закрытия
export function closeModalByButton(evt) {
  if (evt.target.classList.contains("popup__close")) {
    evt.stopPropagation();
    closeModal(evt.currentTarget);
  }
}

// Функция закрывает модальное окно при клике за пределами окна
export function closeModalByOverlay(evt) {
  const popupContent = evt.target.closest(".popup__content");
  const popupOpened = document.querySelector(".popup_is-opened");
  if (!popupContent && popupOpened) {
    closeModal(popupOpened);
  }
}

// Функция закрывает модальное окно при нажатии на клавишу Escape
export function closeModalByEscape(evt) {
  if (evt.key === "Escape" || evt.keyCode == 27) {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}