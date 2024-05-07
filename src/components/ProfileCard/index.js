import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const Loading = () => (
  <div className="loader-container height-500" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const compStatus = {
  inProgress: 'LOADING',
  failed: 'FAILED',
  success: 'SUCCESS',
}

class ProfileCard extends Component {
  state = {profile: {}, compState: compStatus.inProgress}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    const {compState} = this.state
    if (compState !== compStatus.inProgress) {
      this.setState({compState: compStatus.inProgress})
    }
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profile: formattedData, compState: compStatus.success})
    } else {
      this.setState({compState: compStatus.failed})
    }
  }

  pcard = () => {
    const {compState, profile} = this.state
    const {name, shortBio} = profile
    return compState === compStatus.failed ? (
      <div className="retry">
        <button className="retry-btn" type="button" onClick={this.getProfile}>
          Retry
        </button>
      </div>
    ) : (
      <div className="profile-box">
        <img src={profile.profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  render() {
    const {compState} = this.state
    return compState === compStatus.inProgress ? <Loading /> : this.pcard()
  }
}

export default ProfileCard
