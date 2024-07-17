import React, { useImperativeHandle } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { forwardRef } from 'react';
import { useEffect } from 'react';
import { doc,updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Modal1 = (props,ref) => {
    
     const closeRef = useRef(null)
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useImperativeHandle(
      ref,
      () => {
        return {
            open:()=>handleShow(),
            // close:()=>handleClose()
        }
      },
    )
    const [modalobj, setmodalobj] = useState({id:"",name:"",email:""})
    const handleOnChangeInput = (e)=>{  
       setmodalobj({...modalobj,[e.target.name]:e.target.value});
    }
    useEffect(() => {
      console.log("modal obj is inside modal1 is  ",props.obj);
       setmodalobj({
        id:props.obj.id,
        name:props.obj.name,
        email:props.obj.email
       })
       console.log(modalobj);
    }, [props.obj])
    
    const handleOnClickUpdate = async (id) => {
    try {
      const docRef = doc(db, "contacts", id);
      await updateDoc(docRef, {
        name: modalobj.name,
        email: modalobj.email,
      });
      setmodalobj({ id: "", name: "", email: "" });
      handleClose();
      toast.success("Contact updated successfully")

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{display:"none"}}>
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
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name="email" value={modalobj.email} onChange={handleOnChangeInput}></input>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
</form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} ref={closeRef}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>handleOnClickUpdate(modalobj.id)}>Update</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default forwardRef(Modal1)
