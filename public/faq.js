/**
 * CS 132
 * Author: Gabriella Twombly
 *
 * Adding javascript functions and functionality to FAQ
 * webpage.
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
  async function init() {
    getQA();
  }

  /**
   * This function fetches the data for the faq page and
   * calls a helper function to add the data.
   * @param none
   * @return none
   */
  async function getQA() {
    try {
      let resp = await fetch(root_path + "/faq/faq.txt");
      checkStatus(resp);
      let faqContent = await resp.text();
      let parsed = getFAQData(faqContent);
      addingFAQData(parsed);
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * This function gets the faq from the .txt
   * file and parses it so that the lines from the page are collected as
   * question one one line and then answer on the next line, alternating.
   * @param faqContent the content from the .txt file
   * @return the filtered and finished data from the file
   */
  function getFAQData(faqContent) {
    const txt = faqContent.split("\n");
    const faqData = [];

    for (let i = 0; i < txt.length; i += 2) {
      const question = txt[i].trim();
      const answer = txt[i + 1].trim();
      faqData.push({ question, answer });
    }

    return faqData;
  }

  /**
   * This functions takes the parsed FAQ text and adds
   * it to the html already on the page.
   * @param faqs the data to be appended
   * @return none
   */
  function addingFAQData(faqs) {
    const faqSection = id("faq-section");

    for (let i = 0; i < faqs.length; i++) {
      const question = faqs[i].question;
      const answer = faqs[i].answer;

      const questionElement = gen("h2");
      questionElement.textContent = question;

      const answerElement = gen("p");
      answerElement.textContent = answer;

      faqSection.appendChild(questionElement);
      faqSection.appendChild(answerElement);
    }
  }

  /**
   * This function handles the errors
   */
  function errorHandler(err, req, res, next) {
    res.type("text");
    res.send(err.message);
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
   * Returns a new element with the given tagname
   * @param {string} tagName - name of element to create and return
   * @returns {object} new DOM element with the given tagname
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * (New) Lecture 11: Helper function to return the Response data if 
   * successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
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

  init();
})();
