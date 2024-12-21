import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {FaStar, FaSuitcase, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import './index.css'

class JobItemDetail extends Component {
  state = {blogData: {}, isLoading: true, similar: []}

  componentDidMount() {
    this.getBlogItemData()
  }

  getBlogItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    const updateJobDetail = {
      title: data.job_details.title,
      companyLogoUrl: data.job_details.company_logo_url,
      skills: data.job_details.skills,
      companyWebsiteUrl: data.job_details.company_website_url,
      packagePerAnnum: data.job_details.package_per_annum,
      lifeAtCompany: data.job_details.life_at_company,
      jobDescription: data.job_details.job_description,
      employmentType: data.job_details.employment_type,
      rating: data.job_details.rating,
      id: data.job_details.id,
      location: data.job_details.location,
    }
    const updateSimilarJobDetail = data.similar_jobs.map(each => ({
      title: each.title,
      companyLogoUrl: each.company_logo_url,
      jobDescription: each.job_description,
      employmentType: each.employment_type,
      rating: each.rating,
      id: each.id,
      location: each.location,
    }))
    this.setState({
      blogData: updateJobDetail,
      isLoading: false,
      similar: updateSimilarJobDetail,
    })
  }

  renderBlogItemDetails = () => {
    const {blogData, similar} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      rating,
      title,
      packagePerAnnum,
      skills,
    } = blogData
    return (
      <div className="container-mama">
        <div className="job-detail-item">
          <div className="job-detail-head">
            <img
              src={companyLogoUrl}
              className="company-detail-img"
              alt="job details company logo"
            />
            <div>
              <h1 className="job-detail-title">{title}</h1>
              <div className="job-detail-rating">
                <FaStar className="icon-detail-star icon-detail-star1" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-detail-tail">
            <div className="jt-detail-left">
              <div className="job-detail-font">
                <IoLocationSharp className="icon-detail-star" />
                <p>{location}</p>
              </div>
              <div className="job-detail-font">
                <FaSuitcase className="icon-detail-star" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-detail-line" />
          <div>
            <div className="visit-url-con">
              <h1 className="job-detail-title">Description</h1>
              <a href={companyWebsiteUrl} className="visitUrl">
                Visit <FaExternalLinkAlt />
              </a>
            </div>
            <p className="job-detail-font">{jobDescription}</p>
          </div>
          <div>
            <h1 className="job-detail-title">Skills</h1>
            <div className="skills-con">
              {skills.map(each => (
                <div className="skill-item" key={each.name}>
                  <img
                    src={each.image_url}
                    alt={each.name}
                    className="skill-img"
                  />
                  <p className="job-detail-font">{each.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="job-detail-title">Life at Company</h1>
            <div className="company-life">
              <p className="job-detail-font">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="company-life-img"
              />
            </div>
          </div>
        </div>
        <div className="similar-bg-con">
          <h1 className="job-detail-title">Similar Jobs</h1>
          <ul className="similar-con">
            {similar.map(each => (
              <li className="job-similar-list" key={each.id}>
                <div className="job-head">
                  <img
                    src={each.companyLogoUrl}
                    className="company-img"
                    alt="company logo"
                  />
                  <div>
                    <h1 className="job-title">{each.title}</h1>
                    <div className="job-rating">
                      <FaStar className="icon-star icon-star1" />
                      <p>{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="job-similar-title">Description</h1>
                  <p className="job-similar-font">{each.jobDescription}</p>
                </div>
                <div className="job-tail">
                  <div className="jt-left">
                    <div className="job-similar-font">
                      <IoLocationSharp className="icon-star" />
                      <p>{each.location}</p>
                    </div>
                    <div className="job-similar-font">
                      <FaSuitcase className="icon-star" />
                      <p>{each.employmentType}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="jobs-detail-con">
        <Header />
        {isLoading ? (
          <div className="loader-con" data-testid="loader">
            <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
          </div>
        ) : (
          this.renderBlogItemDetails()
        )}
        <div className="back-btn-con">
          <Link to="/jobs">
            <button type="button" className="find-job-button">
              Back
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default JobItemDetail
