import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from '../Theme';
import { BACKEND_URL } from "../../database/const";
import { SEARCH_LISTINGS } from "../../pages/routes";
import DetailsDialog from "../ItemDetails/DetailsDialog";
import { Buffer } from 'buffer';
import Loading from "../../assets/loading.svg";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";

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

  const removeResult = () => {
    setSearchResults((prevResults) => {
      return prevResults.filter((result) => (result._id !== clickResult._id));
    });
  }

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
            setSearchResults(res.data.results.filter((item) => !item.borrowedBy));
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

    const imgsToUrls = async (images) => {
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

    const processResult = async (rawResult) => {
      let result = {
        _id: rawResult._id,
        title: rawResult.title,
        description: rawResult.description,
        location: rawResult.location,
        telegram: rawResult.telegram,
        userName: rawResult.userName,
        borrwedBy: rawResult.borrowedBy
      }
      result.category = CATEGORIES[rawResult.category];
      result.deadline = new Date(rawResult.deadline).toLocaleDateString({}, 
        {year: 'numeric', month: 'short', day: 'numeric'});
      result.date = new Date(rawResult.date).toLocaleDateString({}, 
        {year: 'numeric', month: 'short', day: 'numeric'});
      setClickResult(result);
    }

    if (reason === "selectOption") {
      event.defaultMuiPrevented = true;

      axios
        .get(`${BACKEND_URL}/api/search-exact`, {
          params: {
            id: newValue._id
          },
        })
        .then((res) => {
          imgsToUrls(res.data.result.images);
          processResult(res.data.result);
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
        options={searchResults}
        getOptionLabel={result => result.title}
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
        itemId={clickResult && clickResult._id}
        date={clickResult && clickResult.date}
        userName={clickResult && clickResult.userName}
        title={clickResult && clickResult.title}
        imageUrls={(clickResultImgs !== undefined && (clickResultImgs).length === 0) ? [NoImage] : (clickResultImgs || [Loading])}
        category={clickResult && clickResult.category}
        description={clickResult && clickResult.description}
        location={clickResult && clickResult.location}
        telegram={clickResult && clickResult.telegram}
        deadline={clickResult && clickResult.deadline}
        open={open}
        setOpen={setOpen}
        removeItem={clickResult && removeResult} />
    </>
  );
}
