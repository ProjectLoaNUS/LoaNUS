import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

const SearchResults = (props) => {
  const { queryText } = props;
  const [ searchResultsDetails, setSearchResultsDetails ] = useState([]);
  const [ searchResultsImages, setSearchResultsImages ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const url = `${BACKEND_URL}/api/items/search`;
    if (queryText) {
      // Images of search result items
      axios
        .get(url, {
          params: {
            name: queryText,
            isFullSearch: true,
            isImageOnly: true
          },
        })
        .then((res) => {
          setSearchResultsImages(res.data.results);
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(url, {
          params: {
            name: queryText,
            isFullSearch: true,
            isTextOnly: true
          },
        })
        .then((res) => {
          setSearchResultsDetails(res.data.results);
          setIsLoading(false);
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
      setItemDatas={setSearchResultsDetails} />
  );
};

export default SearchResults;
