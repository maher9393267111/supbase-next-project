import { async } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendSignInLinkToEmail,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  orderBy,
  limit,
  query,
  where,
  FieldPath,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { auth, db } from "../firebase";
import { useDispatch } from "react-redux";
import {setProducts,     setName  } from "../store/index";
import {toast} from 'react-toastify';
import {message} from 'antd';
import {useRouter} from 'next/router';
const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

const AuthContext = ({ children }) => {
  const [currentuser, setUser] = useState({});
  const [userinfo, setUserinfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
const [onotherUser, setOnotherUser] = useState(null);
 const [userownChats, setUserChats] = useState([]);
  const dispatch = useDispatch();
const router = useRouter();

  const signUp = async (email, password, fullName,userName) => {
    await createUserWithEmailAndPassword(auth, email, password)




   // console.log("signUp--------->⚡⚡⚡⚡", email, password, name);

    await updateProfile(auth.currentUser, {
      displayName: fullName,

      photoURL:
        "https://cdn4.iconfinder.com/data/icons/office-thick-outline/36/office-14-256.png",
    });

    await setDoc(doc(db, "users", auth.currentUser.email), {
      watchList: [],
      userName: userName,
      name: auth.currentUser.displayName,
      role: "user",
      image: auth.currentUser.photoURL,
      email: auth.currentUser.email,
      password: password,
      history: [],
      createdAt: Date.now(),
      // serverTimestamp(),

      cart: [],
    
      totalprice: 0,
    });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then(() => {

updateDoc(doc(db, "users", auth.currentUser.email), {

  lastLogin: Date.now(),
  isOnline: true,
  isLoggedIn: true,
  isLoggedOut: false,
})


 router.push('/main');
 message.success('Welcome to the my site');

    })
    .catch(error => {
      router.push("/auth/login");
      message.error(error.message);
    })
  };

  //------- reguister and login

  //--- Sign in with google ---

  // sign with google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    // add the user to the users collection

    await setDoc(doc(db, "users", auth.currentUser.email), {
      watchList: [],
      
      name: auth.currentUser.displayName,
      role: "user",
      image: auth.currentUser.photoURL,
      email: auth.currentUser.email,
      password: "",
      createdAt:Date.now(),
      isOnline: true,
      isLoggedIn: true,
      isLoggedOut: false,
      //serverTimestamp(),

      cart: [],
      posts: [],
      comments: [],
      likes: [],
     
    });
  };

  // signout

  const logout = () => {
    console.log("logout")
updateDoc(doc(db, "users", auth.currentUser.email), {

  isOnline: false,
  isLoggedIn: false,
  isLoggedOut: true,
  lastLogout: Date.now(),
  lastLogin: Date.now(),
})

    setUser({});
    setUserinfo({});
    signOut(auth);
  };

  //------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        const fetchuser = async () => {
          const userinfo = await getDoc(doc(db, "users", user.email));
          setUserinfo({ id: userinfo.id, ...userinfo.data() });
        };

        fetchuser();
      }
    });

    return unsubscribe;
  }, [auth]);

  // ----modal




  const value = {
  
    currentuser,
    userinfo,
    signUp,
    signIn,
    logout,
    signInWithGoogle,
   
   
   
 
  
  };
  return <authContext.Provider {...{ value }}>{children}</authContext.Provider>;
};

export default AuthContext;