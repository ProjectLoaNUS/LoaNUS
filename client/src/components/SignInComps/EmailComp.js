import { WideFormControl } from "./AuthCard";
import { InputLabel, OutlinedInput } from "@mui/material";

export const emailTitle = "First enter your email"
export const emailBtnText = "Next";

export default function EmailComp(props) {
    const { setEmail } = props;

    return (
        <WideFormControl required variant="outlined">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                required
                id="email"
                variant="outlined"
                label="Email"
                onChange={(event) => setEmail(event.target.value)} />
        </WideFormControl>
    );
}