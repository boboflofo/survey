import { db, auth } from "./../firebase";
import { collection, addDoc, onSnapshot, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function SurveyDisplay() {
  const [mainUsersList, setMainUsersList] = useState([]);
  const [error, setError] = useState(null);
  const [exampleUser, setExampleUser] = useState([]);
  const [userID, setUserID] = useState(null); //useState(auth.currentUser.uid)
  const [currentUser, setCurrentUser] = useState(null) //doc(db, 'users', auth.currentUser.uid)
  const user = userID ? doc(db, 'users', userID) : null;//refactor these so it doesn't spam
  const userSurveys = user ? collection(user, 'Surveys') : null;//refactor these so it doesn't spam

  useEffect(() => {
    // console.log(user);
    const unSubscribe = onSnapshot(
      collection(db, "users"),
      (collectionSnapshot) => {
        const users = [];
        collectionSnapshot.forEach((doc) => {
          users.push({
            id: doc.id
          });
        });
        setMainUsersList(users); 
        console.log("Users:", users);
      },
      (error) => {
        setError(error.message);
      }
    );
    return () => unSubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserID(user.uid);
        setCurrentUser(doc(db, 'users', user.uid));
        console.log("Current User:", currentUser)
        console.log("Current User Test:", user)
        //stuff
      } else {
        //user is signed out
        setUserID(null);
        setCurrentUser(null);
        setExampleUser([]);
      }
    });
    //cleanup
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if(currentUser) {
    getDocs(userSurveys).then((querySnapshot) => {
      const surveys = [];
      querySnapshot.forEach((survey) => {
          surveys.push({
              ...survey.data(),
              id: survey.id
          })
      });
        setExampleUser(surveys);
    });
  }
  }, [userSurveys, userID]);

  const handleUserClick = (userId) => {
    console.log(userId)
    setUserID(userId)
    setCurrentUser(doc(db, 'users', userId))  //doc(db, 'users', userId)._key.path.segments[1]
  }

  if (userID == null) {  //auth.currentUser
    return <h1>You must be signed in to see the surveys</h1>;
  } else if (userID != null) { //auth.currentUser
    return (
      <div>

        <h1>Test</h1>
        <ul>
          {mainUsersList.map((user) => (
            <React.Fragment key ={user.id}>
              <li onClick={() => handleUserClick(user.id)}>User ID: {user.id}</li>
            </React.Fragment>
          ))}
        </ul>
        <ul>
          {exampleUser.map((survey) => (
            <React.Fragment key ={survey.id}>
              <li>{survey.id}</li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}

export default SurveyDisplay;