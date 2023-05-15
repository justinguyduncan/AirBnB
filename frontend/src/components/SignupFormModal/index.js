import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    setIsButtonDisabled(
      email === "" ||
      username === "" ||
      firstName === "" ||
      lastName === "" ||
      password === "" ||
      confirmPassword === ""
    );
  }, [email, username, firstName, lastName, password, confirmPassword]);

  // useEffect(() => {
  //   setIsButtonDisabled(username.length < 4 || password.length < 6 || password !== confirmPassword);
  // }, [username, password, confirmPassword]); // new useEffect hook

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(() => {
        closeModal();
        window.location.reload();
      })
        .catch(async (res) => {
          const data = await res.json();
          console.log(data)
          if (data.errors) {
            const errorMessages = Object.values(data.errors);
            setErrors(errorMessages);
          } else if (data.message) {
            setErrors([data.message]);
          }
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul>
        <div className="error-container">
        {errors.length > 0 && (
  <ul className="error-list">
    {errors.map((error, idx) => (
      <li key={idx} className="error-message">{error}</li>
    ))}
  </ul>
)}
</div>
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="sign-up-button" type="submit" disabled={isButtonDisabled}>
  Sign Up
</button>
      </form>
    </>
  );
}

export default SignupFormModal;
