import DescriptionCard from "./DescriptionCard";
import ListingPage from "../assets/LoanusItemListing.png";
import ItemDetails from "../assets/LoanusItemDetailsDialog.png";

export default function AboutLoanus() {
    const imgs = [ListingPage, ItemDetails];

    return (
        <DescriptionCard
          title="Welcome to LoaNUS"
          desc="Through LoaNUS, request for an item you need or list items for others to borrow! Search for an item using the search bar at the top of this page, and click on an item card to find out more - category, return deadline, meetup location and all that. Thank you for using LoaNUS and hope this platform helps you find what you're looking for!"
          imgs={imgs}>
        </DescriptionCard>
    )
}