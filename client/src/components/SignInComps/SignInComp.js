import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

export const signInTitle = "Sign in to your account";
export const signInBtnText = "Sign In";

export default function SignInComp(props) {
    const { handleChangePassword, id, isPwError, pwErrHelperText, label, setPassword, style } = props;
    const [ showPassword, setShowPassword ] = useState(false);

    const handleChangePasswordSignIn = (event) => {
        setPassword(event.target.value);
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
                onChange={handleChangePassword || handleChangePasswordSignIn} />
            {isPwError && <FormHelperText id={id + "-helper"}>{pwErrHelperText}</FormHelperText>}
        </FormControl>
    );
}