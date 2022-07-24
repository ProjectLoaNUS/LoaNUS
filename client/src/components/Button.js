import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from '@mui/icons-material/Save';
import { Button } from "@mui/material";
import styled from "styled-components";

const MyButton = styled(Button)`
  min-height: 35px;
  height: ${(props) => props.height ?? `auto`};
  width: ${(props) => props.width ?? `max-content`};
  border-radius: 25px;
  font-size: ${(props) => props.setfontsize ?? `12`};
  border: solid 0.1rem transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(to left, #2d3c4a, #2d3c4a);
  box-shadow: ${(props) =>
    props.state === "primary" ? `0px` : `2px 1000px 1px #fff inset`};
  color: ${(props) => (props.state === "primary" ? `white` : `#2d3c4a`)};
  padding: ${(props) => (props.size === "small" ? `7px 14px` : `16px 30px`)};
  line-height: 1px;
  white-space: nowrap;

  &:disabled {
    color: #bfbfbf;
    border-color: #bfbfbf;
    background: white;
  }
`;
const MyLoadingButton = styled(LoadingButton)`
  min-height: 35px;
  height: ${(props) => props.height ?? `auto`};
  width: ${(props) => props.width ?? `max-content`};
  border-radius: 25px;
  font-size: ${(props) => props.setfontsize ?? `12`};
  border: solid 0.1rem transparent;
  box-shadow: ${(props) =>
    props.state === "primary" ? `0px` : `2px 1000px 1px #fff inset`};
  padding: ${(props) => (props.size === "small" ? `7px 14px` : `16px 30px`)};
  line-height: 1px;
  white-space: nowrap;
`;
function ButtonComponent(props) {
  if (props.loading) {
    return (
      <MyLoadingButton
        loading
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant={props.variant}
        state={props.state}
        type={props.type ?? "button"}
        width={props.setWidth}
        height={props.setHeight}
        size={props.size ?? "medium"}
        setfontsize={props.setFontsize}
      >
        {props.text}
      </MyLoadingButton>
    );
  }
  return (
    <MyButton
      onClick={props.onClick}
      state={props.state}
      disabled={props.disabled}
      type={props.type ?? "button"}
      width={props.setWidth}
      height={props.setHeight}
      size={props.size ?? "medium"}
      setfontsize={props.setFontsize}
    >
      {props.text}
    </MyButton>
  );
}

export default ButtonComponent;
