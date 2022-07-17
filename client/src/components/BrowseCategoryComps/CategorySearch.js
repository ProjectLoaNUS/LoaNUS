import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { CATEGORIES } from "../NewItem/ItemCategories";

const CategoryResults = (props) => {
  const { queryText } = props;
  const [searchResultsDetails, setSearchResultsDetails] = useState([]);
  const [searchResultsImages, setSearchResultsImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryText) {
      // Images of search result items
      axios
        .get(
          `${BACKEND_URL}/api/items/getCategoryListingsTexts?category=` +
            queryText
        )
        .then((res) => {
          setSearchResultsDetails(res.data.listings);
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(
          `${BACKEND_URL}/api/items/getCategoryListingsImgs?category=` +
            queryText
        )
        .then((res) => {
          setSearchResultsImages(res.data.images);
          setIsLoading(false);
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
