import React, { useState, useEffect } from 'react'
import TinderCard from 'react-tinder-card'
import axios from 'axios'
import distance from '../images/distance-marker.svg'
import decline from '../images/error-circle.svg'
import accept from '../images/heart-circle.svg'
import Modal from './modal/Modal'
import ModalTwo from './modal/ModalTwo'
import { getUserId } from '../lib/auth'
import Profile from './Profile'
import Menu from '../components/Menu'

function Swipe() {
  // const characters = db
  const [lastDirection, setLastDirection] = useState('')

  // Getting list of all users to be used throughout the app. 
  const token = localStorage.getItem('token')
  const [characters, updateCharacters] = useState([])
  const [matchesInfo, updateMatchesInfo] = useState([])
  const [characterId, updateCharacterId] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenTwo, setIsOpenTwo] = useState(false)


  // ? GET a list of all USERS to update CHARACTERS for CARDS
  useEffect(() => {
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateCharacters(resp.data)
      })
      .catch(err => console.log(err))
  }, [])
  // ? ----


  // ? Checking matches table - being called in the SWIPED function
  function checkNewMatches(characterId) {
    axios.get('/api/matches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        filtering(resp.data, characterId)
        updateMatchesInfo(resp.data)
        // console.log(resp.data)

      })
      .catch(err => console.log(err))
  }
  // ? ----

  // ? Moving Deck
  const swiped = (direction, nameToDelete, characterId) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
    updateCharacterId(characterId)
    console.log(characterId, "inside swiped")
    // ? IF right POST to LIKES table
    if (direction === 'right') {
      // console.log('Moved Right')
      console.log(characterId)
      axios.post('/api/likes', { liked_id: characterId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(
          checkNewMatches(characterId),
        )
    }

  }


  const clicked = (character, dir) => {
    console.log(characters)
    swiped(dir, character.first_name, character.id)
    updateCharacters(characters.filter(item => item !== character))

  }


  function filtering(data, characterId) {
    const filter = {
      match_one_id: getUserId(),
      match_two_id: characterId
    }
    const filteredMatches = data.filter(function (item) {
      for (var key in filter) {
        if (item[key] === undefined || item[key] != filter[key])
          return false
      }
      return true
    })

    if (filteredMatches.length === 0) {
      return setIsOpen(false)
    } else {
      return setIsOpen(true)
    }
  }

  function tap(userId) {
    setIsOpenTwo(userId)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return <section className="bg-color">

    <section className="page-container">
      <section className="page-content">
        <div>
          <div className="buttonwrapper">
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <h2>Its a match!</h2>
              <h3>Go shake your tail feathers</h3>
            </Modal>
          </div>
          <div className='cardContainer'>
            {characters.map((character) =>
              <div key={character.first_name} onClick={() => tap(character.id)}>
                <TinderCard className='swipe'
                  key={character.first_name}
                  onSwipe={(dir) => swiped(dir, character.first_name, character.id)}
                  onCardLeftScreen={() => outOfFrame(character.first_name)}
                >
                  <div style={{ backgroundImage: 'url(' + character.image + ')' }} className='card'>
                    <div className='card-distance'>
                      <img src={distance} alt={'distance-arrow'} />
                      <h3>2.2 Km away</h3>
                    </div>
                    <div className='card-user'>
                      <h2>{character.first_name}, {character.age}</h2>
                      <h3>{character.bio}</h3>
                    </div>
                  </div>
                </TinderCard>
              </div>
            )}
            <div className="buttonwrapper">
              <ModalTwo open={isOpenTwo} onClose={() => setIsOpenTwo(false)}>
                <Profile userId={isOpenTwo} />
              </ModalTwo>
            </div>
            <br />
            <h2 className="swipeOut">Oh no! You have run out of swipes!</h2>
          </div>
          <div className="button-group">
            <button className="button-style"><img className="button-img" src={decline} onClick={() => clicked(characters[characters.length - 1], 'left')} alt={'decline'} /></button>
            <button className="button-style" id="button-style-right"><img className="button-img" id="accept" src={accept} onClick={() => clicked(characters[characters.length - 1], 'right')} alt={'accept'} /></button>
          </div>
          {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText'> Get Swiping</h2>}
          {/* {itsAMatch === true ?
        <h1>ITS A MATCH!!!</h1>
        :
        <h1>NOT A MATCH!!</h1>
      } */}
        </div>
      </section>

    </section>

    <Menu />
  </section>
}



export default Swipe