import axios from "axios";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";
import ItemList from "../ItemList/ItemList";
import { CATEGORIES } from "../NewItem/ItemCategories";

const CategoryResults = (props) => {
  const { queryText } = props;
  const [searchResultsDetails, setSearchResultsDetails] = useState([]);
  const [searchResultsImages, setSearchResultsImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryText !== undefined) {
      // Images of search result items
      const token = jwt.sign(
        {},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      axios
        .get(
          `${BACKEND_URL}/api/items/getCategoryListingsTexts?category=` +
            queryText, {
              headers: {
                "x-auth-token": token
              }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setSearchResultsDetails(res.data.listings);
          } else {
            console.log(res.data.error);
          }
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(
          `${BACKEND_URL}/api/items/getCategoryListingsImgs?category=` +
            queryText, {
              headers: {
                "x-auth-token": token
              }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setSearchResultsImages(res.data.images);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            console.log(res.data.error);
          }
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [queryText]);

  return (
    <ItemList
      isLoading={isLoading}
      noItemsText={`No results found for "${CATEGORIES[queryText]}"`}
      itemImages={searchResultsImages}
      itemImagesType="base64"
      itemDatas={searchResultsDetails}
      setItemDatas={setSearchResultsDetails}
    />
  );
};

export default CategoryResults;
