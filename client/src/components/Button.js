import styled from "styled-components";

const Button = styled.button`
  min-height: 35px;
  height: auto;
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

  &:active {
    background: ${(props) =>
      props.state === "primary" ? "#D8E6DF" : "#8B8B8B"};
    color: #8b8b8b;
    transform: scale(0.95);
  }

  &:disabled {
    color: #bfbfbf;
    border-color: #bfbfbf;
    background: white;
  }
`;
function ButtonComponent(props) {
  return (
    <Button
      onClick={props.onClick}
      state={props.state}
      disabled={props.disabled}
      type={props.type ?? "button"}
      width={props.setWidth}
      size={props.size ?? "regular"}
    >
      {props.text}
    </Button>
  );
}

export default ButtonComponent;
