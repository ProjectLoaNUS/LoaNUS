import { InputLabel, OutlinedInput } from "@mui/material";
import { SignUpFormControl, WideFormControl } from "./AuthCard";

export const signUpTitle = "Create an account";
export const signUpBtnText = "Sign Up";

export default function SignUpComp(props) {
    const { setName, setAge } = props;

    return (
        <>
            <SignUpFormControl required variant="outlined">
                <InputLabel htmlFor="name">Your full name</InputLabel>
                <OutlinedInput
                  required
                  id="name"
                  variant="outlined"
                  label="Your full name"
                  onChange={(event) => setName(event.target.value)} />
            </SignUpFormControl>
            <SignUpFormControl required variant="outlined">
                <InputLabel htmlFor="age">Your age</InputLabel>
                <OutlinedInput
                  required
                  id="age"
                  variant="outlined"
                  label="Your age"
                  onChange={(event) => setAge(event.target.value)} />
            </SignUpFormControl>
        </>
    );
}