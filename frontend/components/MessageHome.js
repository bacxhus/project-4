import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getUserId } from '../lib/auth'
import { Link } from 'react-router-dom'
import backarrow from '../images/back-arrow.svg'
import Menu from '../components/Menu'

function MessageHome() {
  const token = localStorage.getItem('token')
  const [allMatches, updateAllMatches] = useState([])
  // const [userMessages, updateUserMessages] = useState([])

  useEffect(() => {
    axios.get('/api/matches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        console.log(resp.data)
        updateAllMatches(resp.data)
      })
      .catch(err => console.log(err))
  }, [])



  // ? Filtering by conversations the user started 
  const iStarted = allMatches.filter((message) => {
    return message.match_one_id === getUserId() || message.match_two_id === getUserId()
  })


  // ? Removing multiple matches
  const newSorted = iStarted.map((item) => {
    return [item.match_two_id, item]
  })
  const mapSorted = new Map(newSorted)
  const results = [...mapSorted.values()]



  // ? Filtering by conversations the match started 
  // const theyStarted = allMatches.filter((message) => {
  //   return message.match_two_id === getUserId()
  // })
  // console.log(theyStarted)


  return <section className="bg-color">
    <section className="page-container">
      <section className="page-content">
        <div className="page-cover">
          <Link to={'/swipe'}>
            <img src={backarrow} alt={'back-arrow'} />
          </Link>
          <div className="message-cover">
            <h1>Messages</h1>
            <h3>Get chatting good looking</h3>
          </div>
        </div>

        <hr></hr>
        <div className="page-inner-scroll" id="dm-inner-scroll">
          {results.map((messageTitle, index) => {
            if (messageTitle.match_two_id === getUserId()) {
              return <Link key={index} to={`/message/${messageTitle.match_one_id}`}>
                <div className="message-list">
                  <img src={messageTitle.match_one.image} alt={'user-profile-image'} />
                  <div className="message-user">
                    <h2 className="testing">{messageTitle.match_one.first_name} </h2>
                    <h3 className="testing">{messageTitle.match_one.bio} </h3>
                  </div>
                </div>
              </Link>
            } else {
              return <Link key={index} to={`/message/${messageTitle.match_two_id}`}>
                <div className="message-list">
                  <img src={messageTitle.match_two.image} alt={'user-profile-image'} />
                  <div className="message-user">
                    <h2 className="testing">{messageTitle.match_two.first_name} </h2>
                    <h3 className="testing">{messageTitle.match_two.bio} </h3>
                  </div>
                </div>
              </Link>
            }

          })}
        </div>

      </section>

    </section>
    < Menu />
  </section>


}

export default MessageHome