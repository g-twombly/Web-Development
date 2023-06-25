/**
 * CS 132
 * Name: Gabriella Twombly
 *
 * This is the javascript code for my fruit marketplace
 * that will handle all of the backend javascript.
 *
 * 
 * Options 5 and 6 selected for features
 */

const express = require("express");
const multer = require("multer");
const fs = require("fs/promises");
const res = require("express/lib/response");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(multer().none());

const SERVER_ERROR =
  "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;

/**
 * This request returns all the fruit products in
 * our database. If there is a client error, it
 * returns a message and a 400 error. If there is a
 * server error, it returns a message and a 500 error.
 */
app.get("/data", async (req, res, next) => {
  try {
    let fruits = await getFruits();
    const filterValue = req.query.filter;
    if (
      filterValue !== "true" &&
      filterValue !== "false" &&
      filterValue !== undefined
    ) {
      return res
        .status(CLIENT_ERR_CODE)
        .send(
          "Please input a valid filter value: true, 'false', or undefined."
        );
    }

    if (filterValue === "true") {
      fruits = fruits.filter(
        (fruit) => fruit.source === "imported from mexico"
      );
    }

    res.json(fruits);
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * This request returns individual fruit products in
 * our database. If there is a client error, it
 * returns a message and a 400 error. If there is a
 * server error, it returns a message and a 500 error.
 */
app.get("/data/:fruit", async (req, res, next) => {
  try {
    let fruit = req.params.fruit;
    let fruitPath = `data/${fruit}`;

    const fruitExists = await checkFruitExistence(fruitPath);
    if (!fruitExists) {
      throw new Error("The file requested does not exist.");
    }

    let fruitData = await getFruitData(fruitPath);
    res.json(fruitData);
  } catch (err) {
    res.status(CLIENT_ERR_CODE);
    err.message = err.message || SERVER_ERROR;
    next(err);
  }
});

async function checkFruitExistence(fruitPath) {
  try {
    await fs.access(fruitPath);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * This request returns the FAQ page data from the .txt file.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 */
app.get("/faq", (req, res, next) => {
  try {
    const faq = fs.readFileSync("/faq/faq.txt", "utf8");
    res.type("text").send(faq);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * This function reads the fruit directories in the data folder.
 * It calls another helper to retrieve the individual fruit data.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 * @param none
 * @return fruitData JSON objects
 */
async function getFruits() {
  let result = [];
  try {
    let path = "data/";
    let itemDirs = await fs.readdir(path, { withFileTypes: true });

    for (let i = 0; i < itemDirs.length; i++) {
      if (itemDirs[i].isDirectory()) {
        let fruitPath = path + itemDirs[i].name;
        let fruitData = await getFruitData(fruitPath);
        result.push(fruitData);
      }
    }
    return result;
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
}

/**
 * This function will find the path to the data for
 * our API for a single fruit product and generate its
 * JSON.
 * @param fruitPath a path to the folder
 * @return a fruit object with all the info in info.txt
 */
async function getFruitData(fruitPath) {
  try {
    let file_info = await fs.readFile(fruitPath + "/info.txt", "utf8");
    let data = file_info.split("\n");
    let name = data[0];
    let price = data[1];
    let description = data[2];
    let img = data[3];
    let alt = data[4];
    let source = data[5];
    let quantity = data[6];

    return {
      name: name,
      price: price,
      description: description,
      img: img,
      alt: alt,
      source: source,
      quantity: quantity,
    };
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
    }
  }
}

/**
 * This request fills the contact-messages.txt file and
 * supports the backend of the customer contact page.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 */
app.post("/contact-us", async (req, res, next) => {
  let message = null;
  let email = req.body.email;
  let msg = req.body.msg;
  if (email && msg) {
    message = {
      email: email,
      msg: msg,
    };
  }
  if (!message) {
    res.status(CLIENT_ERR_CODE);
    return next(Error("Please enter a valid email and message."));
  }

  try {
    let client_message = message.email + " : " + message.msg + "\n";
    await fs.appendFile("contact-messages.txt", client_message, "utf8");
    res.type("text");
    res.send(
      "Thank you for contacting us. We will get back to you as soon as we can."
    );
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * This request supports the backend of adding fruit to the
 * customer cart and writing to the correct file.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 */
app.post("/add", async (req, res, next) => {
  try {
    const fruit = await getFruitData("data/" + req.body.fruitName);
    let cart = await fs.readFile("public/cart.txt", "utf8");
    let cartObj = JSON.parse(cart);
    let found = false;
    let num = 0;

    cartObj.forEach((c) => {
      if (
        req.body.fruitName === c.name &&
        req.body.customization === c.customization
      ) {
        c.quantity = parseInt(c.quantity) + parseInt(req.body.quantity);
        found = true;
        num = c.quantity;
      }
    });

    if (!found) {
      cartObj.push({
        name: req.body.fruitName,
        price: parseFloat(fruit.price).toFixed(2),
        quantity: parseInt(req.body.quantity),
        customization: req.body.customization,
      });
    }
    await fs.writeFile("public/cart.txt", JSON.stringify(cartObj));
    res.type("text");
    if (found) {
      res.send("Successfully added to cart!" + 
      " You have a total of " + num + " of these items.");
    } else {
      res.send("Successfully added to cart!");
    }
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * This request returns the items in the customer cart.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 */
app.get("/getcart", async (req, res, next) => {
  try {
    let cart = await fs.readFile("public/cart.txt", "utf8");
    let cartObj = JSON.parse(cart);
    res.json(cartObj);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * This request supports removing items from the customer cart.
 * If there is a client error, it returns a message and a 400
 * error. If there is a server error, it returns a message
 * and a 500 error.
 */
app.post("/remove", async (req, res, next) => {
  try {
    let cart = await fs.readFile("public/cart.txt", "utf8");
    let cartObj = JSON.parse(cart);
    let tempCart = [];

    cartObj.forEach((c, i) => {
      if (i !== parseInt(req.body.index)) {
        tempCart.push(c);
      }
    });

    try {
      await fs.writeFile("public/cart.txt", JSON.stringify(tempCart));
      res.type("text");
      res.send("The item has been removed and total updated.");
    } catch (err) {
      if (err.code == "ENOENT") {
        res.status(CLIENT_ERR_CODE);
        err.message = "The file requested does not exist.";
      } else {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
      }
    }
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The file requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * This function handles the errors
 */
function errorHandler(err, req, res, next) {
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("LISTENING ON PORT " + PORT + "...");
});
