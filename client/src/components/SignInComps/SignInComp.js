import { IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { WideFormControl } from "./AuthCard";
import { useState } from "react";

export const signInTitle = "Sign in to your account";
export const signInBtnText = "Sign In";

export default function SignInComp(props) {
    const { setPassword } = props;
    const [ values, setValues ] = useState({
        showPassword: false,
    });
    
    const handleClickShowPassword = () => {
        setValues({
            showPassword: !values.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <WideFormControl required variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
                id="password"
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                              {values.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                    </InputAdornment>
                }
                label="Password"
                onChange={(event) => setPassword(event.target.value)} />
        </WideFormControl>
    );
}