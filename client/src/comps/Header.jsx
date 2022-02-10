import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header({setsearch, checkedarr, user}) {


    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };

  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const LogOut = async () => {
        await fetch('http://localhost:1000/logout',{
            method: "delete",
            credentials:"include",
        })
        localStorage.removeItem('username')
        localStorage.removeItem('role')
        navigate('/login')
      
    }
    
    

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu sx={{marginTop: '35px'}}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={()=> {
            handleMenuClose()
            LogOut()
            }}>Log Out</MenuItem>
      </Menu>
    );

  
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        {
            localStorage.role == "user" ? <IconButton
            size="large"
            color="inherit"
            onClick={() => navigate('/vacations')}
            >
            <Badge badgeContent={checkedarr && checkedarr.length} color="error">
            <StarIcon />
            </Badge>
            </IconButton> :
            <div>
             <MenuItem >
            <IconButton
            size="large"
            color="inherit"
            onClick={() => navigate('/addvacation')}
            >
            <AddCircleOutlineIcon/>
            </IconButton>
            <p>Add Vacation</p>
            </MenuItem>
            <MenuItem >
            <IconButton
                size="large"
                color="inherit"
                onClick={() => navigate('/reports')}
            >
            <Badge badgeContent={"R"} color="error">
            <AssessmentIcon/>
            </Badge>
            </IconButton>
            <p>Reports</p>
            </MenuItem>
            </div>
        }
        <MenuItem >
        <IconButton
                size="large"
                edge="end"
                aria-label="stars of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                onClick={() =>{
                    LogOut()
                    handleMobileMenuClose()
                } }
                >
                <LogoutIcon/>
            </IconButton>
          <p>Log Out</p>
        </MenuItem>
      </Menu>
    );
  
    return (
      <Box sx={{ flexGrow: 1}}>
        <AppBar position="static" className='appbar' sx={{background:'black', minHeight: '10vh'}}>
          <Toolbar sx={{ marginTop: 'auto'}}>
            <Typography
             className='title'
              variant="h6"
              noWrap
              component="div"
              className='title'
              sx={{ display: { xs: 'none', sm: 'block'},  fontSize:'20px' }}
              onClick={() => navigate('/vacations')}
            >
              <h1>Vacations</h1>
            </Typography>
           

            {
                localStorage.username &&
                <>
            
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                        <StyledInputBase
                        onChange={e => setsearch(e.target.value)}
                        placeholder="Search by destination"
                        inputProps={{ 'aria-label': 'search' }}
                        />
                </Search>
                   <h4>Hello {user && user[0].firstname} {user && user[0].lastname} </h4>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {
                    localStorage.role == "user" ? <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => navigate('/vacations')}
                    >
                <Badge badgeContent={checkedarr && checkedarr.length} color="error">
                    <StarIcon />
                </Badge>
                </IconButton>
                 : <div><IconButton
                    size="large"
                    color="inherit"
                    onClick={() => navigate('/addvacation')}
                    >
                <AddCircleOutlineIcon/>
                </IconButton>
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => navigate('/reports')}
                    >
                <Badge badgeContent={"R"} color="error">
                <AssessmentIcon/>
                </Badge>
                </IconButton>
                </div> 
                }
               
                <IconButton
                size="large"
                edge="end"
                aria-label="stars of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
                onClick={LogOut}
                >
                <LogoutIcon/>
                </IconButton>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                >
                <MoreIcon />
                 </IconButton>
                </Box>
                </>
            }
           
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    )
}
