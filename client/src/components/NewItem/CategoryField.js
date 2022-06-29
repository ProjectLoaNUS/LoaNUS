import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import { CATEGORIES } from './ItemCategories';

export default function CategoryField(props) {
    const { category, setCategory } = props;

    const onChangeCategory = (event) => {
        setCategory(event.target.value);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="category-label">Item Category</InputLabel>
            <Select 
              labelId="category-label"
              id="category-select"
              value={category}
              label="Item Category"
              onChange={onChangeCategory}
              MenuProps={{ 
                sx: {
                    '& .MuiPopover-paper': {
                        maxHeight: '50%'
                    }
                } 
              }}>
                  {CATEGORIES.map((category, index) => {
                      return <MenuItem key={index} value={index}>{category}</MenuItem>
                  })}
            </Select>
        </FormControl>
    );
}