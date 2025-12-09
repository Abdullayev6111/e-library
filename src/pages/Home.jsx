import { useTranslation } from 'react-i18next';
import { Carousel } from '@mantine/carousel';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import API from '../api/Api';
import CardEl from '../components/CardEl';

const Home = () => {
  const { t } = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { data, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => API.get('/books/books/').then((res) => res.data),
  });

  if (error) {
    console.log(error.message);
  }

  const autoplay = useRef(Autoplay({ delay: 3000 }));

  return (
    <div className="container hero">
      <div className="hero-section">
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

      <div className="carousel-element">
        <div className="carousel-top">
          <h1>Eng ko'p o'qilgan kitoblar</h1>
        </div>
        <Carousel
          withControls={false}
          height={360}
          slideSize="25%"
          slideGap="md"
          slidesToScroll={1}
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
