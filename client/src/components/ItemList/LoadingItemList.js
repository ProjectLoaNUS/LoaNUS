import LoadingItemCard from "./LoadingItemCard";

export default function LoadingItemList(props) {
    const numOfItems = props.numOfItems || 3;
    const { isItemRequest } = props;

    return (
        [...Array(numOfItems)].map((item, index) => {
            return <LoadingItemCard key={index} isItemRequest={isItemRequest} />
        })
    );
}