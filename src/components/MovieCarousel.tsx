import { useTranslation } from 'react-i18next';
import styles from './MovieCarousel.module.css'

const MovieCarousel = () => {
    const {t} = useTranslation();
    return(
        <div className={styles["movie-carousel-container"]}>
            <p className={styles.soon}>{t("carousel.soon")}</p>
        </div>
    )
}

export default MovieCarousel;