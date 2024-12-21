import {Link} from 'react-router-dom'
import {FaStar, FaSuitcase} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const JobItem = props => {
  const {jobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    id,
    location,
    rating,
    title,
    packagePerAnnum,
  } = jobDetail
  return (
    <Link to={`/jobs/${id}`} style={{textDecoration: 'none', color: 'inherit'}}>
      <li className="job-list">
        <div className="job-head">
          <img
            src={companyLogoUrl}
            className="company-img"
            alt="company logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="job-rating">
              <FaStar className="icon-star icon-star1" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-tail">
          <div className="jt-left">
            <div className="job-font">
              <IoLocationSharp className="icon-star" />
              <p>{location}</p>
            </div>
            <div className="job-font">
              <FaSuitcase className="icon-star" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <div>
          <h1 className="job-title">Description</h1>
          <p className="job-font">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
