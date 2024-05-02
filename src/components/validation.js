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

function checkInputValidity(formElement, inputElement, validationConfig) {
  inputElement.setCustomValidity("");
  if (inputElement.type === "url") {
    const imageFileExtArray = ["png", "pcx", "bmp", "jpg", "jpeg", "tiff"];
    const curLinkExt = inputElement.value.split(".").pop().toLowerCase();
    inputElement.setCustomValidity(imageFileExtArray.includes(curLinkExt) ? "" : "Ссылка не указывает на изображение.");
  }
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.validationMessage + ". " + inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity(inputElement.validationMessage);
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}

function setEventListeners(formElement, validationConfig)  {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
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