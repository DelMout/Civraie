require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers
const sharp = require("sharp"); // Reduction image

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const producerRoutes = require("./routes/producer");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const infoRoutes = require("./routes/information");

// Models
const { user } = require("./models");
const { product } = require("./models");
const { producer } = require("./models");
const { category } = require("./models");
const { order } = require("./models");
const { information } = require("./models");

//association tables user/order et product/order
order.belongsTo(user);
module.exports = { user, order };
order.belongsTo(product);
module.exports = { product, order };

//association tables producer/product et category/product
product.belongsTo(producer);
module.exports = { producer, product };
product.belongsTo(category);
module.exports = { category, product };

app.use(cors()); // Security CORS
app.use(bodyParser.json());
app.use(helmet());

// **** ROUTES ****

//  * User
app.use("/api/user", userRoutes);

// * Product
app.use("/api/product", productRoutes);

// * Producer
app.use("/api/producer", producerRoutes);

// * Category
app.use("/api/category", categoryRoutes);

// * Order
app.use("/api/order", orderRoutes);

// * Information
app.use("/api/information", infoRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
