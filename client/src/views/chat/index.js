import React, { useState, useEffect } from 'react'

const Chat = (props) => {
  useEffect(() => {
    window.open(
      'https://nihongo365-chat.herokuapp.com/',
      '_blank', // <- This is what makes it open in a new window.
    )
  }, [])
  return <>Nihongo365 Chat đã được mở trong tab mới của trình duyệt</>
}

export default Chat
