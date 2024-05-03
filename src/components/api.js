import { Promise } from "core-js";
import { checkResponse } from "./utils";

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-12',
  headers: {
    authorization: '329fcab9-eb6e-4473-91c4-93af6c51021c',
    'Content-Type': 'application/json'
  }
};

/**
 * Функция получает данных текущего пользователя
 * @returns {{name:string, about:string, avatar:URL, _id:string, cohort:string}}
 */
export const getUserData = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(checkResponse);
}

/**
 * Функция получает массив карточек
 * @returns {Array<{
 *  likes:Array, 
 *  _id:string,
 *  name:string, 
 *  link:URL, 
 *  owner:{
 *    name:string, 
 *    about:string, 
 *    avatar:URL, 
 *    _id:string, 
 *    cohort:string
 *  }, 
 *  createdAt:Date
 * }>}
 */
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
}

/**
 * Функция устанавливает данные текущего пользователя
 * @param {string} name 
 * @param {string} description 
 * @returns {{name:string, about:string, avatar:URL, _id:string, cohort:string}}
 */
export const setUserData = (name, description) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: description
    })
  }).then(checkResponse);
}

/**
 * 
 * @param {{name:string, link:URL}} cardObj 
 * @returns {{
 *  likes:Array, 
 *  _id:string,
 *  name:string, 
 *  link:URL, 
 *  owner:{
 *    name:string, 
 *    about:string, 
 *    avatar:URL, 
 *    _id:string, 
 *    cohort:string
 *  }, 
 *  createdAt:Date
 * }
 */
export const addNewCard = (cardObj) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(cardObj)
  }).then(checkResponse);
}

/**
 * Функция удаляет созданную карточку
 * @param {string} cardId - id карточки
 * @returns {{
 *  likes:Array, 
 *  _id:string,
 *  name:string, 
 *  link:URL, 
 *  owner:{
 *    name:string, 
 *    about:string, 
 *    avatar:URL, 
 *    _id:string, 
 *    cohort:string
 *  } 
 */
export const deleteCreatedCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers
  }).then(checkResponse);
}

/**
 * Функция устанавливает лайк карточки
 * @param {string} cardId - id карточки
 * @returns {{
 *  likes:Array, 
 *  _id:string,
 *  name:string, 
 *  link:URL, 
 *  owner:{
 *    name:string, 
 *    about:string, 
 *    avatar:URL, 
 *    _id:string, 
 *    cohort:string
 *  } 
 */
export const putLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers
  }).then(checkResponse);
}

/**
 * Функция удаляет лайк карточки
 * @param {string} cardId - id карточки
 * @returns {{
 *  likes:Array, 
 *  _id:string,
 *  name:string, 
 *  link:URL, 
 *  owner:{
 *    name:string, 
 *    about:string, 
 *    avatar:URL, 
 *    _id:string, 
 *    cohort:string
 *  } 
 */
export const deleteLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers
  }).then(checkResponse);
}

export const editAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: link
    })
  }).then(checkResponse);
}
