import React, { useState } from 'react'

const Signup = props => {

  const [email, setEmail] = useState("parisi.aaron@gmail.com")
  const [password, setPassword] = useState("password")
  const [passwordConfirmation, setPasswordConfirmation] = useState("password")

  const handleSubmit = (e) => {
    e.preventDefault()

    const newUser = {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    }
    props.createNewUser(newUser)
  }

  
  return (
    <div className="app-form signup-form">
      <form
        onSubmit={e => handleSubmit(e)}
      >
        <input
          type="email"
          value={email}
          id="email"
          placeholder="Email"
          onChange={e => setEmail(e.currentTarget.value)}
        />

        <input
          type="password"
          value={password}
          id="password"
          placeholder="Password"
          onChange={e => setPassword(e.currentTarget.value)}
        />
        <input
          type="password"
          value={passwordConfirmation}
          id="password-confirmation"
          placeholder="Confirm Password"
          onChange={e => setPasswordConfirmation(e.currentTarget.value)}
        />

        <input
          type="submit"
          value="Sign Up!"
        />
      </form>
    </div>
  )

}

export default Signup