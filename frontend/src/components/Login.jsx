import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Paper, Link } from "@mui/material";
import api from "../api"; // Ensure this points to your Axios instance

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token); // Save token in localStorage
            setMessage("Login successful!");
            navigate("/watch"); // Redirect to the WatchingPage
        } catch (error) {
            setMessage(error.response?.data.error || "Error occurred");
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "100px" }}>
            <Paper elevation={3} style={{ padding: "20px", backgroundColor: "#141414", color: "white" }}>
                <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: "#1c1c1c", color: "white" },
                        }}
                        InputLabelProps={{
                            style: { color: "#00b300" },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            style: { backgroundColor: "#1c1c1c", color: "white" },
                        }}
                        InputLabelProps={{
                            style: { color: "#00b300" },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: "#00b300", color: "white", marginTop: "20px" }}
                    >
                        Login
                    </Button>
                    {message && (
                        <Typography variant="body2" align="center" style={{ marginTop: "10px", color: "#00b300" }}>
                            {message}
                        </Typography>
                    )}
                </form>
                <Typography variant="body2" align="center" style={{ marginTop: "20px" }}>
                    Not a member?{" "}
                    <Link href="/signup" style={{ color: "#00b300", textDecoration: "none", fontWeight: "bold" }}>
                        Sign up
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;
