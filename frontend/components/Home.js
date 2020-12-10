import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.svg'
import image from '../images/home-image.svg'

const Home = () => {

  return <section className="bg-color">
    <section className="page-container">

      <section className="home-content">
        <img src={logo} alt="logo" />

        <img clasName="homeimage" src={image} alt="logo" />
        <h2> Welcome to Kindlr, signup or login to continue you literary libation into love.</h2>
        <div className="home-buttons">
          <Link to={'/login'}>
            <button className="edit-profile-button">
              Login
            </button>
          </Link>
          <Link to={'/register'}>
            <button className="edit-profile-button"> Register
            </button>
          </Link>
        </div>
      </section>
    </section>
  </section>


}

export default Home