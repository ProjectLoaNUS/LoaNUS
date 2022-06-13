import { ReactComponent as DarkAppIcon } from "../../../assets/loanus-icon-dark.svg";
import { ReactComponent as LightAppIcon } from "../../../assets/loanus-icon-light.svg";

export default function AppIcon(props) {
    const { dark, iconStyles } = props;
    if (dark) {
        return (
            <DarkAppIcon style={iconStyles}/>
        );
    }
    return <LightAppIcon style={iconStyles}/>
}