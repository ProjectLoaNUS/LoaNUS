import ItemList from "../../ItemList/ItemList";
import styled from "styled-components";

const RequestsGrid = styled.div`
  --grid-layout-gap: 1ch;
  --grid-column-count: 4;
  --grid-item--min-width: 210px;

  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
  --grid-item-width: max(var(--grid-item--min-width), var(--grid-item--max-width));

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 2 / 3);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  height: 100%;
  overflow-y: auto;
`;

export default function YourRequests(props) {
    const {
      isLoading,
      requests,
      setRequests,
      deleteRequestAction
    } = props;

    return (
        <ItemList
          ListContainer={RequestsGrid}
          isLoading={isLoading}
          buttonText="Delete request"
          noItemsText="No item requests yet. Create one?"
          itemDatas={requests}
          setItemDatas={setRequests}
          isOwnerOnClickAction={deleteRequestAction}
          isOwnerButtonText="Delete request" />
    );
}