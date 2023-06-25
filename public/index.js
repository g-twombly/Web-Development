/**
 * CS 132
 * Author: Gabriella Twombly
 *
 * Adding javascript functions and functionality to index
 * (otherwise known as home) webpage to display all fruits.
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
    await fetchFruits();
  }

  /**
   * This function fecthes the fruit data for the index
   * or homepage and then calls helper functions to parse
   * the data and display it. It also initializes the radio
   * buttons that are used to filter.
   * @param none
   * @return none
   */
  async function fetchFruits() {
    try {
      let resp = await fetch(`/data`);
      checkStatus(resp);
      let fruitsContent = await resp.json();
      showFruits(fruitsContent);

      let filterRadios = qsa('input[name="filter"]');
      filterRadios.forEach((radio) => {
        radio.addEventListener("change", filterFruits);
      });
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * This function parses through the fruit data collected, 
   * appends the appropriate information in a new div for 
   * each fruit, and then adds it to the html so the homepage
   * populates with the fruit catalog.
   * @param fruitsContent information for all the fruits
   * @return none
   */
  function showFruits(fruitsContent) {
    let to_append = id("products");
    fruitsContent.forEach((fruit) => {
      let new_div = gen("div");

      let link = gen("a");
      link.href = `product.html?fruit=${encodeURIComponent(fruit.name)}`;
      new_div.appendChild(link);

      let h3 = gen("h3");
      h3.textContent = fruit.name;
      link.appendChild(h3);

      let new_img = gen("img");
      new_img.src = fruit.img;
      new_img.alt = fruit.alt;
      link.appendChild(new_img);

      to_append.appendChild(new_div);
    });
  }

  /**
   * This function is a helper function to identify 
   * which radio button is selected and to set the respective
   * value. It then makes a call to implemenet the filtered views.
   * @param none
   * @return none
   */
  async function filterFruits() {
    let filterRadios = qsa('input[name="filter"]');
    let filterValue;
    filterRadios.forEach((radio) => {
      if (radio.checked) {
        filterValue = radio.value;
      }
    });

    try {
      let resp = await fetch(`/data?filter=${filterValue}`);
      checkStatus(resp);
      let filteredFruits = await resp.json();
      clearFruits();
      showFruits(filteredFruits);
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * This function initializes the page and loads the
   * necessary functions.
   * @param none
   * @return none
   */
  function clearFruits() {
    let productsDiv = id("products");
    while (productsDiv.firstChild) {
      productsDiv.removeChild(productsDiv.firstChild);
    }
  }

  /**
   * Returns the element that has the ID attribute with the 
   * specified value.
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
   * Returns a new element with the given tagname
   * @param {string} tagName - name of element to create and return
   * @returns {object} new DOM element with the given tagname
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * (New) Lecture 11: Helper function to return the Response
   * data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for
   * success/error.
   * @returns {object} - The Response object if successful, otherwise
   * an Error that
   * needs to be caught.
   */
  function checkStatus(response) {
    if (!response.ok) {
      // response.status >= 200 && response.status < 300
      throw Error(`Error in request: ${response.statusText}`);
    } // else, we got a response back with a good status code (e.g. 200)
    return response; // A resolved Response object.
  }

  /**
   * This function handles the errors
   */
  function errorHandler(err, req, res, next) {
    res.type("text");
    res.send(err.message);
  }

  init();
})();
