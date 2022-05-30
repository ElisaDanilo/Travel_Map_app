import "./css/App.css"
import Register from "./components/Register";
import Login from "./components/Login";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Map, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';

function App() {
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

const handleMarkerClick = (id,lat,long) => {
setCurrentPlaceId(id);
setViewport({...viewport, latitude: lat, longitude: long});
}

const handleAddClick = (e) => {
const [longitude, latitude] = e.longlat;
setNewPlace({
lat: latitude,
long: longitude,
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
  try{ const res = await axios.post("http://localhost8800/api/pins", newPin)
  setPins([...pins,res.data]);
  setNewPlace(null);
  }catch(err){console.log(err);}
};

useEffect(()=>{
  const getPins = async () => {
  try {
    const allPins = await axios.get("http://localhost:8800/api/pins");
    setPins(allPins.data);
  }catch (err) {
    console.log(err);
  }
  };
  getPins()
  },[]);

  const handleLogout = () => {
    setCurrentUser(null);};

  return (
    <div className='app'>
    <Map
      {...viewport}
      style={{width: "100vw", height: "100vh"}}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange = {(nextViewport)=> setViewport(nextViewport)}
      onDblClick={currentUser && handleAddClick}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      transitionDuration="200"
     >
      {pins.map((p)=>( 
        <>
      <Marker longitude={p.long} latitude={p.lat} offsetLeft={-20} offsetTop={-10} >
      <RoomIcon style={{color: p.username===currentUser ? "red" : "purple", cursor:"pointer"}}
      onClick={()=>handleMarkerClick(p._id, p.lat,p.long)}
      />
      </Marker>
      {p._id === currentPlaceId && (
      <Popup className='map_popup' key={p._id} longitude={p.long} latitude={p.lat} anchor="left"
      closeButton={true} closeOnClick={false} onClose={() => setCurrentPlaceId(null)}>
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
      </Popup> 
      )} 
       </> ))}
       { newPlace && (
         <>
          <Marker
          latitude={newPlace.lat}
          longitude={newPlace.long}
          offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-7 * viewport.zoom}
        >
          <RoomIcon
            style={{
              fontSize: 7 * viewport.zoom,
              color: "red",
              cursor: "pointer",
            }}
          />
        </Marker>
       <Popup className='map_popup' longitude={newPlace.long} latitude={newPlace.lat} anchor="left"
        closeButton={true} closeOnClick={false} onClose={() => setNewPlace(null)}>
          <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a title' autoFocus onChange={(e)=>setTitle(e.target.value)}/>
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
      </Popup> 
      </> )}
      { currentUser ? (<button className='map_logout' onClick={handleLogout} >Log out</button>) 
      : ( <div className='map_buttons'>
      <button className='map_login' onClick={()=>setShowLogin(true)}>Log in</button>
      { <button className='map_register' onClick={()=>setShowRegister(true)}>Register</button> }
      </div>)}
      { showRegister && <Register setShowRegister={setShowRegister}/> } 
      { showLogin && ( <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} /> 
      )}
      <h1>Hello</h1>
    </Map>
    </div>
  )};


export default App;


