import { Link, NavLink } from 'react-router-dom';
import { LanguageSelect } from './Language-Selector/LanguageSelect';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
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
          <NavLink to="/books">{t('header.books')}</NavLink>
        </div>
        <div className="header-right">
          <LanguageSelect />
          <button className="login-btn">{t('header.loginBtn')}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
