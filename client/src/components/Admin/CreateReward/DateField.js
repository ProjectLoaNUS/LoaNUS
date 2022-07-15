import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function DateField(props) {
    const { date, setDate, isFormError, setIsFormError, fullWidth } = props;

    const handleChangeDate = (newDate) => {
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);
        if (newDate < dateNow) {
            setIsFormError(true);
        } else {
            setIsFormError(false);
        }
        setDate(newDate);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Expiry Date"
              inputFormat="dd/MM/yyyy"
              value={date}
              onChange={handleChangeDate}
              renderInput={(params) => 
                <TextField
                  {...params}
                  fullWidth={fullWidth || true}
                  error={isFormError}
                  helperText={ isFormError ? "Date cannot be in the past" : null } />
              }
            />
        </LocalizationProvider>
    );
}