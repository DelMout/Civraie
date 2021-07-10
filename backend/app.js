require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers

const userRoutes = require("./routes/user");
// const productRoutes = require("./routes/product");
const producerRoutes = require("./routes/producer");
// const orderRoutes = require("./routes/order");
// const dateRoutes = require("./routes/date");

// Models
const { user } = require("./models");
const { product } = require("./models");
const { producer } = require("./models");
const { order } = require("./models");
const { date } = require("./models");

//association tables user/order et product/order
order.belongsTo(user);
module.exports = { user, order };
order.belongsTo(product);
module.exports = { product, order };

//association tables producer/product
product.belongsTo(producer);
module.exports = { producer, product };

//association tables date/order
product.belongsTo(date);
module.exports = { date, order };

app.use(cors()); // Security CORS
app.use(bodyParser.json());
app.use(helmet());

// **** ROUTES ****

//  * User
app.use("/api/user", userRoutes);

// * Product
// app.use("/api/product", productRoutes);

// * Producer
app.use("/api/producer", producerRoutes);

// // * Order
// app.use("/api/order", orderRoutes);

// // * Date
// app.use("/api/date", dateRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
