import React, {useState} from 'react'
import {useQuery, gql} from '@apollo/client'

const CITIES = gql`
query GetCities {
    cities {
        name,
      description
    }
}
`

const ReadMore = ({children}) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <p className="text">
            {isReadMore ? text.slice(0, 150) : text}
            <span
                onClick={toggleReadMore}
                className="read-or-hide"
                style={{ color: "blue" }}
            >
                {isReadMore ? " ... Read more" : " Show less"}
            </span>
        </p>
    );
};

export default function HomePage() {
    const { loading, error, data } = useQuery(CITIES) 

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    return (
      <div>
          {data.cities.map(city => (
              <div key={city.id} className='city-card'>
                  <h2>{city.name}</h2>
                  <ReadMore>{city.description}</ReadMore>
                  
              </div>
          ))}
      </div>
    )
}
