import {useState, useEffect, useCallback} from 'react'
import Loader from 'react-loader-spinner'
import {Link, withRouter} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const [data, setData] = useState([])
  const [isError, setError] = useState(false)
  const [isLoading, setLoader] = useState(true)

  const fetchData = useCallback(async () => {
    const url = 'https://apis.ccbp.in/te/courses'
    const options = {method: 'GET'}

    try {
      setLoader(true) // Set loading before fetching
      setError(false) // Reset error state
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        const updatedData = responseData.courses.map(each => ({
          id: each.id,
          logoUrl: each.logo_url,
          name: each.name,
        }))
        setData(updatedData)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (error) {
      setError(true)
    } finally {
      setLoader(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRetry = () => {
    fetchData()
  }

  const content = () => {
    if (isLoading) {
      return (
        <div data-testid="loader">
          <Loader type="Oval" width={60} height={60} color="navy" />
        </div>
      )
    }
    if (isError) {
      return (
        <div className="failure-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
            alt="failure view"
            className="failure-image"
          />
          <h1 style={{margin: '5px', color: 'red'}}>
            Oops! Something went wrong
          </h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )
    }
    return (
      <div>
        <h1 className="heading">Courses</h1>
        <ul style={{listStyleType: 'none'}} className="api-data-container">
          {data.map(each => (
            <Link
              key={each.id}
              to={`/courses/${each.id}`}
              className="nav-item-link"
            >
              <li className="logo-container">
                <img className="logo" src={each.logoUrl} alt={each.name} />
                <p className="name-heading">{each.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="home-container">{content()}</div>
    </div>
  )
}

export default withRouter(Home)
