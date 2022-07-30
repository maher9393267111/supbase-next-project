
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
    arrayUnion,
    addDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

import {
    getDownloadURL,
    ref,
    uploadString,
    getStorage,
    uploadBytes,
    deleteObject,
  } from "firebase/storage";


import { db,storage } from '../firebase'
import {
    useCollectionData,
    useDocumentData,
  } from "react-firebase-hooks/firestore";
import { toast } from "react-toastify";
import { message } from "antd";





export const createPost = async (postdata) => {

    console.log('subdata--->⚡⚡');
    await addDoc(collection(db, "InstaPosts",), postdata).then(() => {
        toast.success("post created successfully");

    }
    ).catch((error) => {
        toast.error(error.message);


    }
    );
}





export const AllPosts= () => {
    return getDocs(query(collection(db, "InstaPosts"),    
   // orderBy('orderby', "desc")
    )).then((querySnapshot) => {
  
      var data = [];
      querySnapshot.forEach((doc) => {
     
          console.log("posts is exist");
          
          data.push({ ...doc.data(),id: doc.id  })
        
      });
    //  setProductsNew(data);
  console.log("Posts------>",data);
      return  data;
    });
  }



  

export const PostsByTopic= (topic) => {
    return getDocs(query(collection(db, "InstaPosts"), 
    where("topic", "==", topic)   
   // orderBy('orderby', "desc")
    )).then((querySnapshot) => {
  
      var data = [];
      querySnapshot.forEach((doc) => {
     
          console.log("posts is exist");
          
          data.push({ ...doc.data(),id: doc.id  })
        
      });
    //  setProductsNew(data);
  console.log("Posts by specefic Topic------>",data);
      return  data;
    });
  }



  
export const userPosts= (userName) => {
  return getDocs(query(collection(db, "posts"), 
  where("postedby", "==", userName)   
 // orderBy('orderby', "desc")
  )).then((querySnapshot) => {

    var data = [];
    querySnapshot.forEach((doc) => {
   
        console.log("user posts is exist");
        
        data.push({ ...doc.data(),id: doc.id  })
      
    });
  //  setProductsNew(data);
console.log("specefic user Posts----->",data);
    return  data;
  });
}


// userLikesPosts


export const userLikesPosts= (userName) => {
  return getDocs(query(collection(db, "posts"), 
  where("postedby", "==", userName)   
 // orderBy('orderby', "desc")
  )).then((querySnapshot) => {

    var data = [];
    querySnapshot.forEach((doc) => {
   
        console.log("user posts is exist");
        
        data.push({ ...doc.data(),id: doc.id  })
      
    });
  //  setProductsNew(data);
console.log("specefic user Posts----->",data);
    return  data;
  });
}







export const AllUsers= (user) => {
 // console.log("user is 📍  📍  📍 ------>",user?.name);
   
  return getDocs(query(collection(db, "users"),  
  //  all users except auth user
    user?.name !== undefined ? where("name", "!=", user?.name) : where("name", "!=", "")
 // orderBy('orderby', "desc")
  )).then((querySnapshot) => {

    var data = [];
    querySnapshot.forEach((doc) => {
   
        console.log("users is exist");
        
        data.push({ ...doc.data(),id: doc.id  })
      
    });
  //  setProductsNew(data);
console.log("allUSers ------>",data);
    return  data;
  });
}




// handle useschat


export const handleChatusers= async(id) => {
  const userpath = doc(db, "users", `${id}`);
  const useris = await (await getDoc(userpath)).data();
  console.log("useris☢️☢️☢️☢️------>",useris,'id:::::',id);
  return useris;

}



// find if me or  nother user have chat with each other

export const ExistChat= (me,user) => {
  // console.log("user is 📍  📍  📍 ------>",user?.name);
    
   return getDocs(query(collection(db, "chats"),  
   

   )).then((querySnapshot) => {
 
     var data = [];
     querySnapshot.forEach((doc) => {
    
         console.log("users is exist");
         
         data.push({ ...doc.data(),id: doc.id  })
       
     });
   //  setProductsNew(data);
 console.log("Are we have Chat ???????? ------>",data);


// the find chat between me and other user
  var chat = data.find(chat => chat.users.includes(me) && chat.users.includes(user));
  console.log("chat is ------>",chat);
  return chat;

   //  return  data;
   });
 }
 


 export const findOnotherUserData= async(id) => {
 // console.log("user is 📍  📍  📍 ------>",id);
  const userpath = doc(db, "users", id);
  const useris = await (await getDoc(userpath)).data();
//  console.log("useris☢️☢️☢️☢️------>",useris);
  return useris;

}



