import {useState, useEffect, useCallback} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const CourseItemDetails = props => {
  const {match} = props
  const {params} = match
  const {id} = params
  const [itemData, setItemData] = useState([])
  const [isError, setError] = useState(false)
  const [isLoading, setLoader] = useState(true)

  const fetchData = useCallback(async () => {
    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()

        const updatedData = {
          description: data.course_details.description,
          name: data.course_details.name,
          imageUrl: data.course_details.image_url,
          id: data.course_details.id,
        }
        setItemData(updatedData)
        setError(false)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (error) {
      setError(true)
    } finally {
      setLoader(false)
    }
  }, [id]) // `id` as dependency, `fetchData` is memoized

  useEffect(() => {
    fetchData()
  }, [fetchData]) // `fetchData` is stable and included in dependencies

  const content = () => {
    if (isLoading) {
      return (
        <div data-testid="loader" style={{margin: '20px', textAlign: 'center'}}>
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
          <button type="button" onClick={fetchData}>
            Retry
          </button>
        </div>
      )
    }
    return (
      <div className="item-data-container">
        <div className="image-container">
          <img className="image" src={itemData.imageUrl} alt={itemData.name} />
        </div>
        <div className="details-container">
          <h1>{itemData.name}</h1>
          <p>{itemData.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      {content()}
    </div>
  )
}

export default CourseItemDetails
