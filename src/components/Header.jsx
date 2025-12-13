import { Link, NavLink } from 'react-router-dom';
import { LanguageSelect } from './Language-Selector/LanguageSelect';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';

const Header = () => {
  const { t } = useTranslation();
  const { isAuth } = useAuthStore();

  return (
    <header>
      <div className="container header-content">
        <div className="header-left">
          <Link to="/">
            <img
              className="logo"
              src="https://ezma-client.vercel.app/assets/ezma-light-D6Z9QF3F.svg"
              alt=""
            />
          </Link>
          <NavLink to="/">{t('header.mainPage')}</NavLink>
          <NavLink to="/libraries">{t('header.libraries')}</NavLink>
          {isAuth && <NavLink to="/books">{t('header.books')}</NavLink>}
        </div>

        <div className="header-right">
          <LanguageSelect />

          {!isAuth ? (
            <Link to="/login">
              <button className="login-btn">{t('header.loginBtn')}</button>
            </Link>
          ) : (
            <div style={{ width: 45, height: 45, borderRadius: '50%', cursor: 'pointer' }}>
              <Link to="/profile">
                <img
                  style={{ width: '100%' }}
                  src="https://ezma-client.vercel.app/assets/user-D__q57DX.png"
                  alt=""
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
