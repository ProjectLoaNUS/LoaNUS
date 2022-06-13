import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

export default function TelegramField(props) {
    const { setTelegramHandle } = props;
    const label = "Your Telegram handle";

    return (
        <FormControl required variant="outlined">
            <InputLabel htmlFor="telegram">{ label }</InputLabel>
            <OutlinedInput
                required
                id="telegram"
                variant="outlined"
                placeholder="e.g. @HelpfulNusStudent"
                label={ label }
                onChange={(event) => setTelegramHandle(event.target.value)} />
        </FormControl>
    );
}