import * as React from 'react';
import "./css/App.css"
import Register from "./components/Register";
import Login from "./components/login";
import { useState, useEffect } from 'react';
import axios from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';

function App() {
  // const [showPopup, setShowPopup] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: -1.3674,
    latitude: 46.2034,
    zoom: 11 
  })

useEffect(()=>{
const getPins = async () => {
try {
  const res = await axios.get("/pins");
  setPins(res.data);
}
catch (err) {
  console.log(err);
}
};
getPins()
},[]);

const handleMarkerClick = (id,lat,long) => {
setCurrentPlaceId(id);
setViewport({...viewport, latitude: lat, longitude: long});

const handleAddClick = (e) => {
const [long, lat] = e.longlat;
setNewPlace({
lat,
long,
})
};

const handleSubmit = async (e)=> {
  e.preventDefault();
  const newPin = {
    user: currentUser,
    title,
    review,
    rating,
    lat:newPlace.lat,
    long:newPlace.long
  }
  try{ const res = await axios.post("/pins", newPin)
  setPins([...pins,res.data]);
  setNewPlace(null);


  }catch(err){console.log(err);}
};

  return (
    <div className='map'>
    <Map
      // initialViewState={{
      //   longitude: -1.3674,
      //   latitude: 46.2034,
      //   zoom: 11 
      // }}
      {...viewport}
      style={{width: "100vw", height: "100vh"}}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange = {(nextViewport)=> setViewport(nextViewport)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      transitionDuration="200"
     >
      {pins.map(p=>( 
        <>
      <Marker longitude={p.long} latitude={p.lat} offsetLeft={-20} offsetTop={-10} >
      <RoomIcon style={{color: p.username===currentUser ? "red" : "purple", cursor:"pointer"}}
      onClick={()=>handleMarkerClick(p._id, p.lat,p.long)}
      />
      </Marker>
      {p._id === currentPlaceId
       && (
      <Popup className='map_popup' longitude={p.long} latitude={p.lat} anchor="left"
        onClose={() => setCurrentPlaceId(null)}>
        <div className='map_content'>
          <label>Place</label>
          <h4>{p.title}</h4>
          <label>Review</label>
          <p>{p.review}</p>
          <label>Rating</label>
          <div>
            {Array(p.rating).fill(<StarIcon className='map_content_star'/>)}
          </div>
          <label>
            <span>Created by <b>{p.username}</b></span>
          </label>
          </div>
      </Popup> )}
       </> ))}
       { newPlace && 
       <Popup className='map_popup' longitude={newPlace.long} latitude={newPlace.lat} anchor="left"
        onClose={() => setNewPlace(null)}>
          <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a title' onChange={(e)=>setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder='Why do you enjoy this place ?'onChange={(e)=>setReview(e.target.value)}/>
                <label>Rating</label>
                <selec onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </selec>
                <button className='submitButton' type="submit">Add Pin</button>
              
              </form>
          </div>
      </Popup> }
      { currentUser ? (<button className='logout boutton'>Log out</button>) 
      : (<div className='buttons'>
      <button className='login button' onClick={()=>setShowLogin(true)}>Log in</button>
      <button className='register button' onClick={()=>setShowRegister(true)}>Register</button>
      </div>)}
      { showRegister && <Register setShowRegister={setShowRegister}/> }
      { showLogin && <Login setShowLogin={setShowLogin}/> }
    </Map>
    </div>
  )};
}

export default App;


