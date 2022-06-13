import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

const label = "Item Description";

export default function DescriptionField(props) {
    const { setDescription } = props;

    return (
        <FormControl required variant="outlined">
            <InputLabel htmlFor="description">{ label }</InputLabel>
            <OutlinedInput
                required
                id="description"
                variant="outlined"
                label={ label }
                placeholder="e.g. Newly bought(3 weeks ago), rarely used since I usually mop my dorm room floor instead"
                multiline={true}
                minRows={3}
                onChange={(event) => setDescription(event.target.value)} />
        </FormControl>
    );
}