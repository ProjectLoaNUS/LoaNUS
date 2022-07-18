import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function CategoryField(props) {
    const {category, setCategory} = props;
    const label = "Category";

    const onChangeCategory = async (event) => {
        setCategory(event.target.value);
    }

    return (
        <FormControl fullWidth required>
            <InputLabel id="category-label">{label}</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              label={label}
              value={category}
              onChange={onChangeCategory}
              >
                <MenuItem value="Vouchers">Vouchers</MenuItem>
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
            </Select>
        </FormControl>
    )
}