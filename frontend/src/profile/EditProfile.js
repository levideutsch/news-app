import React, { useState } from "react";
import { ACCESS_TOKEN } from "../util/constants";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, Button, Typography, Container, Box, Input, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function EditProfile({ user, cardStyle, setIsEditing, isMobile, setUser}) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sexError, setSexError] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    username: user?.username || "",
    sex: user?.profile?.sex || "",
    location: user?.profile?.location || "",
    age: user?.profile?.age || 0,
    profile_photo: user?.profile?.profile_photo || null,
    x_link: user?.profile?.x_link || "",
    facebook_link: user?.profile?.facebook_link || "",
    instagram_link: user?.profile?.instagram_link || "",
    linkedin_link: user?.profile?.linkedin_link || ""
  });


  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setPhotoPreview(URL.createObjectURL(files[0]));
      // setOpen(true); // Open the dropdown when the user starts typing
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = "http://127.0.0.1:8000/api/handle-profile/";
    const token = localStorage.getItem(ACCESS_TOKEN);

    const data = new FormData();
    data.append("age", formData.age);
    data.append("location", formData.location);
    data.append("sex", formData.sex);
    data.append("x_link", formData.x_link)
    data.append("facebook_link", formData.facebook_link)
    data.append("instagram_link", formData.instagram_link)
    data.append("linkedin_link", formData.linkedin_link)

    if (formData.profile_photo !== user?.profile?.profile_photo) {
      if (formData.profile_photo instanceof File) {
        data.append("profile_photo", formData.profile_photo);
      }
    }

    data.append("email", formData.email);
    data.append("username", formData.username);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSexError(errorData.sex ? "Must Be Male, Female Or Other" : null);
        // setEmailError(errorData.email ? errorData.email : null);
        // setError(errorData.error || "An error occurred.");
        // setSuccess(null);
        console.log(errorData);
      } else {
        const updatedUser = await response.json();
        // setSuccess("Profile updated successfully!");
        console.log(updatedUser, "updated profile");
        setUser((prevUser) => ({
          ...prevUser,
          username: updatedUser.username,
          email: updatedUser.email,

          profile: {
            ...prevUser.profile,
            age: updatedUser.profile.age,
            location: updatedUser.profile.location,
            sex: updatedUser.profile.sex,
            profile_photo: updatedUser.profile.profile_photo
              ? updatedUser.profile.profile_photo
              : prevUser.profile.profile_photo,
          },
        }));
        setIsEditing(false);
      }
    } catch (err) {}
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center", color: "white", boxShadow: 20 }}>
        Edit Profile
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="profile_photo"
          name="profile_photo"
          style={{ display: "none" }} // Hide the file input
          onChange={handleChange}
        />

        {/* Label wraps around Avatar to trigger file input */}
        <label htmlFor="profile_photo">
          <Avatar
            alt="Remy Sharp"
            src={
              photoPreview
                ? photoPreview
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdd3oAEiP8bSF7hK-tONfO-VqfQ1UpmDAlGw&s"
            }
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              boxShadow: 20,
              cursor: "pointer",
            }}
          />
        </label>
        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Email</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              // required
              fullWidth
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Username</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              name="username"
              type="text"
              value={formData?.username}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Location</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="location"
              name="location"
              type="text"
              value={formData?.location}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Sex</span>
            <br />
            <Select
              labelId="sex-label"
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              label="Sex"
              error={!!sexError}
              sx={{ borderColor: sexError ? "red" : null, width: "100%" }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </Typography>
          {sexError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {sexError}
            </Typography>
          )}
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Age</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="age"
              name="age"
              type="number"
              value={formData?.age}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>X</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="x_link"
              name="x_link"
              type="text"
              value={formData?.x_link}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>

        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Facebook</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="facebook_link"
              name="facebook_link"
              type="text"
              value={formData?.facebook_link}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>
        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Instagram</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="instagram_link"
              name="instagram_link"
              type="text"
              value={formData?.instagram_link}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>
        <Card sx={cardStyle}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            style={{ marginBottom: "3px" }}
          >
            <span style={{ fontWeight: "bold" }}>Linkedin</span>
            <br />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="linkedin_link"
              name="linkedin_link"
              type="text"
              value={formData?.linkedin_link}
              onChange={handleChange}
              InputProps={{
                style: {
                  //   borderColor: emailError ? 'red' : null,
                },
              }}
            />
          </Typography>
        </Card>
        <Button style={{ color: "white" }} type="submit">
          Save
        </Button>
      </form>

      <IconButton
        style={{ marginTop: "20px", boxShadow: 20 }}
        onClick={() => setIsEditing(false)}
      >
        <CloseIcon style={{ color: "white" }} fontSize="large" />
      </IconButton>
    </div>
  );
}
export default EditProfile;
