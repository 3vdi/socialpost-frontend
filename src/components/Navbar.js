import { useTheme } from "@emotion/react";
import {
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import "react-icons/ai";
import "react-icons/ri";
import {
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlineUserAdd
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/login");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };

  const handleSearchIcon = (e) => {
    setSearchIcon(!searchIcon);
  };

  return (
    <Stack mb={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          pb: 0,
        }}
        spacing={!mobile ? 2 : 0}
      >
        <IconButton component={Link} to={"/"}>
            <AiFillHome />
          </IconButton>

        {!navbarWidth && (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              size="small"
              label="Search for posts..."
              sx={{ flexGrow: 1, maxWidth: 300 }}
              onChange={handleChange}
              value={search}
            />
          </Box>
        )}

        <HorizontalStack>
          {mobile && (
            <IconButton onClick={handleSearchIcon}>
              <AiOutlineSearch />
            </IconButton>
          )}
          {user ? (
            <>
              <IconButton component={Link} to={"/messenger"}>
                <AiFillMessage />
              </IconButton>

               <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}
                color="inherit"><UserAvatar width={30} height={30} username={user.username} /></IconButton>
                <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleLogout}
              >
                <MenuItem component={Link}  to={"/users/" + username}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <IconButton component={Link} to={"/login"}>
                <AiOutlineUserAdd />
              </IconButton>
            </>
          )}
        </HorizontalStack>
      </Stack>
      {navbarWidth && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField size="small" label="Search for posts..." fullWidth onChange={handleChange} value={search}/>
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;