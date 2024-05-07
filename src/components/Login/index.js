import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', failedMsg: ''}

  updateUsername = event => this.setState({username: event.target.value})

  updatePassword = event => this.setState({password: event.target.value})

  submitForm = async event => {
    event.preventDefault()
    const {history} = this.props
    const {username, password} = this.state
    const obj = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(obj),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      console.log('ok')
      Cookies.set('jwt_token', data.jwt_token, {expires: 1})
      history.replace('/')
    } else {
      this.setState({failedMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, failedMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg">
        <div className="login-box">
          <div className="login-logo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.submitForm}>
            <label htmlFor="un">USERNAME</label>
            <br />
            <input
              id="un"
              type="text"
              placeholder="Username"
              value={username}
              className="login-inp"
              onChange={this.updateUsername}
            />
            <br />
            <label htmlFor="pass">PASSWORD</label>
            <br />
            <input
              id="pass"
              type="password"
              placeholder="Password"
              value={password}
              className="login-inp"
              onChange={this.updatePassword}
            />
            <br />
            <button type="submit" className="login-btn">
              Login
            </button>
            {failedMsg.length > 0 && (
              <p className="error-msg">{`*${failedMsg}`}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
