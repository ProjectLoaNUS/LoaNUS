import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function ReturnDateField(props) {
    const { returnDate, setReturnDate, isDateError, setIsDateError } = props;

    const handleChangeDate = (newDate) => {
        const dateNow = new Date();
        if (newDate < dateNow) {
            setIsDateError(true);
        } else {
            setIsDateError(false);
        }
        setReturnDate(newDate);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Set Return Deadline"
              inputFormat="dd/MM/yyyy"
              value={returnDate}
              onChange={handleChangeDate}
              renderInput={(params) => <TextField {...params} error={isDateError} helperText={ isDateError ? "Date is invalid(in the past)" : null } />}
            />
        </LocalizationProvider>
    );
}