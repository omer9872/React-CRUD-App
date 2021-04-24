const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const {
  login,
  register,
  insertProducts,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct
} = require('./DBHelper');
require('dotenv').config();

const privateKey = fs.readFileSync('private.key');
const publicKey = fs.readFileSync('public.pem');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

const validateToken = (req, res, next) => {
  const { t } = req.headers;
  if (t) {
    var token = t.split(" ")[1];
    if (token) {
      jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(200).json({ result: err.message });
        } else {
          next();
        }
      });
    } else {
      res.status(200).json({ result: "unauthorized" });
    }
  } else {
    res.status(200).json({ result: "unauthorized" });
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    login(username, password)
      .then(result => {
        if (result) {
          jwt.sign({ username: username }, privateKey, { expiresIn: "10m", algorithm: "RS256" }, function (err, token) {
            if (err) {
              res.status(200).json({ result: "login unsuccessful", token: "null" })
            } else {
              res.status(200).json({ result: "login successfully", token: token });
            }
          });
        } else {
          console.log("user not found");
          res.status(200).json({ result: "user not found" })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json({ result: "error occured" })
      })
  } else {
    console.log("invalid user");
    res.status(200).json({ result: "invalid user" })
  }
});
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    register(username, password)
      .then(result => {
        if (result) {
          console.log(result);
          res.status(200).json({ result: "register successfully" })
        } else {
          console.log("register unsuccessful");
          res.status(200).json({ result: "register unsuccessful" })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json({ result: "error occured" })
      })
  } else {
    console.log("invalid user");
    res.status(200).json({ result: "invalid user" })
  }
});
app.get('/getproducts', validateToken, (req, res) => {
  getProducts()
    .then(results => {
      res.status(200).json({ result: "fetch successfully", products: results })
    })
    .catch(err => {
      res.status(200).json({ result: err.message, products: results })
    });
});
app.get('/getproduct', validateToken, (req, res) => {
  const { id } = req.query;
  if (id) {
    getProductById(id)
      .then(product => {
        if (product) {
          res.status(200).json({ result: "fetching successfully", product: product });
        }
        else {
          console.log("error while fetching product");
          res.status(200).json({ result: "error while fetching product" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json({ result: "error while fetching product" });
      })
  } else {
    console.log("invalid product");
    res.status(200).json({ result: "invalid product" });
  }
});
app.post('/deleteproduct', validateToken, (req, res) => {
  const { id } = req.body;
  if (id) {
    deleteProduct(id)
      .then(result => {
        if (result) {
          res.status(200).json({ result: "deleted successfully" });
        }
        else {
          console.log("invalid product");
          res.status(200).json({ result: "error while deleting product" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json({ result: "error while deleting product" });
      })
  } else {
    console.log("invalid product");
    res.status(200).json({ result: "invalid product" });
  }
});
app.post('/insertproduct', validateToken, async (req, res) => {
  const { title, details, photo } = req.body;
  var photoType = await getPhotoType(photo);
  if (photoType) {
    var delStr = `data:image\/${photoType};base64,`;
    var base64Data = photo.replace(delStr, "");
    var photoName = uuidv4();
    fs.writeFile(`photos/${photoName}.${photoType}`, base64Data, 'base64', function (err) {
      if (err) {
        res.status(200).json({ result: "error occured while photo processing" });
      } else {
        insertProducts(title, details, photoName + "." + photoType)
          .then(_ => {
            res.status(200).json({ result: "product inserted successfully" });
          })
          .catch(err => {
            res.status(200).json({ result: "error occured while insert product" });
          });
      }
    });
  } else {
    res.status(200).json({ result: "error occured while photo processing" });
  }
});
app.post('/updateproduct', validateToken, async (req, res) => {
  const { id, title, details } = req.body;
  if (title && details) {
    updateProduct(id, title, details)
      .then(_ => {
        res.status(200).json({ result: "product updated successfully" });
      })
      .catch(err => {
        res.status(200).json({ result: "error occured while updated product" });
      });
  } else {
    console.log("invalid product");
    res.status(200).json({ result: "invalid product" });
  }
});
app.get('/getproductphoto', (req, res) => {
  const { photoname } = req.query;
  res.sendFile(path.join(__dirname, `photos/${photoname}`));
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("App is running on Port:", process.env.SERVER_PORT);
})

const getPhotoType = (b64) => {
  return new Promise((resolve, reject) => {
    try {
      var imageType = b64.split(",")[0].split("/")[1].split(";")[0];
      return resolve(imageType);
    } catch {
      return resolve(null);
    }
  });
}