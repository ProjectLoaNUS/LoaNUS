import {
  Box,
  Button,
  Card,
  CardMedia,
  FormControl,
  FormHelperText,
  Grow,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import styled from "styled-components";
import { theme } from "../../../utils/Theme";
import { TransitionGroup } from "react-transition-group";
import { useState } from "react";

const MyTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
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
  const {
    isFormError,
    setIsFormError,
    redeemUrl,
    setRedeemUrl,
    qrCode,
    setQrCode,
    qrCodeRef,
    isError,
    setIsError,
  } = props;
  const [helperText, setHelperText] = useState("");
  const label = "How to redeem";
  const placeholder = "Insert a redemption URL and/or qr code";

  const setError = async (isError, helperText) => {
    setIsError(isError);
    setIsFormError(isError);
    setHelperText(helperText);
  };
  const onChangeUrl = async (event) => {
    const input = event.target.value;
    setRedeemUrl(input);
    if (input) {
      let url;
      try {
        url = new URL(input);
        setError(false, "");
        setRedeemUrl(input);
      } catch (err) {
        setError(true, "Invalid URL");
      }
    } else {
      if (!qrCode) {
        setError(true, "Required field");
      }
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
      if (!redeemUrl) {
        setError(false, "");
      }
    }
  };
  const rmQrCode = async () => {
    qrCodeRef.current.value = null;
    setQrCode(null);
    if (!redeemUrl) {
      setError(true, "Required field");
    }
  };

  return (
    <>
      <FormControl error={isError} fullWidth focused variant="outlined">
        <InputLabel htmlFor="redeem">{label}</InputLabel>
        <OutlinedInput
          id="redeem"
          label={label}
          onChange={onChangeUrl}
          placeholder={placeholder}
          value={redeemUrl}
          endAdornment={
            <InputAdornment position="end">
              <MyTooltip TransitionComponent={Zoom} title="Upload QR Code">
                <Button
                  sx={{ padding: "16.5px 0" }}
                  onClick={handleChooseQrCode}
                >
                  <UploadFileIcon />
                </Button>
              </MyTooltip>
            </InputAdornment>
          }
          sx={{ paddingRight: 0, display: "flex" }}
        />
        {helperText && (
          <FormHelperText error={!!helperText}>{helperText}</FormHelperText>
        )}
      </FormControl>
      <TransitionGroup>
        {qrCode && (
          <Grow style={{ transformOrigin: "center top" }} timeout={750}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <ImageCard>
                <MyIconButton
                  size="small"
                  color="primary"
                  variant="filled"
                  onClick={rmQrCode}
                >
                  <CloseIcon fontSize="inherit" />
                </MyIconButton>
                <ImageDiv>
                  <CardMedia
                    component="img"
                    image={getImgUrl(qrCode)}
                    alt="Reward image"
                  />
                </ImageDiv>
              </ImageCard>
              <Typography variant="subtitle2" align="center">
                Your Redemption QR Code
              </Typography>
            </Box>
          </Grow>
        )}
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
