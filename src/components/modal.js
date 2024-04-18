/**
 * Функция открывает модальное окно
 * @param {DOMElement} popup 
 */
export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keyup", closeModalByEscape);
}

/**
 * Функция закрытвает модальное окно
 * @param {DOMElement} popup 
 */
export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", closeModalByEscape);
}

// Функция закрывает модальное окно при клике за пределами окна
export function closeModalByOverlay(evt) {
  if (evt.target === evt.currentTarget) { 
    closeModal(evt.currentTarget); 
  }; }

// Функция закрывает модальное окно при нажатии на клавишу Escape
export function closeModalByEscape(evt) {
  if (evt.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}