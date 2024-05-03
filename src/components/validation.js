// const urlPattern = new RegExp(/^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i);

function showInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.classList.add(validationConfig.errorClass);
  errorElement.textContent = inputElement.validationMessage;
};

function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
};

function isImgUrlValid(link) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = link;
    img.onload = resolve;
    img.onerror = reject;
  });
}

function displayInputError(formElement, inputElement, validationConfig) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

function checkInputValidity(formElement, inputElement, validationConfig) { 
  if (inputElement.validity.patternMismatch) { 
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); 
  } else { 
    inputElement.setCustomValidity(""); 
  } 
  displayInputError(formElement, inputElement, validationConfig);
  return inputElement.validity.valid;
};

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function disableButton(buttonElement, validationConfig) {
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
  buttonElement.disabled = true;
}

function setEventListeners(formElement, validationConfig)  {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      const inputValid = checkInputValidity(formElement, inputElement, validationConfig);
      if (inputValid && inputElement.type === "url") {
        disableButton(buttonElement, validationConfig);
        isImgUrlValid(inputElement.value).then(() => {
          inputElement.setCustomValidity("");
        }).catch(() => {
          inputElement.setCustomValidity("Ссылка не указывает на изображение."); 
        }).finally(() => {
          displayInputError(formElement, inputElement, validationConfig);
          toggleButtonState(inputList, buttonElement, validationConfig);
        });
      } else {
        toggleButtonState(inputList, buttonElement, validationConfig);
      }
    });
  });
}

/**
 * Включение валидации всех форм
 * @param {{
 *  formSelector:string, 
 *  inputSelector:string, 
 *  submitButtonSelector:string, 
 *  inactiveButtonClass:string, 
 *  inputErrorClass:string, 
 *  errorClass:string}} validationConfig 
 */
export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationConfig);
  });
}

/**
 * Очистка ошибок валидации
 * @param {DOMElement} formElement 
 * @param {{
 *  formSelector:string, 
 *  inputSelector:string, 
 *  submitButtonSelector:string, 
 *  inactiveButtonClass:string, 
 *  inputErrorClass:string, 
 *  errorClass:string}} validationConfig 
 */
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
  });

  toggleButtonState(inputList, buttonElement, validationConfig);
}