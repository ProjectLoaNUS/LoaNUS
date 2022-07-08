import LoadingItemCard from "./LoadingItemCard";

export default function LoadingItemList(props) {
    const numOfItems = props.numOfItems || 3;
    const { CardContainer, isItemRequest } = props;

    return (
        [...Array(numOfItems)].map((item, index) => {
            if (CardContainer) {
                return <CardContainer key={index}><LoadingItemCard isItemRequest={isItemRequest} /></CardContainer>
            }
            return <LoadingItemCard key={index} isItemRequest={isItemRequest} />
        })
    );
}