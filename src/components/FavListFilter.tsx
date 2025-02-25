import { FaHeart, FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import './FavListFilter.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
interface FavFilterProps {
    onFilterChange: (ratingState: string, Type: string) => void;
}

  const FavListFilter: React.FC<FavFilterProps>  = ({ onFilterChange }) => {
    const {t} = useTranslation();
    const [activeType, setActiveType] = useState<string>("All");
    const [activeRating, setActiveRating] = useState<string>("");

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
        <div className='fav-list-filter-container'>
            <div className="fav-filter">
            <button 
                    className={`filter-button ${activeType === "All" ? "active" : ""}`}
                    onClick={() => updateFilters("", "All")}
                >
                    {t('fav.filter.typeAll')}
                </button>
                <button 
                    className={`filter-button ${activeType === "movie" ? "active" : ""}`}
                    onClick={() => updateFilters("", "movie")}
                >
                    {t('fav.filter.typeMovies')}
                </button>
                <button 
                    className={`filter-button ${activeType === "series" ? "active" : ""}`}
                    onClick={() => updateFilters("", "series")}
                >
                   {t('fav.filter.typeSeries')}
                </button>
                <button 
                    className={`filter-button ${activeType === "games" ? "active" : ""}`}
                    onClick={() => updateFilters("", "game")}
                >
                    {t('fav.filter.typeGames')}
                </button>
                <div className="vertical-separator"></div>
                <button 
                    className={`filter-button ${activeRating === "love" ? "active" : ""}`}
                    onClick={() => updateFilters("love", "")}
                >
                    {t('fav.filter.love')} <span className='filter-button-span'><FaHeart size={20} /></span>
                </button>
                <button 
                    className={`filter-button ${activeRating === "like" ? "active" : ""}`}
                    onClick={() => updateFilters("like", "")}
                >
                    {t('fav.filter.like')} <span className='filter-button-span thumbsUp'><FaThumbsUp size={20} /></span>
                </button>
                <button 
                    className={`filter-button ${activeRating === "dislike" ? "active" : ""}`}
                    onClick={() => updateFilters("dislike", "")}
                >
                   {t('fav.filter.meh')} <span className='filter-button-span'><FaThumbsDown size={20} /></span>
                </button>
            </div>
        </div>
    );
};

export default FavListFilter;