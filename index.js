// Import necessary modules and libraries
const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
// Initialize the Express app
const app = express().use(body_parser.json());
// Load environment variables
let name = "";
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;
let customer_exists = false;
// Import necessary modules and libraries
const mysql = require("mysql");
const cors = require("cors");
//setting up a port
let finalCost = 0;
const port = process.env.PORT || 3000;
// Set up CORS and JSON parsing middlewares

async function getLatestProducts(from) {

  let orderId = 0;

  await axios
    .get(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/getLatestCustomerOrder/${from}`
    )
    .then((response) => {
      // Handle the response data (latest order number)
      orderId = response.data.latestOrder;
      console.log(`Latest order ID for ${from} is ${orderId}`);

      // You can use the orderId variable here or within this block
    })
    .catch((error) => {
      // Handle errors (e.g., customer not found)
      console.error(error);
    });

  await axios
    .get(`https://whatsapp-store-962fd16a3e29.herokuapp.com/getOrderItemsByOrder/${orderID}`)
    .then((response) => {
      // Handle the response data (list of products)
      const products = response.data;
      console.log(products, "HERE ARE THE LIST OF PRODUCTS!!!");
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
  let confirmationMessage = "Latest Order:\n";
  confirmationMessage += `Order ID: ${products[0].orderID}\n`;
  for (let i = 0; i < products.length; i++) {

    if (products[i].productRetailerId == "iz66q3jhrj") {
      confirmationMessage += `Product Name: MyCandy EarBuds\n`;
      confirmationMessage = `Quantity: ${products[i].quantity}\n`;
    } else if (products[i].productRetailerId == "cfmdnndye8") {
      confirmationMessage += `Product Name: Samsung Galaxy S21\n`;
      confirmationMessage = `Quantity: ${products[i].quantity}\n`;
    } else if (products[i].productRetailerId == "z02pcbs4ku") {
      confirmationMessage += `Product Name: iPhone 11\n`;
      confirmationMessage = `Quantity: ${products[i].quantity}\n`;
    } else if (products[i].productRetailerId == "0catwmfljc") {
      confirmationMessage += `Product Name: Smartwatch\n`;
      confirmationMessage = `Quantity: ${products[i].quantity}\n`;
    }
  }
  await axios({
    method: "POST",
    url: "https://graph.facebook.com/v17.0/" +
      phon_no_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: confirmationMessage,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

}

app.use(cors());
app.use(express.json());
// Start the server to listen on the specified port
app.listen(process.env.PORT, () => {
  console.log("webhook is listening");
});
// to maintain session state for each cutomer
const sessions = {};
//function that starts new session
const startSession = (phoneNumberId, from) => {
  sessions[phoneNumberId] = {
    from,
    inSession: true,
    chosenLocation: null,
    prompt: null,
    storedName: null,
    location_body: null,
  };
};
const endSession = (phoneNumberId) => {
  if (sessions[phoneNumberId]) {
    delete sessions[phoneNumberId];
  }
};

// Initialize order details for each session
const orderDetails = {};
//database setup [change this with new database provided]
const db = mysql.createConnection({
  host: "whatsapp-store.crclrhhtf2hs.eu-north-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "Nazeem2002",
  database: "CustomerInfo",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to the database");
  }
});
//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(chellange);
    } else {
      res.status(403);
    }
  }
});
// Route to handle incoming messages from users
app.post("/webhook", (req, res) => {
  const customerData = {
    customerPhoneNumber: null,
    storedName: null,
    chosenLocation: null,
    location_body: null,
  };
  const body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      const customerPhoneNumber =
        body_param.entry[0].changes[0].value.messages[0].from;
      const phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body_param.entry[0].changes[0].value.messages[0].from;
      const type = body_param.entry[0].changes[0].value.messages[0].type;
      let msg_body = "";
      let interactive_body = "";
      let location_body = {};
      let storedName = {};
      async function getLatestProducts(from) {
        let orderId = 0;
        let products = {};
        await axios
          .get(
            `https://whatsapp-store-962fd16a3e29.herokuapp.com/getLatestCustomerOrder/${from}`
          )
          .then((response) => {
            // Handle the response data (latest order number)
            orderId = response.data.latestOrder;
            console.log(`Latest order ID for ${from} is ${orderId}`);

            // You can use the orderId variable here or within this block
          })
          .catch((error) => {
            // Handle errors (e.g., customer not found)
            console.error(error);
          });

        await axios
          .get(`https://whatsapp-store-962fd16a3e29.herokuapp.com/getOrderItemsByOrder/${orderId}`)
          .then((response) => {
            // Handle the response data (list of products)
            products = response.data;
            console.log(products, "HERE ARE THE LIST OF PRODUCTS!!!");
          })
          .catch((error) => {
            // Handle errors
            console.error(error);
          });
        let confirmationMessage = "Latest Order:\n";
        confirmationMessage += `Order ID: ${products[0].OrderID}\n`;
        console.log(products);
        for (let i = 0; i < products.length; i++) {

          if (products[i].ProductRetailerID == "iz66q3jhrj") {
            confirmationMessage += `Product Name: MyCandy EarBuds\n`;
            confirmationMessage += `Quantity: ${products[i].Quantity}\n`;
          } else if (products[i].ProductRetailerID == "cfmdnndye8") {
            confirmationMessage += `Product Name: Samsung Galaxy S21\n`;
            confirmationMessage += `Quantity: ${products[i].Quantity}\n`;
          } else if (products[i].ProductRetailerID == "z02pcbs4ku") {
            confirmationMessage += `Product Name: iPhone 11\n`;
            confirmationMessage += `Quantity: ${products[i].Quantity}\n`;
          } else if (products[i].ProductRetailerID == "0catwmfljc") {
            confirmationMessage += `Product Name: Smartwatch\n`;
            confirmationMessage += `Quantity: ${products[i].Quantity}\n`;
          }

          console.log(confirmationMessage);
        }
        await axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: confirmationMessage,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (type == "text") {
        msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
        // Check for greetings and start the session
        if (msg_body.toLowerCase().includes("latest order")) {
          getLatestProducts(from);

        }
        if (
          msg_body.toLowerCase().includes("hi") ||
          msg_body.toLowerCase().includes("hello") ||
          msg_body.toLowerCase().includes("hey")
        ) {
          customer = processMessage(
            msg_body,
            phon_no_id,
            customerPhoneNumber,
            sessions,
            from
          );
        } else if (msg_body.toLowerCase().includes("deira")) {
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "interactive",
              interactive: {
                type: "product_list",
                header: {
                  type: "text",
                  text: "Hyke Store",
                },
                body: {
                  text: "Electronic Products and Accessories",
                },
                footer: {
                  text: "Cash on delivery",
                },
                action: {
                  catalog_id: "260917343538127",
                  sections: [{
                      title: "Smartphones",
                      product_items: [{
                          product_retailer_id: "cfmdnndye8",
                        },
                        {
                          product_retailer_id: "z02pcbs4ku",
                        },
                      ],
                    },
                    {
                      title: "Smartwatches",
                      product_items: [{
                        product_retailer_id: "0catwmfljc",
                      }, ],
                    },
                    {
                      title: "Wireless Earbuds",
                      product_items: [{
                        product_retailer_id: "iz66q3jhrj",
                      }, ],
                    },
                    {
                      title: "Dummy",
                      product_items: [{
                        product_retailer_id: "c32q89qupk",
                      }, ],
                    },

                  ],
                },
              },
            },
          });
        } else if (msg_body.toLowerCase().includes("satwa")) {
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "interactive",
              interactive: {
                type: "product_list",
                header: {
                  type: "text",
                  text: "Hyke Store",
                },
                body: {
                  text: "Electronic Products and Accessories",
                },
                footer: {
                  text: "Cash on delivery",
                },
                action: {
                  catalog_id: "260917343538127",
                  sections: [{
                      title: "Smartwatches",
                      product_items: [{
                        product_retailer_id: "0catwmfljc",
                      }, ],
                    },
                    {
                      title: "Wireless Earbuds",
                      product_items: [{
                        product_retailer_id: "iz66q3jhrj",
                      }, ],
                    },
                    {
                      title: "Dummy",
                      product_items: [{
                        product_retailer_id: "c32q89qupk",
                      }, ],
                    },

                  ],
                },
              },
            },
          });
        } else if (msg_body.toLowerCase().includes("marina")) {
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "interactive",
              interactive: {
                type: "product_list",
                header: {
                  type: "text",
                  text: "Hyke Store",
                },
                body: {
                  text: "Electronic Products and Accessories",
                },
                footer: {
                  text: "Cash on delivery",
                },
                action: {
                  catalog_id: "260917343538127",
                  sections: [{
                    title: "Wireless Earbuds",
                    product_items: [{
                      product_retailer_id: "iz66q3jhrj",
                    }, ],
                  }, ],
                },
              },
            },
          });
        } else if (msg_body.toLowerCase().includes("jebal ali")) {
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
            data: {

              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "interactive",
              interactive: {
                type: "product_list",
                header: {
                  type: "text",
                  text: "Hyke Store",
                },
                body: {
                  text: "Electronic Products and Accessories",
                },
                footer: {
                  text: "Cash on delivery",
                },
                action: {
                  catalog_id: "260917343538127",
                  sections: [{
                      title: "Smartphones",
                      product_items: [{
                          product_retailer_id: "cfmdnndye8",
                        },
                        {
                          product_retailer_id: "z02pcbs4ku",
                        },
                      ],
                    },
                    {
                      title: "Dummy",
                      product_items: [{
                        product_retailer_id: "c32q89qupk",
                      }, ],
                    },

                  ],
                },
              },
            },
          });
        }
        // Example: Extract and store product details
        else if (
          sessions[phon_no_id] &&
          sessions[phon_no_id].prompt === "full_name"
        ) {
          // Store the received full name
          sessions[phon_no_id].storedName = msg_body;
          name = msg_body;
          // Greet the user with the stored name
          axios({
            method: "POST",
            url: "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "text",
              text: {
                body: "Hello " +
                  sessions[phon_no_id].storedName +
                  "! Welcome to Hyke Whatsapp Store, type 'shop' in order to choose between our Dubai or Sharjah collection of stock available.",
              },
              headers: {
                "Content-Type": "application/json",
              },
            },
          });
          // Update the session prompt
          sessions[phon_no_id].prompt = "none"; // No prompt needed
        }
      } else if (type == "order") {
        console.log("ENTERED THE ORDER CONDITION")
        const orderData = {
          phoneNumber: from,
          TotalCost: 0,
        };
        PseudoOrderID(orderData, from, body_param, phon_no_id, storedName);
      } else if (type == "interactive") {
        // interactive_body = body_param.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
        interactive_body =
          body_param.entry[0].changes[0].value.messages[0].interactive
          .button_reply.title;
      } else if (type == "location") {
        console.log("first one works");
        location_body = body_param.entry[0].changes[0].value.messages[0].location;
      }
      console.log("Customer Name" + storedName);
      console.log("phone number id" + phon_no_id);
      console.log("from " + from);
      console.log("body param " + msg_body);
      let string_user_message = JSON.stringify(msg_body).toLowerCase();
      let string_user_interactive =
        JSON.stringify(interactive_body).toLowerCase();
      if (string_user_message.includes("shop")) {
        axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "interactive",
            interactive: {
              type: "button",
              body: {
                text: "Choose which location is closer to your convenience",
              },
              action: {
                buttons: [{
                    type: "reply",
                    reply: {
                      id: "D",
                      title: "Dubai",
                    },
                  },
                  {
                    type: "reply",
                    reply: {
                      id: "S",
                      title: "Sharjah",
                    },
                  },
                ],
              },
            },
            headers: {
              "Content-Type": "application/json",
            },
          },
        });
      }
      if (string_user_interactive.includes("dubai")) {
        //messageListProducts("Dubai", phon_no_id, from, sessions, chosenLocation);
        axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: `These are the locations available for the Hyke store in Dubai \n1.)Deira\n2.)Marina\n3.)Satwa\n4.)Jebal Ali\nPlease type out one of these options to access our Stores`,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        sessions[phon_no_id].chosenLocation = "Dubai";
        chosenLocation = "Dubai";
      } else if (string_user_interactive.includes("sharjah")) {
        //messageListProducts("Sharjah", phon_no_id, from, sessions, chosenLocation);
        axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: `These are the locations available for the Hyke store in Sharjah \n1.)Al Khan\n2.)Al Majaz\n3.)Muhaisanah\n4.)Al Nahda\nPlease type out one of these options to access our Stores`,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        sessions[phon_no_id].chosenLocation = "Sharjah";
        chosenLocation = "Sharjah";
      } else if (string_user_interactive.includes("confirm")) {
        console.log(sessions[phon_no_id]);
        // Prepare the data to be sent
        let orderStatus = true;
        const customerData = {
          customerPhoneNumber: from,
          storedName: sessions[phon_no_id].storedName ? sessions[phon_no_id].storedName : name,
          chosenLocation: sessions[phon_no_id].chosenLocation,
          location_body: sessions[phon_no_id].location_body,
        };
        console.log(customerData);
        axios({
          // Send a response back to the customer
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "text",
            text: {
              body: "Thank you! we hope you shop with us again! Type 'latest order' to see your most recent order",
            },
            headers: {
              "Content-Type": "application/json",
            },
          },
        });

        updateOrderstatus(orderStatus, from);
        try {
          console.log("ATTEMPTING TO UPDAte CUSTOMER");
          axios
            .put(
              `https://whatsapp-store-962fd16a3e29.herokuapp.com/updatecustomerinfo/${from}`,
              customerData
            )
            .then((response) => {
              console.log("Customer information saved:", response.data.message);
            })
            .catch((error) => {
              console.error("Error saving customer information:", error);
            });
          console.log("COMPLETED UPDATE OF CUSTOMER");
        } catch (e) {
          console.log("ATTEMPTING TO SAVE CUSTOMER");
          axios.post(
              "https://whatsapp-store-962fd16a3e29.herokuapp.com/addcustomerinfo",
              customerData
            )
            .then((response) => {
              console.log("Customer information saved:", response.data.message);
            })
            .catch((error) => {
              console.error("Error saving customer information:", error);
            });
          console.log("saved customer");
        }
        //should change once want to maintain only single unique customer base


        // endSession(phon_no_id);

      } else if (string_user_interactive.includes("cancel")) {
        axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: `Got it!\n\nOrder has been cancelled!`,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (type == "location") {
        console.log("second one works");
        let location_body = body_param.entry[0].changes[0].value.messages[0].location;
        sessions[phon_no_id].location_body = location_body;

        axios({
          method: "POST",
          url: "https://graph.facebook.com/v17.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "interactive",
            interactive: {
              type: "button",
              body: {
                text: `\t\tLocation\nLatitude: ${location_body.latitude}\nLongitude: ${location_body.longitude}\nTotal Price:${finalCost}\nPress Confirm to place your order!!`,
              },
              action: {
                buttons: [{
                    type: "reply",
                    reply: {
                      id: "confirmation_of_order",
                      title: "Confirm",
                    },
                  },
                  {
                    type: "reply",
                    reply: {
                      id: "cancel",
                      title: "Cancel",
                    },
                  },
                ],
              },
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    }
  }
});
app.get("/getCustomerOrders/:customerPhone", (req, res) => {
  const customerPhoneNumber = req.params.customerPhone; // Get customerPhone from URL parameter
  console.log(`Inputted phone number is ${customerPhoneNumber}`);
  // Replace with your actual database query to retrieve all orders for the customer
  const query =
    "SELECT orderID, orderDetails, orderDate FROM Orders WHERE CustomerPhoneNumber = ?"; // Modify this query
  db.query(query, [customerPhoneNumber], async (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query error"
      });
    } else {
      if (results.length > 0) {
        const customerOrders = results.map((result) => ({
          orderID: result.orderID,
          orderDetails: result.orderDetails,
          orderDate: result.orderDate,
        }));
        console.log(
          `Found ${customerOrders.length} orders for ${customerPhoneNumber}`
        );
        res.json(customerOrders);
      } else {
        res.status(404).json({
          error: "Customer not found or has no orders"
        });
      }
    }
  });
});
app.get("/getLatestCustomerOrder/:customerPhone", (req, res) => {
  const customerPhoneNumber = req.params.customerPhone; // Get customerPhone from URL parameter
  console.log(`Inputted phone number is ${customerPhoneNumber}`);
  // Replace with your actual database query to retrieve the latest order number
  const query =
    "SELECT MAX(orderID) AS latestOrder FROM Orders WHERE CustomerPhoneNumber = ?"; // Modify this query
  db.query(query, [customerPhoneNumber], async (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query error"
      });
    } else {
      if (results.length > 0 && results[0].latestOrder !== null) {
        const latestOrderNumber = results[0].latestOrder;
        console.log(
          `Latest order number for ${customerPhoneNumber} is ${latestOrderNumber}`
        );
        res.json({
          latestOrder: latestOrderNumber
        });
      } else {
        res.status(404).json({
          error: "Customer not found or has no orders"
        });
      }
    }
  });
});
app.get("/getcustomerinfo/:customerPhone", (req, res) => {
  const customerPhoneNumber = req.params.customerPhone; // Get methodName from URL parameter
  console.log(`inputted number is ${customerPhoneNumber}`);
  // Replace with your actual database query to retrieve method details
  const query =
    "SELECT CustomerPhoneNumber, CustomerName, chosenLocation, Location FROM Info WHERE CustomerPhoneNumber = ?"; // Modify this query
  db.query(query, [customerPhoneNumber], async (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query error"
      });
    } else {
      if (results.length > 0) {
        const phoneNumberArray = results.map((result) => ({
          CustomerPhoneNumber: result.CustomerPhoneNumber,
          CustomerName: result.CustomerName,
          chosenLocation: result.chosenLocation,
          Location: result.Location,
          // Add more queries or processing as needed
        }));
        console.log(phoneNumberArray);
        res.json(phoneNumberArray);
      } else {
        res.status(404).json({
          error: "NUMBER not found"
        });
      }
    }
  });
});
async function messageListProducts(
  city,
  phon_no_id,
  from,
  sessions,
  chosenLocation
) {
  axios
    .get(`https://whatsapp-store-962fd16a3e29.herokuapp.com/getAllProducts`)
    .then((response) => {
      // Handle the response data (list of products)
      const products = response.data;
      console.log(products, "HERE ARE THE LIST OF PRODUCTS!!!");
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
  //make a formatted string with products amd prices
  //in the format 'These are the products availale in our ${city} store:\n\nPrice:\n\nTo confirm your Cash-On-Delivery purchase, please send your delivery location'
  let finalString = `These are the products available in our ${city} store:\n`;
  for (let i = 0; i < products.length; i++) {
    console.log(finalString);
    finalString =
      finalString +
      `${i}) ${products[i].productName} - ${products[i].productPrice} AED\n`;
  }
  finalString += `\n\nTo confirm your Cash-On-Delivery purchase, please send your delivery location`;
  axios({
    method: "POST",
    url: "https://graph.facebook.com/v17.0/" +
      phon_no_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: finalString,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  sessions[phon_no_id].chosenLocation = chosenLocation;
  chosenLocation = chosenLocation;
}

async function updateOrderstatus(orderStatus, from) {
  let orderId;
  await axios
    .get(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/getLatestCustomerOrder/${from}`
    )
    .then((response) => {
      // Handle the response data (latest order number)
      orderId = response.data.latestOrder;
      console.log(`Latest order ID for ${from} is ${orderId}`);
      // You can use the orderId variable here or within this block
    })
    .catch((error) => {
      // Handle errors (e.g., customer not found)
      console.error(error);
    });

  const orderStatusData = {
    orderId: orderId,
    orderStatus: orderStatus
  }

  console.log("post call", orderId);

  await axios.post(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/orderStatus`,
      orderStatusData
    )
    .then((response) => {
      // Handle the success response
      console.log(response.data);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}

async function updateOrderItems(orderItemData, orderId, totalCost) {
  await axios.post(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/addOrderItem`,
      orderItemData
    )
    .then((response) => {
      // Handle the success response
      console.log(response.data);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
}
async function PseudoOrderID(
  orderData,
  from,
  body_param,
  phon_no_id,
  storedName
) {
  console.log("yes order exists");
  const order = body_param.entry[0].changes[0].value.messages[0].order;
  const catalogId = body_param.entry[0].changes[0].value.messages[0].order.catalog_id;
  const productItems = body_param.entry[0].changes[0].value.messages[0].order.product_items;
  await axios
    .post(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/addOrder`,
      orderData
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  let orderId;
  await axios
    .get(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/getLatestCustomerOrder/${from}`
    )
    .then((response) => {
      // Handle the response data (latest order number)
      orderId = response.data.latestOrder;
      console.log(`Latest order ID for ${from} is ${orderId}`);
      // You can use the orderId variable here or within this block
    })
    .catch((error) => {
      // Handle errors (e.g., customer not found)
      console.error(error);
    });
  console.log("order id is " + orderId);
  console.log("order id is " + orderId);
  console.log("order id is " + orderId);
  let totalCost = 0;
  if (!orderDetails[phon_no_id]) {
    orderDetails[phon_no_id] = [];
  }
  var orderItemData = {};
  productItems.forEach((item) => {
    const productRetailerId = item.product_retailer_id;
    const quantity = item.quantity;
    const itemPrice = item.item_price;
    console.log(item.item_price, typeof item.item_price);
    const currency = item.currency;
    orderItemData = {
      orderID: orderId,
      productRetailerId: productRetailerId,
      quantity: quantity,
    };
    totalCost += item.item_price * item.quantity;
    console.log("total cost is " + totalCost);
    updateOrderItems(orderItemData, orderId, totalCost);
    finalCost = totalCost;
    // Create an object to represent the order item
    const orderItem = {
      productRetailerId: orderItemData.productRetailerId,
      quantity: orderItemData.quantity,
      itemPrice: item.item_price,
      currency,
    };
    // Add the order item to the order details for this session
    orderDetails[phon_no_id].push(orderItem);
  });
  console.log("ATTEMPTING TO UPDATE ORDER")
  axios
    .put(
      `https://whatsapp-store-962fd16a3e29.herokuapp.com/updateOrder/${orderId}`, {
        totalCost
      }
    )
    .then((response) => {
      // Handle the success response
      console.log(response.data);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
  // Construct a confirmation message
  let confirmationMessage = "Order Confirmation:\n";
  orderDetails[phon_no_id].forEach((item, index) => {
    confirmationMessage += `Phone number ${from}\n`;
    confirmationMessage += `Product ${index + 1}:\n`;
    if (item.productRetailerId == "iz66q3jhrj") {
      confirmationMessage += `Product Name: MyCandy EarBuds\n`;
    } else if (item.productRetailerId == "cfmdnndye8") {
      confirmationMessage += `Product Name: Samsung Galaxy S21\n`;
    } else if (item.productRetailerId == "z02pcbs4ku") {
      confirmationMessage += `Product Name: iPhone 11\n`;
    } else if (item.productRetailerId == "0catwmfljc") {
      confirmationMessage += `Product Name: Smartwatch\n`;
    }
    confirmationMessage += `Product ID: ${item.productRetailerId}\n`;
    confirmationMessage += `Quantity: ${item.quantity}\n`;
    confirmationMessage += `Price: ${item.itemPrice} ${item.currency}\n\n`;
  });
  confirmationMessage +=
    "Please send your location to confirm your cash on delivery order!";
  // Send the confirmation message to the customer
  axios({
    method: "POST",
    url: "https://graph.facebook.com/v17.0/" +
      phon_no_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "text",
      text: {
        body: confirmationMessage,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
  // Log the order details (you can also save them to your database if needed)
  console.log("Order Details:", orderDetails[phon_no_id]);
}
async function processMessage(
  msg_body,
  phon_no_id,
  customerPhoneNumber,
  sessions,
  from
) {
  if (
    msg_body.toLowerCase().includes("hi") ||
    msg_body.toLowerCase().includes("hello") ||
    msg_body.toLowerCase().includes("hey")
  ) {
    // Prompt the customer for first and last name
    let customer = {};
    customer_exists = false;
    console.log("THE PHONE NUMBER IS ", from);
    const getPhoneNumber = async () => {
      try {
        const response = await fetch(
          `https://whatsapp-store-962fd16a3e29.herokuapp.com/getcustomerinfo/${from}`
        );
        if (response.ok) {
          const data = await response.json();
          customer = data;
          customer_exists = true;
        } else {
          addcustomerinfo
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        customer_exists = false;
      }
    };
    // Call the async function and wait for it to complete
    await getPhoneNumber();
    if (!customer_exists) {
      const customerData = {
        customerPhoneNumber: from,
        storedName: null,
        chosenLocation: null,
        location_body: null,
      };
      console.log("creating a new base model customer");
      axios.post(
          "https://whatsapp-store-962fd16a3e29.herokuapp.com/addcustomerinfo",
          customerData
        )
        .then((response) => {
          console.log("Customer information saved:", response.data.message);
        })
        .catch((error) => {
          console.error("Error saving customer information:", error);
        });
      axios({
        method: "POST",
        url: "https://graph.facebook.com/v17.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "text",
          text: {
            body: "Hello! " + customerPhoneNumber + " Please type your full name?",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      startSession(phon_no_id, from);
      sessions[phon_no_id].prompt = "full_name";
      sessions[phon_no_id].storedName = null;
      sessions[phon_no_id].location_body = null;
    } else {
      axios({
        method: "POST",
        url: "https://graph.facebook.com/v17.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "text",
          text: {
            body: `Hello ${customer[0].CustomerName}!! It's been a while! \nWelcome to Hyke Whatsapp Store, type 'shop' in order to choose between our Dubai or Sharjah collection of stock available.`,
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      startSession(phon_no_id, from);
      sessions[phon_no_id].prompt = "none";
      sessions[phon_no_id].storedName = customer[0].CustomerName;
      name = customer[0].CustomerName;
      sessions[phon_no_id].location_body = customer[0].Location;
      return customer[0];
    }
  }
}
// Route to handle storing customer information in the database
app.post("/addcustomerinfo", async (req, res) => {
  //saving customer information
  try {
    const {
      customerPhoneNumber,
      storedName,
      chosenLocation,
      location_body
    } =
    req.body;
    console.log("dis works", chosenLocation);
    console.log("dis works", location_body);
    let location_body2 = {};
    let messed_up = false;
    if (!location_body) {
      messed_up = true;
      location_body2 = {
        lattitude: 0,
        longitude: 0
      }
    }
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Insert customer data into the 'customers' table [change this with new database]
    const customerQuery =
      "INSERT INTO Info (CustomerPhoneNumber, CustomerName, chosenLocation, Location) VALUES ( ?, ?, ?, ?)";
    await db.query(customerQuery, [
      customerPhoneNumber,
      storedName,
      chosenLocation,
      String(messed_up ? location_body2.latitude : location_body.latitude) + "," + messed_up ? location_body2.longitude : location_body.longitude,
    ]);
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "Customer information saved successfully"
    });
    //error handling logic
  } catch (error) {
    console.error("Error saving customer information:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error saving customer information"
    });
  }
});
app.put("/updatecustomerinfo/:customerPhoneNumber", async (req, res) => {
  // Get the customerPhoneNumber from the URL parameter
  const customerPhoneNumber = req.params.customerPhoneNumber;
  try {
    const {
      storedName,
      chosenLocation,
      location_body
    } = req.body;
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Update customer data in the 'Info' table
    const updateQuery =
      "UPDATE Info SET CustomerName = ?, chosenLocation = ?, Location = ? WHERE CustomerPhoneNumber = ?";
    await db.query(updateQuery, [
      storedName,
      chosenLocation,
      String(location_body.latitude) + "," + location_body.longitude,
      customerPhoneNumber,
    ]);
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "Customer information updated successfully"
    });
    // Error handling logic can be added here if needed
  } catch (error) {
    console.error("Error updating customer information:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error updating customer information"
    });
  }
});
app.post("/orderStatus", async (req, res) => {
  //saving customer information
  try {
    const {
      orderId,
      orderStatus
    } = req.body;
    // Start a transaction
    console.log("orderID", orderId);
    console.log("order status", orderStatus);
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Insert product data into the 'Products' table
    const productQuery =
      "UPDATE Orders SET status = ? WHERE OrderID = ?";
    await db.query(productQuery, [orderStatus, orderId]);

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "STATUS information saved successfully"
    });
    //error handling logic
  } catch (error) {
    console.error("Error saving customer information:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error saving customer information"
    });
  }
});
app.post("/addOrder", async (req, res) => {
  //saving customer information
  try {
    const {
      phoneNumber,
      TotalCost
    } = req.body;
    let Statusplaceholder = false;
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Insert product data into the 'Products' table
    const productQuery =
      "INSERT INTO Orders(CustomerPhoneNumber, TotalCost, status) VALUES (?, ?, ?)";
    await db.query(productQuery, [phoneNumber, TotalCost, Statusplaceholder]);
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "Product information saved successfully"
    });
    //error handling logic
  } catch (error) {
    console.error("Error saving customer information:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error saving customer information"
    });
  }
});
app.get("/getAllProducts", (req, res) => {
  // Replace with your actual database query to retrieve all products
  const query = "SELECT * FROM Products"; // Modify this query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query error"
      });
    } else {
      if (results.length > 0) {
        const products = results.map((result) => ({
          ProductRetailerID: result.ProductRetailerID,
          ProductName: result.ProductName,
          ProductPrice: result.ProductPrice,
        }));
        console.log(`Found ${products.length} products`);
        res.json(products);
      } else {
        res.status(404).json({
          error: "No products found"
        });
      }
    }
  });
});
app.put("/updateOrder/:orderID", async (req, res) => {
  const orderID = req.params.orderID; // Get the orderID from the URL parameter
  const newTotalCost = req.body.totalCost; // Get the new total cost from the request body
  console.log("NEW TOTAL COST IN UPDATE ORDER IS " + newTotalCost);
  try {
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Update the order with the new total cost
    const updateQuery = "UPDATE Orders SET TotalCost = ? WHERE orderID = ?";
    await db.query(updateQuery, [newTotalCost, orderID]);
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "Order updated successfully"
    });
  } catch (error) {
    console.error("Error updating order:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error updating order"
    });
  }
});
app.get("/getOrderItemsByOrder/:orderID", (req, res) => {
  // Get the orderID from the URL parameter
  const orderID = req.params.orderID;
  // Replace with your actual database query to retrieve OrderItems by orderID
  const query = "SELECT * FROM OrderItems WHERE OrderID = ?"; // Modify this query
  db.query(query, [orderID], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({
        error: "Database query error"
      });
    } else {
      if (results.length > 0) {
        const orderItems = results.map((result) => ({
          OrderID: result.OrderID,
          ProductRetailerID: result.ProductRetailerID,
          Quantity: result.Quantity,
        }));
        console.log(`Found ${orderItems.length} OrderItems for orderID ${orderID}`);
        res.json(orderItems);
      } else {
        res.status(404).json({
          error: "No OrderItems found for the specified orderID"
        });
      }
    }
  });
});
app.post("/addOrderItem", async (req, res) => {
  //saving customer information
  try {
    const {
      orderID,
      productRetailerId,
      quantity
    } = req.body;
    console.log("this da orderid", orderID);
    // Start a transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    // Insert product data into the 'Products' table
    const productQuery =
      "INSERT INTO OrderItems (OrderID, ProductRetailerID, Quantity) VALUES (?, ?, ?)";
    await db.query(productQuery, [orderID, productRetailerId, quantity]);
    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({
      message: "Product information saved successfully"
    });
    //error handling logic
  } catch (error) {
    console.error("Error saving customer information:", error);
    // Rollback the transaction in case of an error
    await new Promise((resolve) => db.rollback(() => resolve()));
    res.status(500).json({
      error: "Error saving customer information"
    });
  }
});
// Default route to indicate that the server is running
app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});