// find curent user All chats

export const userChats= (user) => {
  // console.log("user is 📍  📍  📍 ------>",user?.name);
    
   return getDocs(query(collection(db, "chats"),  
   //  all users except auth user
  //   user?.name !== undefined ? where("name", "!=", user?.name) : where("name", "!=", "")
  // orderBy('orderby', "desc")
   )).then((querySnapshot) => {
 
     var data = [];
     querySnapshot.forEach((doc) => {
    
         console.log("users is exist");
         
         data.push({ ...doc.data(),id: doc.id  })
       
     });
   //  setProductsNew(data);
 console.log("allUserChats IS------>",data);


 const filterchats = data.filter(chat => chat.users.includes(user));
     return  filterchats;
   });
 }
 

 // follow user


 
export const Follow = async (userinfo, userdata) => {
  try {
    // add users collection to group collection
    // when im follow the user add to my folloing collecction

    await setDoc(doc(db, "users", userinfo.id, "following", userdata?.email), {
      name: userdata.name,
      email: userdata.email,
      image: userdata.image,
      id: userdata.id,
      followedAt: serverTimestamp(),
    })
    message.success("You are now following this user");
 
// and add to my followers collection in onother user


await setDoc(doc(db, "users", userdata.id, "followers", userinfo?.email), {
  name: userinfo.name,
  email: userinfo.email,
  image: userinfo.image,
  id: userinfo.id,
  followedAt: serverTimestamp(),
})




  } catch (error) {
    message.error(error.message);
  }
};



export  const unfollow = async (userinfo, userdata) => {

  console.log("DBDATA--IS---->",userinfo.id,userdata.id);
  // elete it from group collection and from users collection
  
  try {
  
   
    const userDoc = doc(db, "users", userinfo.id, "following",userdata.id );
    await deleteDoc(userDoc).then(() => {
    message.success("User Deleted From following");

    })
    const onotherDoc = doc(db, "users", userdata.id, "followers",userinfo.id );
    await deleteDoc(onotherDoc).then(() => {
    message.success("User Deleted From foloowers");
    })
  }
  

    catch (error) {
  
     message.error(error.message);
    }
  
  
  
  }
  

  // ----user all following onother user page----


  export const  allfollowing = async (userid) => {
  
    const q = query(
			collection(db, 'users',userid, 'following'),
		//	where('authorId', '==', user.uid)
		)
		const querySnapshot = await getDocs(q)
		const data = querySnapshot.docs.map((doc) => doc.data())
    console.log("hfffffffffff-->",data);
    return data;
    


}







  // user all followers onother user page

  export  const allfollowers = async (userid) => {
   
    const q = query(
			collection(db, 'users',userid, 'followers'),
		//	where('authorId', '==', user.uid)
		)
		const querySnapshot = await getDocs(q)
		const data = querySnapshot.docs.map((doc) => doc.data())
    return data;
    



  }


// find user byid

  export const findUserById = async (id) => {

    const productRef = doc(db, "users", id);
    const userdata = await getDoc(productRef);

    const user = ({ id: id, ...userdata.data() });
    console.log("user is ❇❇❇------>",user);
return user

  }
 




  export const UserOnotherPosts= (userid,postid) => {
    // console.log("user is 📍  📍  📍 ------>",user?.name);
      
     return getDocs(query(collection(db, "InstaPosts"),  
    where("postedbyId", "==", userid),
   // where("id", "!=", postid),
    // orderBy('createdAt', "desc")
     )).then((querySnapshot) => {
   
       var data = [];
       querySnapshot.forEach((doc) => {
      
           console.log("users is exist");
           
           data.push({ ...doc.data(),id: doc.id  })
         
       });
     //  setProductsNew(data);
   console.log("ONOTHER POSTS ISSSS------>",data?.length);
  
// filter data where postid is not equal to postid
const filterdata = data.filter(post => post.id !== postid);

console.log("filtereeeed----->",filterdata?.length);

  
 //  const filterchats = data.filter(chat => chat.users.includes(user));
       return  filterdata;
     });
   }
   