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
import DetailsDialog from "../ItemDetails/DetailsDialog";
import { Buffer } from 'buffer';

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
  const [clickResult, setClickResult] = useState({});
  const [clickResultImgs, setClickResultImgs] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
    } else {
      (async () => {
        const url = `${BACKEND_URL}/api/search`;
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
    }
  }, [queryText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText) {
      navigate(SEARCH_LISTINGS, {state: {queryText: queryText}});
    }
  };

  const onClickResult = async (event, newValue, reason) => {

    async function imgsToUrls(images) {
      let imgs = [];
      const bins = images.data;
      bins.forEach((bin, index) => {
        const binary = Buffer.from(bin);
        const blob = new Blob([binary.buffer], {type: images.contentType[index]});
        const url = URL.createObjectURL(blob);
        imgs[index] = url;
      });
      setClickResultImgs(imgs);
    }

    if (reason === "selectOption") {
      event.defaultMuiPrevented = true;
      axios
        .get(`${BACKEND_URL}/api/search-exact`, {
          params: {
            name: newValue
          },
        })
        .then((res) => {
          imgsToUrls(res.data.result.images);
          setClickResult(res.data.result);
        })
        .catch((err) => console.log(err, "error occured"));
      setOpen(true);
    }
  }

  const onChangeSearchField = (event) => {
    const value = event.target.value;
    if (value) {
      setLoading(true);
    }
    setQueryText(event.target.value);
  }

  return (
    <>
      <Autocomplete
        freeSolo
        fullWidth
        disableClearable
        filterOptions={(x) => x} 
        id="search"
        loading={loading}
        options={searchResults.map((result) => result.title)}
        onChange={onClickResult}
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
      <DetailsDialog
        date={clickResult && clickResult.date}
        userName={clickResult && clickResult.userName}
        title={clickResult && clickResult.title}
        imageUrls={clickResultImgs}
        category={clickResult && clickResult.category}
        description={clickResult && clickResult.description}
        location={clickResult && clickResult.location}
        telegram={clickResult && clickResult.telegram}
        deadline={clickResult && clickResult.deadline}
        open={open}
        setOpen={setOpen} />
    </>
  );
}
