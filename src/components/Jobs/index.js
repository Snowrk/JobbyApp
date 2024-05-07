import {Component} from 'react'
import {Link} from 'react-router-dom'
import {IoSearchOutline, IoLocationSharp} from 'react-icons/io5'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import ProfileCard from '../ProfileCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const compStatus = {
  inProgress: 'LOADING',
  failed: 'FAILED',
  success: 'SUCCESS',
}

const Filters = props => {
  const {changeSalary, changeEmployment} = props
  const onChangeEmployment = val => changeEmployment(val)
  const onChangeSalary = val => changeSalary(val)
  return (
    <div className="filters">
      <hr />
      <h1>Type of Employment</h1>
      <ul>
        {employmentTypesList.map(item => (
          <Checkbox
            itemDetails={item}
            key={item.employmentTypeId}
            callFunc={onChangeEmployment}
          />
        ))}
      </ul>
      <hr />
      <h1>Salary Range</h1>
      <ul>
        {salaryRangesList.map(item => (
          <Radio
            itemDetails={item}
            key={item.salaryRangeId}
            updateSalaryRange={onChangeSalary}
          />
        ))}
      </ul>
    </div>
  )
}

const InputEl = props => {
  const {changeSch, dataFun, sch} = props
  const search = () => dataFun()
  const keySearch = event => {
    if (event.key === 'Enter') {
      search()
    }
  }
  const onChangeSch = event => changeSch(event.target.value)
  return (
    <div className="search-box start-2">
      <input
        type="search"
        placeholder="Search"
        className="search-inp"
        value={sch}
        onChange={onChangeSch}
        onKeyDown={keySearch}
        onInput={onChangeSch}
      />
      <button
        type="button"
        className="search-btn"
        onClick={search}
        aria-label="search"
        data-testid="searchButton"
      >
        <IoSearchOutline />
      </button>
    </div>
  )
}

const Loading = () => (
  <div className="loader-container height-500" data-testid="loader">
    <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
  </div>
)

const Checkbox = props => {
  const {itemDetails, callFunc} = props
  const {employmentTypeId, label} = itemDetails
  const onCallFunc = () => callFunc(employmentTypeId)
  return (
    <li>
      <input
        type="checkbox"
        id={employmentTypeId}
        value={employmentTypeId}
        onChange={onCallFunc}
      />
      <label htmlFor={employmentTypeId}>{label}</label>
    </li>
  )
}

const Radio = props => {
  const {itemDetails, updateSalaryRange} = props
  const {salaryRangeId, label} = itemDetails
  const onUpdateSalaryRange = () => updateSalaryRange(salaryRangeId)
  return (
    <li>
      <input
        name="Salary Range"
        type="radio"
        id={salaryRangeId}
        value={salaryRangeId}
        onChange={onUpdateSalaryRange}
      />
      <label htmlFor={salaryRangeId}>{label}</label>
    </li>
  )
}

const JobCard = props => {
  const {itemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = itemDetails
  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-card">
        <div className="card-header">
          <img src={companyLogoUrl} alt="company logo" />
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
          <p className="ppa">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

const Failed = props => {
  const {getData} = props
  return (
    <div className="failed">
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

// const RaidoButton = () => (
//   <>
//     <input type="radio" id="tt" name="test" value="test-button" />
//     <label htmlFor="tt">Test</label>
//   </>
// )

class Jobs extends Component {
  state = {
    salary: '',
    employment: [],
    sch: '',
    compState: compStatus.inProgress,
    jobsList: [],
  }

  componentDidMount() {
    console.log('in mount')
    this.getData()
  }

  getData = async () => {
    const {compState} = this.state
    if (compState !== compStatus.inProgress) {
      this.setState({compState: compStatus.inProgress})
    }
    const {sch, salary, employment} = this.state
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const myUrl = `https://apis.ccbp.in/jobs?employment_type=${employment.join(
      ',',
    )}&minimum_package=${salary}&search=${sch}`
    const response = await fetch(myUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const formattedData = fetchedData.jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({jobsList: formattedData, compState: compStatus.success})
    } else {
      this.setState({compState: compStatus.failed})
    }
  }

  changeSalary = val => {
    this.setState({salary: val, compState: compStatus.inProgress}, this.getData)
  }

  changeEmployment = val => {
    this.setState(prevState => {
      if (prevState.employment.includes(val)) {
        const idx = prevState.employment.indexOf(val)
        const tempArr = [...prevState.employment]
        tempArr.splice(idx, 1)
        return {
          employment: tempArr,
          compState: compStatus.inProgress,
        }
      }
      return {
        employment: [...prevState.employment, val],
        compState: compStatus.inProgress,
      }
    }, this.getData)
  }

  changeSch = val => this.setState({sch: val})

  renderJobCards = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs-con">
        {jobsList.length > 0 ? (
          jobsList.map(item => <JobCard itemDetails={item} key={item.id} />)
        ) : (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )}
      </ul>
    )
  }

  renderSuccessFailed = () => {
    const {compState} = this.state
    return compState === compStatus.failed ? (
      <Failed getData={this.getData} />
    ) : (
      this.renderJobCards()
    )
  }

  render() {
    console.log(this.state)
    const {compState, sch} = this.state
    return (
      <>
        <Header />
        <div className="wrapper">
          <div className="jobs-content">
            <InputEl
              changeSch={this.changeSch}
              dataFun={this.getData}
              val={sch}
            />
            <div className="md-order-1 sidebar">
              <ProfileCard />
              <Filters
                changeEmployment={this.changeEmployment}
                changeSalary={this.changeSalary}
              />
            </div>
            {compState === compStatus.inProgress ? (
              <Loading />
            ) : (
              this.renderSuccessFailed()
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
