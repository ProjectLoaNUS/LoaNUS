import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export const signUpTitle = "Create an account";
export const signUpBtnText = "Sign Up";

export default function SignUpComp(props) {
    const { setName, setAge, showSignUp } = props;

    return (
        <>
            <FormControl required variant="outlined" fullWidth>
                <InputLabel htmlFor="name">Your full name</InputLabel>
                <OutlinedInput
                required={showSignUp}
                id="name"
                variant="outlined"
                label="Your full name"
                onChange={(event) => setName(event.target.value)} />
            </FormControl>
            <FormControl required variant="outlined" fullWidth>
                <InputLabel htmlFor="age">Your age</InputLabel>
                <OutlinedInput
                required
                id="age"
                variant="outlined"
                label="Your age"
                type="number"
                onChange={(event) => setAge(event.target.value)} />
            </FormControl>
        </>
    );
}