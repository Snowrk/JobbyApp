import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-content">
      <div className="text-con">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="btn-link">
          <button className="find-jobs-btn" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
