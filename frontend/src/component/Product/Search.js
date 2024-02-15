import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import "./Search.css";

const Search = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
// trim sử dụng để loại bỏ các khoảng trắng ở đầu và cuối của chuỗi keyword.
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Products -- FSHOP" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
      {keyword && (
        <h1 className="searchResultHeading">
          Từ khóa bạn đã tìm kiếm là: {keyword}
        </h1>
      )}
    </Fragment>
  );
};

export default Search;
