/**
 * CS 132
 * Author: Gabriella Twombly
 *
 * Adding javascript functions and functionality to contact
 * page that will allow data to be inputted and submitted.
 *
 */

(function () {
  "use strict";

  let root_path = "";

  /**
   * This function initializes the page and loads the
   * necessary functions.
   * @param none
   * @return none
   */
  function init() {
    id("contact-form").addEventListener("submit", (submitting) => {
      submitting.preventDefault();
      shareContact();
    });
  }

  /**
   * This function intakes the contact information from the
   * contact form and updates the html saying we received the
   * message if successful.
   * @param none
   * @return none
   */
  async function shareContact() {
    let inpt = new FormData(id("contact-form"));

    let format = { method: "POST", body: inpt };

    try {
      let resp = await fetch(root_path + "/contact-us", format);
      resp = checkStatus(resp);
      resp = await resp.text();
      id("response").textContent = resp;
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
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
