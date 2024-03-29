import React, {useState} from 'react'
import {useQuery, gql} from '@apollo/client'
import SiteHeader from "../components/SiteHeader.js";
import Navbar from "../components/Navbar";
import { userData } from '../helper';
import { Link, useParams} from 'react-router-dom';

const ATTRACTIONS = gql`
query GetAttractions {
  attractiontypes {
            data {
              id,
              attributes {
                name
              }
            }
          }        
}
`

const ATTRACTION = gql`
query GetAttraction($id : ID!) {
    attractiontype (id : $id) {
              data {
                id,
                attributes {
                  name,
                  cities {
                    data {
                      id,
                      attributes {
                        name,
                        body,
                        attractiontypes {
                          data {
                            id,
                            attributes {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
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
    const { id } = useParams();
    const { loading, error, data } = useQuery(ATTRACTION, {
        variables: {id : id}
    });
    const {loadingAttr, errorAttr, data: dataAttr} = useQuery(ATTRACTIONS);
    const username = userData().username;

    if (loading || loadingAttr) return <p>Loading...</p>
    if (error || errorAttr) return <p>Error</p>
    console.log(data.attractiontype.data.attributes.cities.data);

    return (
      <div>
            <SiteHeader /><Navbar /><div className='home-page'> <h2>Welcome, {username} </h2>
            <nav className='attractiontypes'><span>Filter by what you would like to do!</span> {dataAttr?.attractiontypes?.data.map(attraction => (
              <Link key={attraction.id} to={`/attr/${attraction.id}`}>{attraction.attributes.name}</Link>
            ))}</nav>
            {data?.attractiontype?.data?.attributes?.cities?.data?.map(city => (
              <div key={city.id} className='city-card'>
                  <h3>{city.attributes.name}</h3>
                  {city.attributes.attractiontypes.data.map(attractionType => (
          <small className="smalls" key={attractionType.id}>{attractionType.attributes.name}</small>
        ))}
                  <ReadMore>{city.attributes.body}</ReadMore>
                  
              </div>
          ))}
      </div>
      </div>
    )
}
