import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function ReturnDateField(props) {
    const { returnDate, setReturnDate } = props;

    const handleChangeDate = (newDate) => {
        setReturnDate(newDate);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Set Return Deadline"
              inputFormat="dd/MM/yyyy"
              value={returnDate}
              onChange={handleChangeDate}
              renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}