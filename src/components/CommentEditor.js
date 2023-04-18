import {
    Button,
    Card,
    Stack,
    TextField,
    Typography,
    IconButton,
  } from "@mui/material";
  import { Box } from "@mui/system";
  import React, { useState } from "react";
  import { Link, useNavigate, useParams } from "react-router-dom";
  import { createComment } from "../api/posts";
  import { isLoggedIn } from "../helpers/authHelper";
  import ErrorAlert from "./ErrorAlert";
  import HorizontalStack from "./util/HorizontalStack";
  import { MdHelpOutline } from "react-icons/md";
  import { BiMessageSquareAdd } from "react-icons/bi";
  
  const CommentEditor = ({ label, comment, addComment, setReplying }) => {
    const [formData, setFormData] = useState({
      content: "",
    });
  
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const params = useParams();
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const body = {
        ...formData,
        parentId: comment && comment._id,
      };
  
      setLoading(true);
      const data = await createComment(body, params, isLoggedIn());
      setLoading(false);
  
      if (data.error) {
        setError(data.error);
      } else {
        formData.content = "";
        setReplying && setReplying(false);
        addComment(data);
      }
    };
  
    const handleFocus = (e) => {
      !isLoggedIn() && navigate("/login");
    };
  
    return (
      <Card variant="outlined">
        <Stack spacing={2}>
          <HorizontalStack justifyContent="space-between">
            <Typography variant="h5">
              {comment ? <>Reply</> : <>Comment</>}
            </Typography>
            <IconButton component={Link} to={"https://commonmark.org/help/"}>
              <MdHelpOutline />
              </IconButton>
          </HorizontalStack>
  
          <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexGrow: 1, m: 3, p: 2}} >
            <TextField
              multiline
              fullWidth
              placeholder={label}
              minRows={1}
              maxRows={4}
              required
              name="content"
              onChange={handleChange}
              onFocus={handleFocus}
              value={formData.content}
            />
  
            <ErrorAlert error={error} sx={{ my: 4 }} />
            <IconButton type="submit">
              <BiMessageSquareAdd />
            </IconButton>
          </Box>
        </Stack>
      </Card>
    );
  };
  
  export default CommentEditor;