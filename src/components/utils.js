
/**
 * Функция проверяет ответ от fetch
 * @param {PromiseResolve} res 
 * @returns fetch-data or error
 */
export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
}