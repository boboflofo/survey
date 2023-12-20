import { db, auth } from "./../firebase";
import { collection, addDoc, onSnapshot, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function SurveyDisplay() {
  const [mainUsersList, setMainUsersList] = useState([]);
  const [error, setError] = useState(null);
  const [exampleUser, setExampleUser] = useState([]);
  const [userID, setUserID] = useState(auth.currentUser.uid);
  const [currentUser, setCurrentUser] = useState(doc(db, 'users', auth.currentUser.uid))
  const user = userID ? doc(db, 'users', userID) : null;
  const userSurveys = user ? collection(user, 'Surveys') : null;

  useEffect(() => {
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
      },
      (error) => {
        setError(error.message);
      }
    );
    return () => unSubscribe();
  }, []);

  useEffect(() => {
    if(userSurveys) {
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
  }, [userSurveys]);

  const handleUserClick = (userId) => {
    setUserID(userId)
    setCurrentUser(doc(db, 'users', userId)._key.path.segments[1])
    console.log(currentUser)
  }

  if (auth.currentUser == null) {
    return <h1>You must be signed in to see the surveys</h1>;
  } else if (auth.currentUser != null) {
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