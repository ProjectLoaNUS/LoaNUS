import { IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { SignInFormControl } from "./AuthCard";
import { useState } from "react";
import styled, {keyframes} from "styled-components";

export const signInTitle = "Sign in to your account";
export const signInBtnText = "Sign In";

export default function SignInComp(props) {
    const { setPassword, style } = props;
    const [ showPassword, setShowPassword ] = useState(false);
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <SignInFormControl required variant="outlined" style={style}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
                id="password"
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
                label="Password"
                onChange={(event) => setPassword(event.target.value)} />
        </SignInFormControl>
    );
}