import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const handleSubmit = (e) => {
    e.prevenDefault();
  };

  return (
    <div className="container hero-section">
      <div className="hero-content">
        <h2>{t('home.title')}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder={t('home.placeholder')} />
          <button className="search-btn" type="submit">
            {t('home.SearchBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
