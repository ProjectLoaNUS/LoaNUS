import { IconButton, InputAdornment, TextField } from "@mui/material";
import { react, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SearchResults from "./SearchResults";
import { CentredGrowDiv } from "../FlexDiv";
import { theme } from '../Theme';
import { BACKEND_URL } from "../../database/const";

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

const Container = styled.div`
  width: 100%;
`;
const GrowTextField = styled(TextField)`
  flex: 1 0 auto;
`;

const StyledTextField = styled((props) => (
        <GrowTextField {...props} />
    ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: `1px solid ${theme.palette.primary.contrastText}`, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        borderRadius: 4,
        color: theme.palette.primary.contrastText, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&.Mui-focused': {
            borderColor: theme.palette.secondary.main, // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
            boxShadow: `${alpha(theme.palette.secondary.main, 0.25)} 0 0 0 2px`,
            backgroundColor: theme.palette.primary.dark
        },
        '&:hover': {
            borderColor: theme.palette.secondary.main,
            backgroundColor: '#354657'
        }
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.primary.contrastText // theme.palette.mode == 'light' ? theme.palette.contrast.light : theme.palette.contrast.dark
    },
  })
);

export default function SearchTextField() {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (!queryText) {
      setSearchResults([]);
    }
    (async () => {
      const url = `${BACKEND_URL}/search`;
      axios
        .get(url, {
          params: {
            name: queryText,
          },
        })
        .then((res) => {
          setSearchResults(res.data);
        })
        .catch((err) => console.log(err, "error occured"));
    })();
    console.log(searchResults);
  }, [queryText]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText) {
      navigate({
        pathname: "/search-items",
        search: `?name=${queryText}`,
      });
    }
  };
  console.log(queryText);
  return (
    <CentredGrowDiv>
      <StyledTextField
        onChange={(e) => setQueryText(e.target.value)}
        variant="filled"
        label="Search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ContrastIconBtn onClick={handleSubmit}>
                <SearchIcon />
              </ContrastIconBtn>
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
      />
      <SearchResults searchResults={searchResults}></SearchResults>
    </CentredGrowDiv>
  );
}
