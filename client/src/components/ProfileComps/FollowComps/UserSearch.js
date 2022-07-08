import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import axios from "axios";
import styled from "styled-components";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { BACKEND_URL } from "../../../database/const";
import { useAuth } from "../../../database/auth";
import UserDisplay from "./UserDisplay";

const ContrastIconBtn = styled(IconButton)``;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const StyledSearchField = styled((props) => <TextField {...props} />)(
  ({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      color: theme.palette.primary.contrastText, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
      transition: theme.transitions.create([
        "border-color",
        "background-color",
        "box-shadow",
      ]),
      "&.Mui-focused": {
        boxShadow: `${alpha(theme.palette.secondary.main, 0.25)} 0 0 0 2px`,
        backgroundColor: theme.palette.primary.dark,
      },
      "&:hover": {
        backgroundColor: "#354657",
      },
      "& fieldset": {
        border: `1px solid ${theme.palette.primary.contrastText}`, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        borderRadius: 4,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.secondary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
      },
    },
    "& label": {
      color: theme.palette.primary.contrastText, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
    "& label.Mui-focused": {
      color: theme.palette.primary.contrastText, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
  })
);

export default function SearchUserField() {
  const [queryText, setQueryText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ isFinalSearch, setIsFinalSearch ] = useState(false);
  const [finalSearch, setFinalSearch] = useState(null);
  const [ open, setOpen ] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
    } else {
      (async () => {
        const url = `${BACKEND_URL}/api/user/search`;
        axios
          .get(url, {
            params: {
              name: queryText,
            },
          })
          .then((res) => {
            const results = res.data.results.filter(result => result._id !== user.id);
            setSearchResults(results);
            if (isFinalSearch) {
              setFinalSearch(results);
              setIsFinalSearch(false);
            }
            setLoading(false);
          })
          .catch((err) => console.log("Error occurred: " + err));
      })();
    }
  }, [queryText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText) {
      setFinalSearch(searchResults);
      setOpen(false);
    }
  };

  const onClickResult = async (event, newValue, reason) => {
    if (reason === "selectOption") {
      setFinalSearch(null);
      setIsFinalSearch(true);
      setQueryText(newValue.name);
      setOpen(false);
    }
  };

  const onEnterKey = (event) => {
    if (event.key === 'Enter') {
      // Prevent MUI's default 'Enter' key behavior.
      event.defaultMuiPrevented = true;
      // Same action as clicking the search icon button: View full list of results
      handleSubmit(event);
    }
  }

  const onChangeSearchField = (event) => {
    const value = event.target.value;
    if (value) {
      setLoading(true);
    }
    setQueryText(event.target.value);
  };

  return (
    <MainContainer>
      <Autocomplete
        freeSolo
        fullWidth
        disableClearable
        filterOptions={(x) => x}
        id="search"
        loading={loading}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        options={searchResults}
        getOptionLabel={(result) => result.name}
        onChange={onClickResult}
        onKeyDown={onEnterKey}
        sx={{paddingTop: "1em"}}
        renderInput={(params) => {
          return (
            <TextField
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
              }}
            />
          );
        }}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.name, inputValue, { insideWords: true });
          const parts = parse(option.name, matches);
  
          return (
            <li {...props}>
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
      />
      <UserDisplay queryText={queryText} users={finalSearch}></UserDisplay>
    </MainContainer>
  );
}
