import { Button } from "@mui/material";
import styled from "styled-components";

const MyButton = styled(Button)`
  min-height: 35px;
  height: ${(props) => props.height ?? `auto`};
  width: ${(props) => props.width ?? `max-content`};
  border-radius: 25px;
  font-size: 12px;
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
function ButtonComponent(props) {
  return (
    <MyButton
      onClick={props.onClick}
      state={props.state}
      disabled={props.disabled}
      type={props.type ?? "button"}
      width={props.setWidth}
      height={props.setHeight}
      size={props.size ?? "medium"}
    >
      {props.text}
    </MyButton>
  );
}

export default ButtonComponent;
