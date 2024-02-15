import React, { Fragment} from "react";
import "./about.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import MetaData from "../MetaData";


const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/hai.crab/";
  };
  return (
    <Fragment>
      <MetaData title={`ABOUT -- FSHOP`} />
      <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dhisthled/image/upload/v1700657684/avatars/azpaldsfnecw6llkaxak.png"
              alt="Founder"
            />
            <Typography>FShop</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @FShop
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com/channel/UCfNG8joTMnef9nB8h6249sg"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://www.instagram.com/hai.crab/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  );
};

export default About;
