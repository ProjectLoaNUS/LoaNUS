import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";

export const emailTitle = "First enter your email"
export const emailBtnText = "Next";

export default function EmailComp(props) {
    const { setEmail, isEmailError, setIsEmailError } = props;
    const invalidEmailText = "Invalid email address";

    const isValidEmail = (email) => {
        const emailRegex = "(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
        if (!!email && email.match(emailRegex)) {
            return true;
        }
        return false;
    }
    const handleEmailChange = (event) => {
        const email = event.target.value;
        if (isValidEmail(email)) {
            setIsEmailError(false);
            setEmail(email);
        } else {
            setIsEmailError(true);
        }
    }

    return (
        <FormControl error={isEmailError} required variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
                required
                id="email"
                variant="outlined"
                label="Email"
                onChange={handleEmailChange} />
            { isEmailError && (<FormHelperText>{ invalidEmailText }</FormHelperText>)}
        </FormControl>
    );
}