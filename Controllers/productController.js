import firebase from "../firebase.js";
import Product from "../Models/productModel.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const db = getFirestore(firebase);

export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, 'products'), data);
    res.status(200).send('Product created successfully');
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await getDocs(collection(db, 'products'));
    const productArray = [];
    if (products.empty) {
      res.status(400).send('Products not found');
    } else {
      products.forEach(doc => {
        const product = new Product(
          doc.id,
          doc.data().name,
          doc.data().price,
          doc.data().retailer,
          doc.data().amountInStock
        );
        productArray.push(product);
      });
      res.status(200).send(productArray);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = doc(db, 'products', id);
    const data = await getDoc(product);
    if (product.exists()) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send('Product not found');
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = doc(db, 'products', id);
    await updateDoc(product, data);
    res.status(200).send('product updated successfully');
  } catch (e) {
    res.staus(400).send(e.message);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, 'products', id));
    res.status(200).send('Product deleted successfully');
  } catch (e) {
    res.status(400).send(e.message);
  }
};