import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

export default function DateField(props) {
    const { date, setDate, isFormError, setIsFormError, fullWidth } = props;
    const [ helperText, setHelperText ] = useState("");

    const handleChangeDate = (newDate) => {
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);
        if (newDate < dateNow) {
            setIsFormError(true);
            setHelperText("Date cannot be in the past");
        } else {
            setIsFormError(false);
            setHelperText("");
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
                  error={!!helperText}
                  helperText={helperText} />
              }
            />
        </LocalizationProvider>
    );
}