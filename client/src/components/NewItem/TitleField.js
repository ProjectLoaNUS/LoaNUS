import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export default function TitleField(props) {
    const { setTitle, title } = props;
    const label = "Item name";

    return (
        <FormControl required variant="outlined">
            <InputLabel htmlFor="title">{ label }</InputLabel>
            <OutlinedInput
                required
                id="title"
                variant="outlined"
                placeholder="e.g. Dyson V15 Detect vacuum cleaner"
                label={ label }
                value={ title }
                onChange={(event) => setTitle(event.target.value)} />
        </FormControl>
    );
}