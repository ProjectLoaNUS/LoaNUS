import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { theme } from "../../Theme";
import { BACKEND_URL } from "../../../database/const";
import { SEARCH_LISTINGS } from "../../../pages/routes";
import DetailsDialog from "../../ItemDetails/DetailsDialog";
import { Buffer } from "buffer";
import Loading from "../../../assets/loading.svg";
import NoImage from "../../../assets/no-image.png";
import { CATEGORIES } from "../../NewItem/ItemCategories";
import {
  borrowAction,
  deleteListingAction,
  isUserListingRelated,
} from "../../ItemDetails/detailsDialogActions";
import { useAuth } from "../../../database/auth";
import UserDisplay from "./UserDisplay";

const ContrastIconBtn = styled(IconButton)``;
const MainContainer = styled.div`
  width: 100%;
  height: 100%;
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
  const [finalSearch, setFinalSearch] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
    } else {
      (async () => {
        const url = `${BACKEND_URL}/api/searchUser`;
        axios
          .get(url, {
            params: {
              name: queryText,
            },
          })
          .then((res) => {
            setSearchResults(res.data.results);
            console.log(res.data.results);
            setLoading(false);
          })
          .catch((err) => console.log(err, "error occured"));
      })();
    }
  }, [queryText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText) {
      setFinalSearch(searchResults);
    }
  };

  const onClickResult = async (event, newValue, reason) => {
    if (reason === "selectOption") {
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
        options={searchResults}
        getOptionLabel={(result) => result.name}
        onChange={onClickResult}
        onKeyDown={onEnterKey}
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
      />
      <UserDisplay users={finalSearch}></UserDisplay>
    </MainContainer>
  );
}
