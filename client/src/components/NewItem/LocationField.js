
const label = "Preferred Meetup Location(s)";

export default function LocationField(props) {
    const { setLocation } = props;

    return (
        <FormControl required variant="outlined">
            <InputLabel htmlFor="location">{ label }</InputLabel>
            <OutlinedInput
                required
                id="location"
                variant="outlined"
                label={ label }
                onChange={(event) => setLocation(event.target.value)} />
        </FormControl>
    );
}