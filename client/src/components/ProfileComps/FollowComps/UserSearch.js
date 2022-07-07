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
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [finalSearch, setFinalSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickResult, setClickResult] = useState({});
  const [clickResultImgs, setClickResultImgs] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isOwner = isUserListingRelated(user, clickResult);

  const removeResult = () => {
    setSearchResults((prevResults) => {
      return prevResults.filter((result) => result._id !== clickResult._id);
    });
  };

  const getResultAction = () => {
    if (isOwner) {
      return deleteListingAction;
    } else {
      return borrowAction;
    }
  };

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
    const imgsToUrls = async (images) => {
      let imgs = [];
      const bins = images.data;
      bins.forEach((bin, index) => {
        const binary = Buffer.from(bin);
        const blob = new Blob([binary.buffer], {
          type: images.contentType[index],
        });
        const url = URL.createObjectURL(blob);
        imgs[index] = url;
      });
      setClickResultImgs(imgs);
    };

    const processResult = async (rawResult) => {
      let result = {
        _id: rawResult._id,
        title: rawResult.title,
        description: rawResult.description,
        location: rawResult.location,
        listedBy: rawResult.listedBy,
        borrowedBy: rawResult.borrowedBy,
      };
      result.category = CATEGORIES[rawResult.category];
      result.deadline = new Date(rawResult.deadline).toLocaleDateString(
        {},
        { year: "numeric", month: "short", day: "numeric" }
      );
      result.date = new Date(rawResult.date).toLocaleDateString(
        {},
        { year: "numeric", month: "short", day: "numeric" }
      );
      setClickResult(result);
    };

    if (reason === "selectOption") {
      event.defaultMuiPrevented = true;

      axios
        .get(`${BACKEND_URL}/api/search-exact`, {
          params: {
            id: newValue._id,
          },
        })
        .then((res) => {
          imgsToUrls(res.data.result.images);
          processResult(res.data.result);
        })
        .catch((err) => console.log(err, "error occured"));
      setOpen(true);
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
