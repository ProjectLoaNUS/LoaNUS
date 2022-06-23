import { Autocomplete, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { react, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SearchResults from "../SearchResults/SearchResults";
import { CentredGrowDiv } from "../FlexDiv";
import { theme } from '../Theme';
import { BACKEND_URL } from "../../database/const";
import { SEARCH_LISTINGS } from "../../pages/routes";

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

const StyledSearchField = styled((props) => (
    <TextField {...props} />
  ))(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        color: theme.palette.primary.contrastText, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&.Mui-focused': {
            boxShadow: `${alpha(theme.palette.secondary.main, 0.25)} 0 0 0 2px`,
            backgroundColor: theme.palette.primary.dark
        },
        '&:hover': {
            backgroundColor: '#354657'
        },
        '& fieldset': {
          border: `1px solid ${theme.palette.primary.contrastText}`, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
          borderRadius: 4,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.secondary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.secondary.main, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        },
    },
    '& label': {
      color: theme.palette.primary.contrastText // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.contrastText // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    }
  })
);

export default function SearchTextField() {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
    } else {
      (async () => {
        const url = `${BACKEND_URL}/search`;
        axios
          .get(url, {
            params: {
              name: queryText,
              isFullSearch: false
            },
          })
          .then((res) => {
            setSearchResults(res.data.results);
            setLoading(false);
          })
          .catch((err) => console.log(err, "error occured"));
      })();
      console.log(searchResults);
    }
  }, [queryText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText) {
      navigate(SEARCH_LISTINGS, {state: {queryText: queryText}});
    }
  };

  const onChangeSearchField = (event) => {
    setLoading(true);
    setQueryText(event.target.value);
  }

  console.log(queryText);
  return (
      <Autocomplete
        freeSolo
        fullWidth
        disableClearable
        id="search"
        loading={loading}
        options={searchResults.map((result) => result.title)}
        renderInput={(params) => {
          return (
            <StyledSearchField
              {...params}
              fullWidth
              onChange={onChangeSearchField}
              variant="outlined"
              label="Search"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <ContrastIconBtn onClick={handleSubmit}>
                      <SearchIcon />
                    </ContrastIconBtn>
                ),
              }} />
          )
        }} />
  );
}
