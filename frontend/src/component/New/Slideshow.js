import React from 'react';
import { Slide } from 'react-slideshow-image';
import img1 from "../../images/slideshow2.png"
import img2 from "../../images/slideshow7.png"
import img3 from "../../images/slideshow6.png"
import 'react-slideshow-image/dist/styles.css'
import "./Home.css"

const spanStyle = {
 
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '450px',
  width: "95%",
  margin: "0 auto",
  borderRadius: "30px"
}

const slideImages = [
  {
    url: img2,
  },
  {
    url: img1,
  },
  {
    url: img3,
  },
  
];

const Slideshow = () => {
    return (
      <div className="slide-container">
        <Slide>
         {slideImages.map((slideImage, index)=> (
            <div key={index}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
                <span style={spanStyle}>{slideImage.caption}</span>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    )
}
export default Slideshow;
