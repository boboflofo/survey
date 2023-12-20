import { Routes, Route } from "react-router-dom"
import SignIn from './SignIn.jsx'
import Header from './Header.jsx'
import SurveyDisplay from './SurveyDisplay.jsx'

function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/surveys' element={<SurveyDisplay />} />
        </Routes>
    </>
  )
}

export default App