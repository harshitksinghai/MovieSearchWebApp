import { FaHeart, FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import styles from './FavListFilter.module.css'
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ThemeContext } from '../context/ThemeContext.tsx';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { setFavActiveRating, setFavActiveType } from '../features/filter/filterSlice.ts';

const FavListFilter: React.FC = () => {
    const { t } = useTranslation();
    const { darkMode } = useContext(ThemeContext);

    const dispatch = useAppDispatch();
    const activeType = useAppSelector((state) => state.filter.fav_activeType);
    const activeRating = useAppSelector((state) => state.filter.fav_activeRating);

    const updateTypeFilter = (Type: string) => {
        if (activeType !== Type) {
            dispatch(setFavActiveType(Type));
        }
    }
    const updateRatingStateFilter = (ratingState: string) => {
        const newRating = (activeRating !== ratingState) ? ratingState : "none";
        dispatch(setFavActiveRating(newRating));
    }

    return (
        <div className={clsx(styles['fav-list-filter-container'], darkMode ? styles['dark-mode'] : styles['light-mode'])}>
            <div className={styles["fav-filter"]}>
                <button
                    className={clsx(styles["filter-button"], activeType === "" && styles.active)}
                    onClick={() => updateTypeFilter("")}
                >
                    {t('fav.filter.typeAll')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "movie" && styles.active)}
                    onClick={() => updateTypeFilter("movie")}
                >
                    {t('fav.filter.typeMovies')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "series" && styles.active)}
                    onClick={() => updateTypeFilter("series")}
                >
                    {t('fav.filter.typeSeries')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "game" && styles.active)}
                    onClick={() => updateTypeFilter("game")}
                >
                    {t('fav.filter.typeGames')}
                </button>
                <div className={styles["vertical-separator"]}></div>
                <button
                    className={clsx(styles["filter-button"], activeRating === "love" && styles.active)}
                    onClick={() => updateRatingStateFilter("love")}
                >
                    {t('fav.filter.love')} <span className={styles['filter-button-span']}><FaHeart size={20} /></span>
                </button>
                <button
                    className={clsx(styles["filter-button"], activeRating === "like" && styles.active)}
                    onClick={() => updateRatingStateFilter("like")}
                >
                    {t('fav.filter.like')} <span className={clsx(styles['filter-button-span'], styles.thumbsUp)}><FaThumbsUp size={20} /></span>
                </button>
                <button
                    className={clsx(styles["filter-button"], activeRating === "dislike" && styles.active)}
                    onClick={() => updateRatingStateFilter("dislike")}
                >
                    {t('fav.filter.meh')} <span className={styles['filter-button-span']}><FaThumbsDown size={20} /></span>
                </button>
            </div>
        </div>
    );
};

export default FavListFilter;