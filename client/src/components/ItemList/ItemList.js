import ItemCard from "./ItemCard";
import Loading from "../../assets/loading.svg";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";

export default function ItemList(props) {
    const { CardContainer, imageUrls, setImageUrls, texts, setTexts, buttonText, onActionDone, onClickAction } = props;

    return (
        <>
            { texts ? (texts.map((text, index) => {
                if (!text.borrowedBy) {
                    const date = new Date(text.date).toLocaleDateString({}, 
                            {year: 'numeric', month: 'short', day: 'numeric'});
                    const deadline = new Date(text.deadline).toLocaleDateString({}, 
                            {year: 'numeric', month: 'short', day: 'numeric'});
                    const category = CATEGORIES[text.category];

                    const removeItem = () => {
                        setTexts(prevTexts => {
                            return prevTexts.filter(other => other !== text);
                        });
                        if (setImageUrls) {
                            setImageUrls(prevUrls => {
                                const thisUrl = prevUrls[index];
                                return prevUrls.filter(other => other !== thisUrl);
                            });
                        }
                    }

                    function Item() {
                        return (
                            <ItemCard
                                itemId={text._id}
                                date={date}
                                imagesUrl={imageUrls && ( (imageUrls[index] !== undefined && (imageUrls[index]).length === 0) ? [NoImage] : (imageUrls[index] || [Loading]) )}
                                title={text.title}
                                owner={text.listedBy}
                                deadline={deadline}
                                category={category}
                                description={text.description}
                                location={text.location}
                                onActionDone={onActionDone || removeItem}
                                onClickAction={onClickAction}
                                buttonText={buttonText} />
                        );
                    }

                    if (CardContainer) {
                        return <CardContainer key={index}><Item/></CardContainer>
                    }
                    return <Item key={index} />
                }
            })) : 
            'Loading' }
        </>
    );
}