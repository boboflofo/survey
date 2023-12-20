import { Link } from "react-router-dom"

export default function Header() {
  return (
    <>
    <Link to='/'>Sign In | </Link>
    <Link to='/surveys'>Surveys | </Link>
    </>
  )
}