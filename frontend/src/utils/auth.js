

export const handleLogout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
};