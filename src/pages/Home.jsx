import { useTranslation } from 'react-i18next';
import { Carousel } from '@mantine/carousel';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useMemo, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import API from '../api/Api';
import CardEl from '../components/CardEl';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const Home = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/bookDetail/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { data, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => API.get('/api/v1/books/books/').then((res) => res.data),
  });

  const results = useMemo(() => {
    if (!search.trim()) return [];
    return (
      data?.filter((b) => {
        const name = b.name?.toLowerCase() || '';
        const author = b.author?.toLowerCase() || '';
        const q = search.toLowerCase();
        return name.includes(q) || author.includes(q);
      }) || []
    );
  }, [search, data]);

  useEffect(() => {
    if (data) {
      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: 'Muvaffaqiyatli yuklandi',
        message: '',
        color: 'green',
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: error?.message || 'Xatolik mavjud',
        message: '',
        color: 'red',
      });
    }
  }, [error]);

  const autoplay = useRef(Autoplay({ delay: 3000 }));

  return (
    <div className="container hero">
      <div className="hero-section">
        <div className="hero-content">
          <h2>{t('home.title')}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t('home.placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn" type="submit">
              {t('home.SearchBtn')}
            </button>
          </form>

          {search.trim() && (
            <div className="hero-book-list">
              {results.length === 0 ? (
                <p style={{ padding: '10px' }}>{t('home.noResults')}</p>
              ) : (
                results.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '600' }}>{item.name}</p>
                      <p style={{ opacity: 0.7 }}>{item.author}</p>
                    </div>

                    <Button onClick={() => handleNavigate(item.id)} className="search-btn">
                      {t('home.details')}
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="carousel-element">
        <div className="carousel-top">
          <h1>{t('home.mostRead')}</h1>
        </div>

        <Carousel
          withControls={false}
          height={360}
          slideSize="25%"
          slideGap="md"
          align="start"
          emblaOptions={{ loop: true }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.play}
        >
          {data?.map((book) => (
            <Carousel.Slide key={book.id}>
              <CardEl post={book} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
