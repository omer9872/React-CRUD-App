import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles/products.css';
import { API_URL } from '../config';
import auth from "../auth";
import none from './none.png'

export default function Products() {
  let history = useHistory();
  const [products, setProducts] = useState([]);
  const [photo, setPhoto] = useState(none);
  const [photoB64, setPhotoB64] = useState("");
  const [title, setTitle] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/getproducts`, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(response => {
        if (response.status === 200) {
          // then parse data...
          if (response.data.result === "jwt expired") {
            auth.logout();
            history.push("/login");
          } else {
            if (response.data.products) {
              setProducts(response.data.products);
            } else {
              // something went wrong...
              setProducts([]);
            }
          }
        } else {
          // something went wrong...
          console.log("something went wrong...");
        }
      })
      .catch(err => {
        // something went wrong...
        console.log(err);
      });
  }, []);

  const redirectToUpdate = (id) => {
    history.push(`products/update?id=${id}`);
  }

  const pickPhoto = (e) => {
    setPhoto(URL.createObjectURL(e.target.files[0]));
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setPhotoB64(reader.result);
    }
    reader.readAsDataURL(file);
  }

  const addProduct = () => {
    var productDatas = {
      title: title,
      details: details,
      photo: photoB64
    };
    axios.post(`${API_URL}/insertproduct`, productDatas, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(result => {
        if (result.status === 200) {
          setTitle("");
          setDetails("");
          setPhoto(none);
          setPhotoB64("");
          refreshPage();
        } else {
          // something went wrong...
          console.log(result.result);
        }
      })
      .catch(err => {
        // something went wrong...
        console.log(err);
      });
  }

  const deleteProduct = (id) => {
    var productDatas = {
      id: id,
    };
    axios.post(`${API_URL}/deleteproduct`, productDatas, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(result => {
        if (result.status === 200) {
          refreshPage();
        } else {
          // something went wrong...
          console.log(result.result);
        }
      })
      .catch(err => {
        // something went wrong...
        console.log(err);
      });
  }

  const refreshPage = () => {
    axios.get(`${API_URL}/getproducts`, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(response => {
        if (response.status === 200) {
          // then parse data...
          if (response.data.result === "jwt expired") {
            auth.logout();
            history.push("/login");
          } else {
            if (response.data.products) {
              setProducts(response.data.products);
            } else {
              // something went wrong...
              setProducts([]);
            }
          }
        } else {
          // something went wrong...
          console.log("something went wrong...");
        }
      })
      .catch(err => {
        // something went wrong...
        console.log(err);
      });
  }

  return (
    <div className="p-container">
      <div className="p-insertform">
        <img className="p-image" src={photo || ""}></img>
        <input className="p-image-selector" type="file" onChange={(e) => { pickPhoto(e) }} />
        <input onChange={(e) => { setTitle(e.target.value) }} value={title || ""} className="p-inputstyle low-shadow" type="text" placeholder="Title" />
        <textarea onChange={(e) => { setDetails(e.target.value) }} value={details || ""} className="p-inputstyle-textarea low-shadow" rows={4} placeholder="Details" />
        <button onClick={() => { addProduct() }} className="p-buttonstyle">Add Product</button>
      </div>
      <div className="p-product-container">
        {products.length > 0
          ? products.map((product, index) => {
            return <div key={index} className="p-product-card">
              <img src={"http://localhost:4000/getproductphoto?photoname=" + product.photo_name}></img>
              <p style={{ margin: "4px 10px" }}>{product.title}</p>
              <p style={{ margin: "10px 10px" }}>{product.details}</p>
              <button onClick={() => { redirectToUpdate(product.id) }} className="btn-update">Update Product</button>
              <button onClick={() => { deleteProduct(product.id) }} className="btn-delete">Delete Product</button>
            </div>
          })
          : <p>There are not any product yet !</p>}
      </div>
    </div>
  );
}