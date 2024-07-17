import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Modal1 from "./components/Modal1";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { query, orderBy, limit, startAfter, startAt } from 'firebase/firestore';

const App = () => {
  const useImperativeRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [modalobj, setModalObj] = useState({ id: "", name: "", email: "" });
  const [itemStyle, setItemStyle] = useState({ width: "40%", marginTop: "10px" });
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 530);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageSnapshots, setPageSnapshots] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 350) {
        setItemStyle({ width: "95%", marginTop: "10px" });
      } else if (window.innerWidth <= 1020) {
        setItemStyle({ width: "80%", marginTop: "10px" });
      } else {
        setItemStyle({ width: "40%", marginTop: "10px" });
      }
      setIsSmallScreen(window.innerWidth <= 530);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getContacts = async (page, direction) => {
    try {
      const contactsRef = collection(db, "contacts");
      let q;

      if (page === 1) {
        q = query(contactsRef, orderBy("name"), limit(itemsPerPage));
      } else {
        let pageSnapshotItem;
        if (direction === 'next') {
          pageSnapshotItem = lastVisible;
        } else if (direction === 'prev') {
          pageSnapshotItem = pageSnapshots[page-1]?.first;
          console.log("pagesnapshop item is ",pageSnapshotItem);
        }

        q = query(
          contactsRef,
          orderBy("name"),
          direction === 'next' ? startAfter(pageSnapshotItem) : startAt(pageSnapshotItem),
          limit(itemsPerPage)
        );
      }

      const snapshot = await getDocs(q);

      const contactLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setContacts(contactLists);
      setAllContacts(contactLists)

      if (snapshot.docs.length > 0) {
        setFirstVisible(snapshot.docs[0]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

        const newPageSnapshots = [...pageSnapshots];
        newPageSnapshots[page - 1] = {
          first: snapshot.docs[0],
          last: snapshot.docs[snapshot.docs.length - 1]
        };
        setPageSnapshots(newPageSnapshots);
        console.log("pagesnapshots is ",newPageSnapshots);
        console.log("contact length is ",contactLists.length);
        console.log("contact list is ",contactLists);
      }
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    }
  };

  useEffect(() => {
      getContacts(currentPage, 'next');
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnClickEdit = (obj) => {
    setModalObj(obj);
    useImperativeRef.current.open();
  };

  const handlePageChange = (page, direction) => {
    if (page > 0) {
      setCurrentPage(page);
      getContacts(page, direction);
    }
  };

  return (
    <>
      <Modal1 ref={useImperativeRef} obj={modalobj}></Modal1>
      <div className="d-flex flex-column">
        <Navbar getContacts={getContacts} setContacts={setContacts} allContacts={allContacts} />
        <div className="items align-self-center" style={itemStyle}>
          {contacts.map((contact) => (
            <div key={contact.id} className={`p d-flex ${isSmallScreen ? "flex-column" : ""} ${isSmallScreen ? "align-items-center" : ""} justify-content-between border border-dark`} style={{ marginTop: "10px", background: "#FFEAAE", borderRadius: "10px", padding: "7px", width: "100%" }}>
              <div className="d-flex">
                <div className="c1" style={{ marginRight: "10px" }}>
                  <HiOutlineUserCircle style={{ width: "45px", height: "45px", marginTop: "3px", color: "orange" }} />
                </div>
                <div className={`d-flex flex-column ${isSmallScreen ? "flex-column-when-small" : ""}`}>
                  <div className="c2" style={{ width: "100%" }}><p>{contact.name}</p></div>
                  <div className="c3">{contact.email}</div>
                </div>
              </div>
              <div className="d-flex" style={{ marginTop: "3px" }}>
                <div className="c4 mr-1"><FaRegEdit style={{ width: "30px", height: "30px", marginTop: "5px" }} onClick={() => handleOnClickEdit({
                  id: contact.id,
                  name: contact.name,
                  email: contact.email
                })} /></div>
                <div className="c5 ml-1">
                  <MdDelete style={{ width: "30px", height: "30px", marginTop: "5px", color: "blue", marginRight: "10px" }} onClick={() => handleDelete(contact.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-controls align-self-center mt-5 d-flex align-items-center justify-content-center">
          <button 
            onClick={() => handlePageChange(currentPage - 1, 'prev')} 
            disabled={currentPage === 1} 
            type="button" 
            className="btn btn-primary mr-2"
          >
            Previous
          </button>
          <span className="page-number" style={{ border: "2px solid black", padding: "5px 15px", borderRadius: "5px", margin: "0 10px" }}>
            {currentPage}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1, 'next')} 
            disabled={contacts.length < itemsPerPage} 
            type="button" 
            className="btn btn-dark ml-2"
          >
            Next
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default App;

