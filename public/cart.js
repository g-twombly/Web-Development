/**
 * CS 132
 * Author: Gabriella Twombly
 *
 * Adding javascript functions and functionality to cart
 * view.
 *
 */

(function () {
  "use strict";

  /**
   * This function initializes the page and loads the
   * necessary functions.
   * @param none
   * @return none
   */
  async function init() {
    displayCartItems();
  }

  /**
   * This function supports the cart functionality like
   * loading the items and removing the items from the cart.
   * @param none
   * @return none
   */
  async function displayCartItems() {
    let cartBody = id("cart-items");
    const response = await fetch("/getcart");
    const data = await response.json();

    let totalPrice = 0;
    let cartText = "";

    for (let i = 0; i < data.length; i++) {
      let { name, price, quantity, customization } = data[i];
      totalPrice = totalPrice + price * quantity;
      cartText += `<tr><td>${name}</td><td>${quantity}</td><td>${price}</td>
      <td>${customization}</td><td>
      <button class="removeBtn" data-name="${name}" data-index="${i}">X</button>
      </td></tr>`;
    }

    cartBody.innerHTML = cartText;

    const allDeleteBtn = qsa(".removeBtn");
    for (let d = 0; d < allDeleteBtn.length; d++) {
      allDeleteBtn[d].addEventListener("click", async (e) => {
        let name = e.target.getAttribute("data-name");
        let index = e.target.getAttribute("data-index");

        try {
          const result = await fetch("/remove", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fruitName: name,
              index: index,
            }),
          });
          if (result) {
            displayCartItems();
          }
          let resp = checkStatus(result);
          resp = await resp.text();
          id("reply").textContent = resp;
        } catch (err) {
          errorHandler(err);
        }
      });
    }

    let totalPriceEl = id("total-price");
    totalPriceEl.textContent = "$" + totalPrice.toFixed(2);
  }

  /**
   * This function handles the errors
   * @param err the error being passed in
   */
  function errorHandler(err, req, res, next) {
    res.type("text");
    res.send(err.message);
  }

  /**
   * Returns the element that has the ID attribute with the specified 
   * value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query 
   * (empty if none).
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * (New) Lecture 11: Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error(`Error in request: ${response.statusText}`);
    }
    return response;
  }

  init();
})();
