import DescriptionCard from "./DescriptionCard";
import ListingPage from "../assets/LoanusItemListing.png";
import ItemDetails from "../assets/LoanusItemDetailsDialog.png";

export default function AboutLoanus() {
  const imgs = [ListingPage, ItemDetails];

  return (
    <DescriptionCard
      title="Welcome to LoaNUS"
      para1="Through LoaNUS, request for an item you need or list items for others to borrow! Scroll to the right for a quick preview       "
      para2="Search for an item using the search bar at the top of this page, click on a suggested result or complete your search to find out more - category, return deadline, meetup location and all that"
      para3="Chat with online friends and claim rewards with points earned! Browse recommendations catered for you"
      para4="Thank you for using LoaNUS and hope this platform helps you find what you're looking for! Sign up to continue!"
      imgs={imgs}
    ></DescriptionCard>
  );
}
