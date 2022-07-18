import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export default function MyTextField(props) {
    const {
      id,
      text,
      setText,
      fullWidth,
      type,
      label,
      minRows,
      multiline,
      placeholder
    } = props;

    const onChangeText = (event) => {
        setText(event.target.value);
    };

    return (
        <FormControl fullWidth={fullWidth || true} required variant="outlined">
            <InputLabel htmlFor={id}>{ label }</InputLabel>
            <OutlinedInput
              id={id}
              required
              variant="outlined"
              type={type}
              label={label}
              onChange={ onChangeText }
              placeholder={placeholder}
              minRows={minRows}
              multiline={multiline}
              value={ text } />
        </FormControl>
    );
}