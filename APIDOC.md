# Gabriella Twombly API Documentation

This is an API for a community fruit marketplace. The API supports all endpoints regarding retreiving, filtering, and updating infomation about fruit and the cart in the marketplace. Additionally, it supports the contact page between customers and the team.

Shared behavior for all endpoints:
400 errors are clients accessing the incorrect material and requests.
500 errors are for server-side errors and have their own generic error message.

## GET /data

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a JSON list of all the fruit in the store.

**Supported Parameters**

- filter - (optional): users can filter between local fruit and those
  imported from Mexico by using radio buttons on the HTML page.
  If set to "true", it will filter for imported.

**Example Request:** GET /data?filter=true

**Example Response:**

```json
    {
        "name": "banana",
        "price": "0.50",
        "description": "tropical fruit with soft inside",
        "img": "imgs/banana.jpeg",
        "alt": "spread-of-bananas",
        "source": "imported from mexico",
        "quantity": "10"
    },
    {
        "name": "mango",
        "price": "1.50",
        "description": "tropical fruits with sweet, juicy, orange inside",
        "img": "imgs/mango.jpeg",
        "alt": "a-few-wet-mangos",
        "source": "imported from mexico",
        "quantity": "10"
    },
    {
        "name": "papaya",
        "price": "2.00",
        "description": "large tropical fruits with sweet, orange inside and pocket of small black seeds",
        "img": "imgs/papaya.jpeg",
        "alt": "single-cut-papaya",
        "source": "imported from mexico",
        "quantity": "10"
    },
    {
        "name": "pineapple",
        "price": "2.50",
        "description": "large, tropical, yellow, and spiky fruit with a sweet and tangy taste",
        "img": "imgs/pineapple.jpeg",
        "alt": "a-single-pineapple",
        "source": "imported from mexico",
        "quantity": "10"
    }

```

**Error Handling:**

**Example Request:**
GET /data?filter=wrong

**Example Response:**
Please input a valid filter value: true, 'false', or undefined.

## GET /data/:fruit \*

**Request Format:** GET

**Returned Data Format**: JSON

**Description:** Returns information on an individual fruit product.

**Supported Parameters**

- /:fruit - (required):This indicates which fruit to get information for.

**Example Request:** GET /data/apple

**Example Response:**

```json
{
  "name": "apple",
  "price": "1.50",
  "description": "crisp texture",
  "img": "imgs/apple.jpeg",
  "alt": "bushel-of-apples",
  "source": "apple hill, ca",
  "quantity": "10"
}
```

**Error Handling:**

**Example Request:**
GET /data/random

**Example Response:**
The file requested does not exist.

## GET /faq

**Request Format:** GET

**Returned Data Format**: Plain Text

**Description:** Returns frequently asked questions .txt file as
plain text.

**Supported Parameters** None

**Example Request:** GET /faq

**Example Response:**

```
Why did you choose to start a fruit market?
We chose to start a fruit market because, with recent inflation, it is growing harder for students to buy affordable fresh produce. Here, we bring together local farmers and students to make these fruits available (in bulk and at lower prices) and assist farmers who may not easily find customers during this time.

...And more!
```

**Error Handling:**

**Example Request:**
GET /faq

**Example Response:**
"Something went wrong on the server, please try again later.";

## POST /contact-us

**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Allows client to submit their email and message
to contact team which is saved to a file contact-messages.txt.

**Supported Parameters**

- POST body parameters:
  - email - (required): The client email, must have email format
  - msg - (required): The client message, must be at least 15 characters

**Example Request:**
POST /contact-us

{
"email": "gtwombly@caltech.edu",
"msg": "Hello! Please add more fruit variety. Thank you."
}

**Example Response:**

```
Thank you for contacting us. We will get back to you as soon as we can.
```

**Error Handling:**

**Example Request:**
POST /contact-us

{
"email": "",
"msg": "Hello! Please add more fruit variety. Thank you."
}

**Example Response:**
Please fill out this field!

## POST /add

**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Allows functionality for adding fruit products
to customer cart.

**Supported Parameters**

- POST body parameters:
  - fruitName - (required): Name of the fruit to be added to the cart
  - customization - (required): Any customization notes for the fruit
    (e.g., size, color).
  - quantity - (required): The quantity of the fruit to add (1, 5, or 10)

**Example Request:**
POST /add
Content-Type: application/json

{
"fruitName": "apple",
"customization": "no green apples",
"quantity": 5
}

**Example Response:**

```
Successfully added to cart!
```

**Error Handling:**

**Example Request:**
POST /add
Content-Type: application/json

{
"fruitName": "starfruit",
"customization": "",
"quantity": 5
}

**Example Response:**
Your addition could not be made at this time.

## GET /getcart

**Request Format:** GET

**Returned Data Format**: JSON

**Description:** Returns JSON of items in the cart from cart.txt file.

**Supported Parameters** None

**Example Request:** GET /getcart

**Example Response:**

```json
[
  {
    "name": "banana",
    "price": "0.50",
    "quantity": 1,
    "customization": "no large bananas"
  },
  {
    "name": "cherry",
    "price": "3.00",
    "quantity": 1,
    "customization": "Please wrap them in plastic. Thank you."
  }
]
```

**Error Handling:**

**Example Request:**
GET /getcart

**Example Response:**
"Something went wrong on the server, please try again later.";

## POST /remove

**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Removes a fruit from the client cart.

**Supported Parameters**

- POST body parameters:
  - index (required): The index of the fruit item to remove from the cart.

**Example Request:**
POST /remove

{
"index": 0
}

**Example Response:**
The item has been removed and total updated.

**Error Handling:**

**Example Request:**
POST /remove

{
"index": 4
}

**Example Response:**
The file requested does not exist.

**Sources for all fruit images**
Website for all images: Pixabay
Fruit: Apples
User: Larisa-K
Fruit: Bananas
User: _Alicja_
Fruit: Blackberry
User: Ajale
Fruit: Blueberry
User: elizadean
Fruit: Cherry
User: Couleur
Fruit: Grape
User: stevepb
Fruit: Kiwi
User: AliceKeyStudio
Fruit: Mango
User: luhaifeng
Fruit: Papaya
User: varintorn
Fruit: Peach
User: Couleur
Fruit: Pear
User: PublicDomainPictures
Fruit: Pineapple
User: Shutterbug75
Fruit: Plum
User: Pavlofox
Fruit: Strawberry
User: robertobarresi
Fruit: Watermelon
User: Pexels
