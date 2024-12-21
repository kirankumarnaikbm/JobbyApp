import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import JobItem from '../JobItem'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profile: {},
    jobs: [],
    searchInput: '',
    searchInput1: '',
    empolymentType: {
      FULLTIME: false,
      PARTTIME: false,
      FREELANCE: false,
      INTERNSHIP: false,
    },
    salaryRange: {
      1000000: false,
      2000000: false,
      3000000: false,
      4000000: false,
    },
    apiStatus: apiStatusConstants.initial,
    apiStatus1: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.profileDetails()
    this.jobDetails()
  }

  profileDetails = async () => {
    this.setState({
      apiStatus1: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: updatedProfile,
        apiStatus1: apiStatusConstants.success,
      })
    }
    if (!response.ok) {
      this.setState({
        apiStatus1: apiStatusConstants.failure,
      })
    }
  }

  jobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {salaryRange, empolymentType} = this.state

    const filteredKeysString = Object.keys(salaryRange)
      .filter(key => salaryRange[key])
      .join(',')
    const filteredKeysStringE = Object.keys(empolymentType)
      .filter(key => empolymentType[key])
      .join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${filteredKeysStringE}&minimum_package=${filteredKeysString}&search=`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedJobs = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        id: each.id,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobs: updatedJobs, apiStatus: apiStatusConstants.success})
    }
    if (!response.ok) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  searchBtn = () => {
    this.setState(prevState => ({
      searchInput1: prevState.searchInput,
    }))
  }

  checkBox = event => {
    const {id, checked} = event.target
    this.setState(
      prevState => ({
        empolymentType: {
          ...prevState.empolymentType,
          [id]: checked,
        },
      }),
      () => {
        this.jobDetails()
      },
    )
  }

  checkBoxS = event => {
    const {id, checked} = event.target
    this.setState(
      prevState => ({
        salaryRange: {
          ...prevState.salaryRange,
          [id]: checked,
        },
      }),
      () => {
        this.jobDetails()
      },
    )
  }

  renderFailureView = () => (
    <div className="failue-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <Link to="/jobs">
        <button type="button" className="find-job-button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {searchInput1, searchInput, jobs} = this.state
    const searchResults = jobs.filter(eachUser =>
      eachUser.title.toLowerCase().includes(searchInput1.toLowerCase()),
    )
    return (
      <div className="jobs-container">
        <div className="input-con">
          <input
            type="search"
            onChange={this.onChangeSearchInput}
            value={searchInput}
            className="search-input"
          />
          <button
            type="button"
            className="s-btn"
            onClick={this.searchBtn}
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {searchResults.length !== 0 && (
          <ul className="filter">
            {searchResults.map(each => (
              <JobItem key={each.id} jobDetail={each} />
            ))}
          </ul>
        )}
        {searchResults.length === 0 && (
          <div>
            <div className="no-jobs-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
                className="no-job-img"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    const {profile, apiStatus, apiStatus1} = this.state
    const {name, profileImageUrl, shortBio} = profile

    return (
      <div className="jobs-con">
        <Header />
        <div className="both-con">
          <div className="profile-filter">
            {apiStatus1 === apiStatusConstants.success && (
              <div className="profile-con">
                <img src={profileImageUrl} alt="profile" />
                <h1 className="p-heading">{name}</h1>
                <p>{shortBio}</p>
              </div>
            )}
            {apiStatus1 === apiStatusConstants.failure && (
              <div className="profile-con1">
                <Link to="/jobs">
                  <button type="button" className="find-job-button">
                    Retry
                  </button>
                </Link>
              </div>
            )}
            <hr className="hr-line" />
            <h1 className="checkbox-heading">Type of Employment</h1>
            <ul className="filter">
              {employmentTypesList.map(each => (
                <li key={each.label}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    onChange={this.checkBox}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr-line" />
            <h1 className="checkbox-heading">Salary Range</h1>
            <ul className="filter">
              {salaryRangesList.map(each => (
                <li key={each.label}>
                  <input
                    type="checkbox"
                    id={each.salaryRangeId}
                    onChange={this.checkBoxS}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>
          {apiStatus === apiStatusConstants.success && this.renderSuccessView()}
          {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
          {apiStatus === apiStatusConstants.inProgress &&
            this.renderLoadingView()}
        </div>
      </div>
    )
  }
}

export default Jobs
