import React, { useState } from 'react'
import { Button, InputGroup, Input, FormControl, InputRightElement } from '@chakra-ui/react'
import { Form } from 'react-router-dom'

function Signup() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [show, setShow] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState()

  const [name, setName] = useState()
  const [picture, setPicture] = useState()

  const handleShowBtn = () => {
    setShow(!show)
  }

  return (
    <div className="signup-form">
      <FormControl id="email">
        <Input
          type="email"
          className="form-input"
          name="email-input"
          placeholder="Enter your email"
          required
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </FormControl>

      <FormControl id="password">
        <InputGroup>
          <Input
            variant="unstyled"
            className="form-input"
            type={show ? 'text' : 'password'}
            name="password-input"
            placeholder="Enter your password"
            required
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <InputRightElement width="4.3rem">
            <button className="show-btn" onClick={handleShowBtn}>
              {show ? 'Hide' : 'Show'}
            </button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword">
        <Input
          type={show ? 'text' : 'password'}
          className="form-input"
          name="confirm-password-input"
          placeholder="Confirm your password"
          required
        />
      </FormControl>

      <div className="btn-container">
        <button type="button">Next</button>
      </div>
    </div>
  )
}

export default Signup
