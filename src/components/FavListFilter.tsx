import { FaHeart, FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import styles from './FavListFilter.module.css'
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ThemeContext } from '../theme/ThemeContext';

interface FavFilterProps {
    onFilterChange: (ratingState: string, Type: string) => void;
}

const FavListFilter: React.FC<FavFilterProps> = ({ onFilterChange }) => {
    const { t } = useTranslation();
    const [activeType, setActiveType] = useState<string>("All");
    const [activeRating, setActiveRating] = useState<string>("");
    const { darkMode } = useContext(ThemeContext);


    const updateFilters = (ratingState: string, Type: string) => {
        if (Type) {
            setActiveType(Type);
            onFilterChange(activeRating, Type);
        }

        if (ratingState) {
            const newRating = activeRating === ratingState ? "" : ratingState;
            setActiveRating(newRating);
            onFilterChange(newRating, activeType);
        }
    };

    return (
        <div className={clsx(styles['fav-list-filter-container'], darkMode ? styles['dark-mode'] : styles['light-mode'])}>
            <div className={styles["fav-filter"]}>
                <button
                    className={clsx(styles["filter-button"], activeType === "All" && styles.active)}
                    onClick={() => updateFilters("", "All")}
                >
                    {t('fav.filter.typeAll')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "movie" && styles.active)}
                    onClick={() => updateFilters("", "movie")}
                >
                    {t('fav.filter.typeMovies')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "series" && styles.active)}
                    onClick={() => updateFilters("", "series")}
                >
                    {t('fav.filter.typeSeries')}
                </button>
                <button
                    className={clsx(styles["filter-button"], activeType === "game" && styles.active)}
                    onClick={() => updateFilters("", "game")}
                >
                    {t('fav.filter.typeGames')}
                </button>
                <div className={styles["vertical-separator"]}></div>
                <button
                    className={clsx(styles["filter-button"], activeRating === "love" && styles.active)}
                    onClick={() => updateFilters("love", "")}
                >
                    {t('fav.filter.love')} <span className={styles['filter-button-span']}><FaHeart size={20} /></span>
                </button>
                <button
                    className={clsx(styles["filter-button"], activeRating === "like" && styles.active)}
                    onClick={() => updateFilters("like", "")}
                >
                    {t('fav.filter.like')} <span className={clsx(styles['filter-button-span'], styles.thumbsUp)}><FaThumbsUp size={20} /></span>
                </button>
                <button
                    className={clsx(styles["filter-button"], activeRating === "dislike" && styles.active)}
                    onClick={() => updateFilters("dislike", "")}
                >
                    {t('fav.filter.meh')} <span className={styles['filter-button-span']}><FaThumbsDown size={20} /></span>
                </button>
            </div>
        </div>
    );
};

export default FavListFilter;