import axios from "axios";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";
import ItemList from "../ItemList/ItemList";

const SearchResults = (props) => {
  const { queryText } = props;
  const [ searchResultsDetails, setSearchResultsDetails ] = useState([]);
  const [ searchResultsImages, setSearchResultsImages ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    if (queryText) {
      const url = `${BACKEND_URL}/api/items/search`;
      const token = jwt.sign(
        {},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      // Images of search result items
      axios
        .get(url, {
          headers: {
            "x-auth-token": token
          },
          params: {
            name: queryText,
            isFullSearch: true,
            isImageOnly: true
          }
        })
        .then(res => {
          if (res.status === 200) {
            setSearchResultsImages(res.data.results);
          } else {
            console.log(res.data.error);
          }
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(url, {
          headers: {
            "x-auth-token": token
          },
          params: {
            name: queryText,
            isFullSearch: true,
            isTextOnly: true
          }
        })
        .then(res => {
          if (res.status === 200) {
            setSearchResultsDetails(res.data.results);
            setIsLoading(false);
          } else {
            console.log(res.data.error);
          }
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [queryText]);

  return (
    <ItemList
      isLoading={isLoading}
      noItemsText={`No results found for "${queryText}"`}
      itemImages={searchResultsImages}
      itemImagesType="base64"
      itemDatas={searchResultsDetails}
      setItemDatas={setSearchResultsDetails}
      buttonText="Borrow It!" />
  );
};

export default SearchResults;
