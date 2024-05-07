import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const compStatus = {
  inProgress: 'LOADING',
  failed: 'FAILED',
  success: 'SUCCESS',
}

const Loading = () => (
  <div className="loader-container bg-black" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const Failed = props => {
  const {getData} = props
  return (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-btn" onClick={getData}>
        Retry
      </button>
    </div>
  )
}

const SimilarJob = props => {
  const {itemDetails} = props
  const {
    title,
    rating,
    id,
    location,
    companyLogoUrl,
    jobDescription,
    employmentType,
  } = itemDetails
  return (
    <Link to={`/jobs/${id}`} className="job-link sim-job-link">
      <li className="similar-job-card">
        <div className="card-header">
          <img src={companyLogoUrl} alt="similar job company logo" />
          <div>
            <h1>{title}</h1>
            <div className="ratings">
              <FaStar />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div className="card-liner sim-card-liner">
          <IoLocationSharp />
          <p>{location}</p>
          <BsBriefcaseFill />
          <p>{employmentType}</p>
        </div>
      </li>
    </Link>
  )
}

const RenderDetails = props => {
  const {jobDetails} = props
  const {
    skills,
    title,
    location,
    rating,
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    jobDescription,
    lifeAtCompany,
    packagePerAnnum,
  } = jobDetails
  return (
    <div className="details-card">
      <div className="card-header">
        <img src={companyLogoUrl} alt="job details company logo" />
        <div>
          <h1>{title}</h1>
          <div className="ratings">
            <FaStar />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="card-liner">
        <IoLocationSharp />
        <p>{location}</p>
        <BsBriefcaseFill />
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
      </div>
      <hr />
      <div className="des">
        <h1>Description</h1>
        <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
          Visit
          <FiExternalLink />
        </a>
      </div>
      <p>{jobDescription}</p>
      <h1>Skills</h1>
      <ul className="skills-con">
        {skills.map(item => (
          <li key={item.name}>
            <img src={item.image_url} alt={item.name} />
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
      <h1>Life at Company</h1>
      <div className="lac">
        <p>{lifeAtCompany.description}</p>
        <img src={lifeAtCompany.image_url} alt="life at company" />
      </div>
    </div>
  )
}

class JobItemDetails extends Component {
  state = {details: {}, compState: compStatus.inProgress}

  componentDidMount() {
    console.log('in did mount')

    this.getData()
  }

  getData = async () => {
    const {compState} = this.state
    if (compState !== compStatus.inProgress) {
      this.setState({compState: compStatus.inProgress})
    }
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const jobDetails = {
        skills: fetchedData.job_details.skills,
        title: fetchedData.job_details.title,
        location: fetchedData.job_details.location,
        rating: fetchedData.job_details.rating,
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        jobDescription: fetchedData.job_details.job_description,
        lifeAtCompany: fetchedData.job_details.life_at_company,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
      }
      const similarJobs = fetchedData.similar_jobs.map(item => ({
        title: item.title,
        rating: item.rating,
        id: item.id,
        location: item.location,
        companyLogoUrl: item.company_logo_url,
        jobDescription: item.job_description,
        employmentType: item.employment_type,
      }))
      const formattedData = {
        jobDetails,
        similarJobs,
      }
      setTimeout(
        this.setState({details: formattedData, compState: compStatus.success}),
        5000,
      )
    } else {
      this.setState({compState: compStatus.failed})
    }
  }

  renderSuccessFailed = () => {
    const {details, compState} = this.state
    const {jobDetails, similarJobs} = details
    return compState === compStatus.success ? (
      <div className="wrapper">
        <div className="details-content">
          <RenderDetails jobDetails={jobDetails} />
          <h1>Similar jobs</h1>
          <ul className="similar-jobs-con">
            {similarJobs.map(item => (
              <SimilarJob itemDetails={item} key={item.id} />
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <Failed getData={this.getData} />
    )
  }

  render() {
    console.log(this.state)
    const {compState} = this.state

    return (
      <>
        <Header />
        {compState === compStatus.inProgress ? (
          <Loading />
        ) : (
          this.renderSuccessFailed()
        )}
      </>
    )
  }
}

export default JobItemDetails
