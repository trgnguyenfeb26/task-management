import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState, logout } from '../redux/slices/authSlice';
import UserButtonsDesktop from './UserButtonsDesktop';
import UserMenuMobile from './UserMenuMobile';
import TaskIcon from '../svg/task-logo.svg';

import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Button,
  useMediaQuery,
  Container,
} from '@material-ui/core';
import { useNavStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const NavBar = () => {
  const { user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const classes = useNavStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  const handleGoBack = () => {
    if (pathname.includes('/tasks')) {
      history.push(`${pathname.slice(0, pathname.indexOf('/tasks'))}`);
    } else {
      history.push('/');
    }
  };

  const mainButton = () => {
    if (['/', '/login', '/signup'].includes(pathname)) {
      return (
        <div className={classes.logoWrapper}>
          <Button
            className={classes.logoBtn}
            component={RouterLink}
            to="/"
            color="secondary"
          >
            <img src={TaskIcon} alt="logo" className={classes.svgImage} />
            TaskTracker
          </Button>
          {!isMobile && (
            <Typography variant="caption" color="secondary">
              Made with{' '}
              <FavoriteIcon style={{ fontSize: 10 }} color="primary" /> by{' '}
              <Link
                href={'https://github.com/trgnguyenfeb26'}
                color="inherit"
                target="_blank"
                rel="noopener"
              >
                <strong>NguyenNT</strong>
              </Link>
            </Typography>
          )}
        </div>
      );
    } else {
      return (
        <Button
          startIcon={<ArrowBackIcon />}
          color="secondary"
          onClick={handleGoBack}
          className={classes.backBtn}
        >
          {pathname.includes('/tasks') ? 'Project' : 'Home'}
        </Button>
      );
    }
  };

  return (
    // <Container >
      <AppBar elevation={1} color="inherit" position="static">
        <Toolbar variant="dense">
          <div className={classes.leftPortion}>{mainButton()}</div>
          <UserButtonsDesktop
            isMobile={isMobile}
            user={user}
            handleLogout={handleLogout}
          />
          <UserMenuMobile
            isMobile={isMobile}
            user={user}
            handleLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>
    // </Container>
  );
};

export default NavBar;
