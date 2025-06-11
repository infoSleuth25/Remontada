import React from 'react'

const Title = ({title="Chat App",description="This is the chat app called Remontada"}) => {
  return (
    <article>
         <title>{title}</title>
        <meta name="description" content={description} />
    </article>
  )
}

export default Title