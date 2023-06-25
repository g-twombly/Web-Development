/**
 * CS 132
 * Author: Gabriella Twombly
 *
 * Adding javascript functions and functionality to a
 * product webpage that is dynamically filled for each individual fruit.
 *
 */

(function () {
  "use strict";

  const root_path = "";
  const urlParams = new URLSearchParams(window.location.search);
  const fruitName = urlParams.get("fruit");

  /**
   * This function initializes the page and loads the
   * necessary functions.
   * @param none
   * @return none
   */
  async function init() {
    fetchFruitData();
    id("addToCart").addEventListener("click", addToCart);
  }

  /**
   * This function fetches the information for the specific
   * fruit the product.html page has loaded. It calls the
   * necessary helper functons to update the details specific
   * to that fruit.
   * @param none
   * @return none
   */
  async function fetchFruitData() {
    try {
      let url = `${root_path}/data/${encodeURIComponent(fruitName)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch fruit data.");
      }
      const fruitData = await response.json();
      updateProductDetails(fruitData);
    } catch (error) {
      errorHandler(error);
    }
  }

  /**
   * This function parses through the data for a single fruit
   * product and appends the relevant ids on the html page
   * to display the fruit content as their new text content.
   * @param fruitData the information of a specific fruit product
   * @return none
   */
  function updateProductDetails(fruitData) {
    const prodName = id("product-name");
    const prodDescrip = id("product-description");
    const prodImg = id("product-image");
    const prodPrice = id("product-price");
    const prodElem = id("product-source");
    const prodQuant = id("product-stock");

    prodName.textContent = `Product: ${fruitData.name}`;
    prodImg.src = fruitData.img;
    prodImg.alt = fruitData.alt;
    prodDescrip.textContent = `Description: ${fruitData.description}`;
    prodPrice.textContent = `Price per ${fruitData.name}: ${fruitData.price} (USD)`;
    prodElem.textContent = `Sourced from: ${fruitData.source}`;
    prodQuant.textContent = `In stock: yes`;
  }

  /**
   * This function allows a user to add their items to their
   * cart once a button has been clicked. It makes a POST call
   * to update the cart.txt file with the relevant object fields.
   * If successful, it displays a success message. The values are
   * reset.
   * @param none
   * @return none
   */
  async function addToCart() {
    const fruitName = id("product-name").textContent.replace("Product: ", "");
    const quantity = id("quantity").value;
    const customization = id("customization").value;

    try {
      const result = await fetch(`${root_path}/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fruitName: fruitName,
          customization: customization,
          quantity: quantity,
        }),
      });
      let resp = checkStatus(result);
      resp = await resp.text();
      id("reply").textContent = resp;
    } catch (err) {
      id("reply").textContent = "Your addition could not be made at this time.";
    }
    id("quantity").value = "1";
    id("customization").value = "";
  }

  /**
   * This function handles the errors
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
   * (New) Lecture 11: Helper function to return the Response
   * data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for
   * success/error.
   * @returns {object} - The Response object if successful,
   * otherwise an Error that
   * needs to be caught.
   */
  function checkStatus(response) {
    if (!response.ok) {
      // response.status >= 200 && response.status < 300
      throw Error(`Error in request: ${response.statusText}`);
    } // else, we got a response back with a good status code (e.g. 200)
    return response; // A resolved Response object.
  }

  init();
})();
