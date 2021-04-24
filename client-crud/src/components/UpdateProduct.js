import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles/products.css';
import { API_URL } from '../config';
import auth from "../auth";
import none from './none.png'

export default function UpdateProduct(props) {
  let history = useHistory();
  const [id] = useState(history.location.search.split("=")[1]);
  const [photo, setPhoto] = useState("");
  const [title, setTitle] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/getproduct?id=${id}`, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(response => {
        if (response.status === 200) {
          // then parse data...
          if (response.data.result === "jwt expired") {
            auth.logout();
            history.push("/login");
          } else {
            if (response.data.product) {
              setTitle(response.data.product.title);
              setDetails(response.data.product.details);
              setPhoto(response.data.product.photo_name);
            } else {
              // something went wrong...
              //setProducts([]);
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

  const updateProduct = () => {
    var productDatas = {
      id: id,
      title: title,
      details: details
    };
    axios.post(`${API_URL}/updateproduct`, productDatas, { headers: { "t": `Bareer ${auth.getToken()}` } })
      .then(result => {
        console.log(result.data);
        if (result.status === 200) {
          history.push("/products");
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

  return (
    <div className="p-container">
      <div className="p-insertform">
        <img className="p-image" src={photo ? "http://localhost:4000/getproductphoto?photoname=" + photo : ""}></img>
        <input onChange={(e) => { setTitle(e.target.value) }} value={title || ""} className="p-inputstyle low-shadow" type="text" placeholder="Title" />
        <textarea onChange={(e) => { setDetails(e.target.value) }} value={details || ""} className="p-inputstyle-textarea low-shadow" rows={4} placeholder="Details" />
        <button onClick={() => { updateProduct() }} className="p-buttonstyle">Update Product</button>
      </div>
    </div>
  );
}