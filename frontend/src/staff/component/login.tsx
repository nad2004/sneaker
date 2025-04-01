import { Card, CardContent, TextField, Button, Typography, Box, Link, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', { email, password }, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.data.accesstoken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            setError(null);
            alert('Login successful');
            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    const handleRegister = async () => {
        try {
            setError(null);
            setMessage(null);

            const response = await axios.post('http://localhost:8080/api/user/register', { name, email, password });
            setMessage('Registration successful! Please check your email to verify your account.');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#ffffff">
            <Card sx={{ width: 400, padding: 4, boxShadow: 3 }}>
                <CardContent>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={(event, newMode) => newMode && setMode(newMode)}
                        fullWidth
                        sx={{ mb: 2, border: 'none' }}
                    >
                        <ToggleButton value="login" sx={{ border: 'none' }}>Login</ToggleButton>
                        <ToggleButton value="register" sx={{ border: 'none' }}>Register</ToggleButton>
                    </ToggleButtonGroup>
                    {mode === 'login' ? (
                        <>
                            <Typography variant="body2" align="center" color="#555" gutterBottom>
                                If you have an account, log in with your email address.
                            </Typography>
                            {error && <Typography color="error" align="center">{error}</Typography>}
                            <TextField
                                fullWidth
                                label="Email address"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Link href="#" variant="body2" color="#6c63ff">
                                    Lost your password?
                                </Link>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, bgcolor: "#6c63ff", '&:hover': { bgcolor: "#5a52e0" } }}
                                onClick={handleLogin}
                            >
                                Log In
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" align="center" color="#555" gutterBottom>
                                Create an account to enjoy more benefits.
                            </Typography>
                            {error && <Typography color="error" align="center">{error}</Typography>}
                            {message && <Typography color="primary" align="center">{message}</Typography>}
                            <TextField
                                fullWidth
                                label="Full Name"
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Email address"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, bgcolor: "#6c63ff", '&:hover': { bgcolor: "#5a52e0" } }}
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
