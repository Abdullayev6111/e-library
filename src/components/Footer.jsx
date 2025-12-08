import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="container footer-top">
        <div>
          <img
            className="footer-logo"
            src="https://ezma-client.vercel.app/assets/ezma-light-D6Z9QF3F.svg"
            alt=""
          />
          <p style={{ width: 320 }}>{t('footer.top.title')}</p>
        </div>
        <div className="footer-top-card">
          <h3>{t('footer.top.links')}</h3>
          <Link>{t('footer.top.mainPage')}</Link>
          <Link to="/libraries">{t('footer.top.libraries')}</Link>
          <Link to="/books">{t('footer.top.books')}</Link>
          <Link to="/events">{t('footer.top.events')}</Link>
          <Link to="/about">{t('footer.top.about')}</Link>
        </div>
        <div className="footer-top-card">
          <h3>{t('footer.top.contact')}</h3>
          <Link>
            <i className="fa-solid fa-phone" style={{ color: '#00aeff', fontSize: 16 }}></i> +9989
            90 123 45 67
          </Link>
          <Link>
            <i className="fa-solid fa-envelope" style={{ color: '#00aeff', fontSize: 16 }}></i>{' '}
            info@ezma.uz
          </Link>
          <Link>
            <i className="fa-solid fa-location-dot" style={{ color: '#00aeff', fontSize: 16 }}></i>{' '}
            {t('footer.top.location')}
          </Link>
        </div>
        <div className="footer-top-card">
          <h3>{t('footer.top.socials')}</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <i
              style={{ color: '#00aeff', fontSize: 20, cursor: 'pointer' }}
              className="fa-brands fa-telegram"
            ></i>
            <i
              style={{ color: '#00aeff', fontSize: 20, cursor: 'pointer' }}
              className="fa-brands fa-facebook"
            ></i>
            <i
              style={{ color: '#00aeff', fontSize: 20, cursor: 'pointer' }}
              className="fa-brands fa-instagram"
            ></i>
            <i
              style={{ color: '#00aeff', fontSize: 20, cursor: 'pointer' }}
              className="fa-brands fa-youtube"
            ></i>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{t('footer.bottom.title')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="privacy-policy">{t('footer.bottom.privacy')}</Link>
          <Link to="terms">{t('footer.bottom.terms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
