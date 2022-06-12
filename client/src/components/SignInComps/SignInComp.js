import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

export const signInTitle = "Sign in to your account";
export const signInBtnText = "Sign In";
const diffPwErrorText = "Passwords don't match";

const pwCheckResTexts = [
    "Password is valid",
    "Password is too short",
    "Password doesm't contain lower case letters",
    "Password doesn't contain upper case letters",
    "Password doesn't contain numbers",
    "Password doesn't contain special characters"
];
const pwCheckResCodes = {
    VALID: 0,
    TOO_SHORT: 1,
    NO_LOWER_CASE: 2,
    NO_UPP_CASE: 3,
    NO_NUMBERS: 4,
    NO_SPECIAL_CHARS: 5
};

export default function SignInComp(props) {
    const { id, isPwError, label, setIsPwError, setPassword, style, otherPw } = props;
    const [ showPassword, setShowPassword ] = useState(false);
    const [ pwErrorText, setPwErrorText ] = useState("");

    const validatePw = (pw) => {
        if (pw.length < 8) {
            return pwCheckResCodes.TOO_SHORT;
        }
        if (pw.search(/[a-z]/) < 0) {
            return pwCheckResCodes.NO_LOWER_CASE;
        }
        if (pw.search(/[A-Z]/) < 0) {
            return pwCheckResCodes.NO_UPP_CASE;
        }
        if (pw.search(/[0-9]/) < 0) {
            return pwCheckResCodes.NO_NUMBERS;
        }
        if (pw.search(/[!@#$%^&*]/) < 0) {
            return pwCheckResCodes.NO_SPECIAL_CHARS;
        }
        return pwCheckResCodes.VALID;
    }

    const handlePasswordChange = (event) => {
        const thisPw = event.target.value;
        setPassword(thisPw);
        if (typeof(otherPw) === 'string') {
            const pwCheckResult = validatePw(thisPw);
            if (pwCheckResult === pwCheckResCodes.VALID) {
                if (thisPw === otherPw) {
                    setIsPwError(false);
                    setPwErrorText("");
                    setPassword(thisPw);
                } else {
                    setPwErrorText(diffPwErrorText);
                    setIsPwError(true);
                }
            } else {
                setPwErrorText(pwCheckResTexts[pwCheckResult]);
                setIsPwError(true);
            }
        }
    }
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <FormControl error={isPwError} required variant="outlined" style={style}>
            <InputLabel htmlFor={ id || "password" }>{ label || "Password" }</InputLabel>
            <OutlinedInput
                id={ id || "password" }
                type={showPassword ? "text" : "password"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                    </InputAdornment>
                }
                label={ label || "Password" }
                onChange={handlePasswordChange} />
            {isPwError && <FormHelperText id={id + "-helper"}>{pwErrorText}</FormHelperText>}
        </FormControl>
    );
}