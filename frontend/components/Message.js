import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getUserId } from '../lib/auth'
import backarrow from '../images/back-arrow.svg'
import send from '../images/send.svg'
import Menu from '../components/Menu'
import { Link } from 'react-router-dom'

function Message(props) {
  const token = localStorage.getItem('token')
  const toId = props.match.params.id
  const [allMessages, updateAllMessages] = useState([])
  const [currentUserCheck, updateCurrentUserCheck] = useState([])
  const [text, setText] = useState('')
  const [toUser, updateToUser] = useState([])

  // // Message content form
  const [userMessage, updateUserMessage] = useState({
    to_user_id: toId,
    content: ''
  })

  // // Handle information needed to POST the message
  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const data = {
      ...userMessage,
      [name]: value
    }
    updateUserMessage(data)

  }

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('/api/message', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(resp => {
          updateAllMessages(resp.data)
        })
        .catch(err => console.log(err))
    }, 500)
    return () => clearInterval(interval)




  }, [])


  useEffect(() => {
    axios.get(`/api/users/${toId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateToUser(resp.data)
        console.log(resp.data)
      })
      .catch(err => console.log(err))
  }, [])

  const filter = {
    from_user_id: toId,
    to_user_id: getUserId()
  }

  const filteredMessage = allMessages.filter(function (item) {
    for (var key in filter) {
      if (item[key] === undefined || item[key] != filter[key])
        return false
    }
    return true
  })

  const toFilter = {
    from_user_id: getUserId(),
    to_user_id: toId
  }

  const tofilterMessage = allMessages.filter(function (item) {
    for (var key in toFilter) {
      if (item[key] === undefined || item[key] != toFilter[key])
        return false
    }
    return true
  })

  // Merging the filtered messages together. 
  const mergedMessages = [...filteredMessage, ...tofilterMessage]


  // Sorting messages by time - newest message to appear at the bottom.
  const sortMessages = mergedMessages.sort(function (a, b) {
    const dateA = new Date(a.created_at), dateB = new Date(b.created_at)
    return dateA - dateB
  })



  // Function POST message data to API
  function handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/message', userMessage, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        if (resp.data.errors) {
          return console.log(resp.data.errors)
        }
      })

    userMessage.content = ''
  }

  function handleEnter(event) {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  }

  return <section className="bg-color">
    <section className="page-container">
      <section className="message-box">
        <div className="overflow-fade">
        </div>
        <div className="page-cover">
          <Link to={'/message-home'}>
            <img src={backarrow} alt={'back-arrow'} />
          </Link>
          <img className="profile-image" src={toUser.image} alt={'user-profile-image'} />
          <div className="message-cover">
            <h1>{toUser.first_name}, {toUser.age}</h1>
            <h3>{toUser.bio}</h3>
          </div>
        </div>

        <hr></hr>

        <div className="dm-inner-scroll">
          {sortMessages.map((fromMessage, index) => {
            return <div className="message-content" key={index}>
              <h2>{fromMessage.content}</h2>
              <h3>{fromMessage.from_user.first_name}</h3>
            </div>
          })}

        </div>

        <form onSubmit={handleSubmit}>

          <textarea
            className="message-field"
            placeholder="Type your message..."
            onChange={handleChange}
            onKeyDown={handleEnter}
            value={userMessage.content}
            name="content"
          >
            {text}
          </textarea>

          <button className="dm-button">
            <img src={send} alt={'send-icon'} />
          </button>
        </form>
      </section>
    </section>
    <Menu />
  </section>
}

export default Message