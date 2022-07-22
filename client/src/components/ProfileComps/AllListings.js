import ItemList from "../ItemList/ItemList";

export default function AllListings(props) {
  const {listingTexts, setListingTexts, listingImgs, isLoading} = props;

  return (
    <ItemList
      isLoading={isLoading}
      noItemsText="No item listings yet. Create one?"
      itemImages={listingImgs}
      itemDatas={listingTexts}
      setItemDatas={setListingTexts}
    />
  );
}
