import { Box, Button, Card, CardMedia, FormControl, FormHelperText, Grow, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import styled from "styled-components";
import { theme } from "../../Theme";
import { TransitionGroup } from 'react-transition-group';
import { useState } from "react";

const ImageCard = styled(Card)`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  width: max(40%, 300px);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: visible;
  & .MuiCardActionArea-root {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    align-items: stretch;
    justify-content: center;
    & .MuiCardMedia-root {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  & .MuiCardActions-root {
    align-self: stretch;
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    justify-content: space-between;
  }
`;
const MyIconButton = styled(IconButton)`
  padding: 0;
  position: absolute;
  right: -7px;
  top: -7px;
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.primary.contrastText};

  &:hover {
    background-color: ${theme.palette.primary.light};
  }
`;
const ImageDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  img {
    min-height: 0;
    object-fit: contain;
  }
`;
const HiddenInput = styled.input`
  display: none;
`;

export default function RedemptionMethod(props) {
    const {isFormError, setIsFormError, redeemUrl, setRedeemUrl, qrCode, setQrCode, qrCodeRef} = props;
    const [ helperText, setHelperText ] = useState("");
    const label = "How to redeem";
    const placeholder = "Insert a redemption URL and/or qr code";
    
    const onChangeUrl = async (event) => {
        const input = event.target.value;
        setRedeemUrl(input);
        let url;
        try {
            url = new URL(input);
            setIsFormError(false);
            setHelperText("");
            setRedeemUrl(input);
        } catch (err) {
            setIsFormError(true);
            setHelperText("Invalid URL");
        }
    };
    const getImgUrl = (img) => {
        if (img) {
          return URL.createObjectURL(img);
        }
        return "";
    };
    const handleChooseQrCode = () => {
        qrCodeRef.current.click();
    };
    const onQrCodeChosen = async (event) => {
        const files = event.target.files;
        if (files?.length) {
            setQrCode(files[0]);
        }
    };
    const rmQrCode = async () => {
        qrCodeRef.current.value = null;
        setQrCode(null);
    };

    return (
        <>
            <FormControl fullWidth focused variant="outlined">
                <InputLabel htmlFor="redeem">{label}</InputLabel>
                <OutlinedInput
                  id="redeem"
                  error={!!helperText}
                  label={label}
                  onChange={onChangeUrl}
                  placeholder={placeholder}
                  value={redeemUrl}
                  endAdornment={
                    <InputAdornment position="end">
                        <Button sx={{padding: "16.5px 0"}} onClick={handleChooseQrCode}>
                            <UploadFileIcon />
                        </Button>
                    </InputAdornment>
                  }
                  sx={{paddingRight: 0, display: "flex"}} />
                { helperText &&
                    <FormHelperText error={!!helperText}>{helperText}</FormHelperText>
                }
            </FormControl>
            <TransitionGroup>
                { qrCode &&
                    <Grow in={!!qrCode} style={{transformOrigin: "center top"}} timeout={750}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <ImageCard>
                                <MyIconButton
                                  size="small"
                                  color="primary"
                                  variant="filled"
                                  onClick={rmQrCode} >
                                    <CloseIcon fontSize="inherit" />
                                </MyIconButton>
                                <ImageDiv>
                                    <CardMedia
                                      component="img"
                                      image={getImgUrl(qrCode)}
                                      alt="Reward image" />
                                </ImageDiv>
                            </ImageCard>
                            <Typography variant="subtitle2" align="center">Your Redemption QR Code</Typography>
                        </Box>
                    </Grow>
                }
            </TransitionGroup>
            <HiddenInput
              type="file"
              id="choose-qrcode"
              accept="image/gif,image/jpeg,image/png,image/svg+xml"
              onChange={onQrCodeChosen}
              ref={qrCodeRef}
            />
        </>
    );
}