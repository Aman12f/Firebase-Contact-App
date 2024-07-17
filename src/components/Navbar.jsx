import React from "react";
import "./Navbar.css";
import logos_firebase from "./images/logos_firebase.svg";
import { FaCirclePlus } from "react-icons/fa6";
import { useRef } from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db } from "../config/firebase";
import { collection,addDoc} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = (props) => {

  const {getContacts,setContacts,allContacts} = props;
  const ref = useRef(null);
  const closeRef = useRef(null)
   
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnClick = () =>{
    ref.current.click();
  }
  const handleOnClickAdd = ()=>{
    if(validateInputs())
    {
      closeRef.current.click()
      console.log(modalobj);
      addContact(modalobj);
      getContacts();
    }
    setmodalobj({name:"",email:""});
    
  }
  
  const [modalobj, setmodalobj] = useState({name:"",email:""})
  const handleOnChangeInput = (e)=>{
     setmodalobj({...modalobj,[e.target.name]:e.target.value});
  }

  const addContact = async(contact)=>{
   try {
      const contactRef = collection(db,"contacts")
      await addDoc(contactRef,contact)
      toast.success("Contact added successfully")
   } catch (error) {
     console.log(error);
   }
  }
  const filterContacts = (e)=>{
      const value = e.target.value.toLowerCase();
      if(value===""){
        setContacts(allContacts)
      }
      else{
        const filteredContacts = allContacts.filter((contact)=>contact.name.toLowerCase().includes(value))
        setContacts(filteredContacts)
      }
  };
  const validateInputs = () => {
    let isValid = true;
    const errors = {};

    if (!modalobj.name || modalobj.name.length < 2) {
      errors.name = "name must be at least 2 characters long";
      isValid = false;
    }

    if (!modalobj.email || !isValidEmail(modalobj.email)) {
      errors.email = "invalid email format";
      isValid = false;
    }

    setErrors(errors);
    if(!isValid) {
      console.log(errors);
    }
    return isValid;
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  return (
    <>
    
    {/* MODAL START  */}
    <Button variant="primary" onClick={handleShow} ref={ref} style={{display:"none"}}>
        Launch static backdrop modal
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Enter Name</label>
    <input type="name" className="form-control" id="name" aria-describedby="emailHelp" placeholder="Enter Name" name="name" value={modalobj.name} onChange={handleOnChangeInput}></input>
    <div style={{color:"red"}}><small>{errors.name?errors.name:""}</small></div>
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name="email" value={modalobj.email} onChange={handleOnChangeInput}></input>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
    <div style={{color:"red"}}><small>{errors.email?errors.email:""}</small></div>
  </div>
</form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} ref={closeRef}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOnClickAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    {/* MODAL END  */}

      <div className="main d-flex flex-column">
          <div className="c1 d-flex justify-content-center mt-4">
            <div className="c11 mr-1">
            <img src={logos_firebase} alt="" />
            </div>
            <div className="c12 text-xl font-bold" style={{fontSize:"28px"}}>
              Firebase Contact App
            </div>
          </div>
          <div className="c2 align-self-center mt-5">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="search contact"
              onChange={filterContacts}
            ></input>
            <button type="button" className="btn btn-dark" onClick={handleOnClick}>
            <FaCirclePlus className="plus"/>
            </button>
          </div>
          </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
