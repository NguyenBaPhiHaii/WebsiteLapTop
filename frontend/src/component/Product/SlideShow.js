import React from 'react';
import { Slide } from 'react-slideshow-image';
import img1 from "../../images/slideshow2.png"
import img2 from "../../images/slideshow7.png"
import img3 from "../../images/slideshow6.png"
import 'react-slideshow-image/dist/styles.css'
import { CgMouse } from "react-icons/cg";
import "./Products.css"

const spanStyle = {
 
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '500px',
  width: "95%",
  margin: "0 auto",
  marginTop: "20px",
  borderRadius: "20px"
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
                <a href='#products' className='products-a'>
                  <button className='button-products'>Shop Now <CgMouse /></button>
                </a>
                <span style={spanStyle}>{slideImage.caption}</span>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    )
}
export default Slideshow;
