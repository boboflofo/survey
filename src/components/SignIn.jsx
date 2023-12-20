import { useState, useEffect } from "react";
import { auth } from './../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
// Testing
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from './../firebase'

export default function SignIn() {

  const [signUpSuccess, setSignUpSuccess] = useState(null);
  const [signInSuccess, setSignInSuccess] = useState(null);
  const [signOutSuccess, setSignOutSuccess] = useState(null);
  // const [hasNavigated, setHasNavigated] = useState(false);

  function doSignUp(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setSignUpSuccess(`You've successfully signed up, ${userCredential.user.email}!`);
    })
    .catch((error) => {
      setSignUpSuccess(`There was an error signing up: ${error.message}`);
    });
  }

  function doSignIn(e) {
    e.preventDefault();
    const email = e.target.signinEmail.value;
    const password = e.target.signinPassword.value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setSignInSuccess(`You've successfully signed in as ${userCredential.user.email}`)
    })
    .catch((error) => {
      setSignInSuccess(`There was an error signing in: ${error.message}`)
    });
  }

  function doSignOut() {
    signOut(auth) 
      .then(function () {
        setSignOutSuccess('You have successfully signed out!');
      })
      .catch(function (error) {
        setSignOutSuccess(`There was an error signing out: ${error.message}`)
      })
  }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser !== null) {
          const usersCollection = collection(db, 'users');
          const existingUsers = await getDocs(usersCollection);
          const userUID = auth.currentUser.uid;

          const foundUser = existingUsers.docs.find((doc) => doc.id === auth.currentUser.uid);
          const userDocRef = doc(usersCollection, userUID);
          if (foundUser) {
            navigate('/surveys');
            console.log('userDocRef:',userDocRef);
            console.log('User found.');
          } else {
            await setDoc(userDocRef, {});
            console.log('User document not found.');
          }
        }
      } catch (error) {
        console.error('Error getting documents:', error.message);
      }
    };

    fetchData();
  }, [auth.currentUser]);

  return (
    <>
      <h1>Sign up</h1>
      {signUpSuccess}
      <form onSubmit={doSignUp}>
        <input 
          type='text'
          name='email'
          placeholder='Email'/>
        <input 
          type='password'
          name='password'
          placeholder='Password'/>
      <button type='submit'>Sign Up</button>
      </form>

      <h1>Sign In</h1>
      {signInSuccess}
      <form onSubmit={doSignIn}>
        <input 
          type='text'
          name='signinEmail'
          placeholder='Email'
        />
        <input 
          type='password'
          name='signinPassword'
          placeholder='Password'
        />
        <button type='submit'>Sign in</button>
      </form>

      <h1>Sign Out</h1>
      {signOutSuccess}
      <br />
      <button onClick={doSignOut}>Sign Out</button>
    </>
  );
}