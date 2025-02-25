// SearchBar.tsx
import React, { useState } from 'react';
import './SearchBar.css';
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';


interface SearchBarProps {
    onSearch: (title: string, year: string, type: string) => void;
    error: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, error }) => {
    const {t} = useTranslation()
    const theme = useTheme();

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [year, setYear] = useState('');
    const [err, setError] = useState(error);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);



    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1887 }, (_, i) => currentYear - i);

    const handleSearch = () => {
        if (title.trim().length < 3) {
            setError(t('error.titleError'));
            return;
        }
        setError('');
        onSearch(title, year, type);
    };

    let typeOption: string;
    if(type === 'movie'){
        typeOption = t('navbar.typeMovies');
    }
    else if(type === 'series'){
        typeOption = t('navbar.typeSeries');
    }
    else if(type === 'game'){
        typeOption = t('navbar.typeGames');
    }
    else{
        typeOption = t('navbar.typeAll')
    }


    return (
        <div>

            <div className='search-container' >
                <div className={`search-box ${(err || error) ? 'search-box-err' : ''} `} style={{ color: theme.palette.text.secondary }}>
                        <input
                            type="text"
                            placeholder={t('navbar.searchPlaceholder')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="search-title"
                        />

                    <div className='select-container'>
                        <div className="select-dropdown search-type">
                            <button
                                onClick={() => setIsTypeOpen(!isTypeOpen)}
                                onBlur={() => setIsTypeOpen(false)}
                                className="select-button"
                            >
                                {typeOption}
                                <span className={`arrow ${isTypeOpen ? 'arrow-up' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isTypeOpen && (
                                <div className="dropdown-menu">
                                    {[t('navbar.typeAll'), t('navbar.typeMovies'), t('navbar.typeSeries'), t('navbar.typeGames')].map((option) => (
                                        <button
                                            key={option}
                                            className="dropdown-item"
                                            onMouseDown={() => {
                                                if(option === t('navbar.typeMovies')){
                                                    setType('movie');
                                                }
                                                else if(option === t('navbar.typeSeries')){
                                                    setType('series')
                                                }
                                                else if(option === t('navbar.typeGames')){
                                                    setType('game')
                                                }
                                                else{
                                                    setType('')
                                                }
                                                setIsTypeOpen(false);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="select-dropdown">
                            <button
                                onClick={() => setIsYearOpen(!isYearOpen)}
                                onBlur={() => setIsYearOpen(false)}
                                className="select-button"
                            >
                                {year ? year : t('navbar.Year')}
                                <span className={`arrow ${isYearOpen ? 'arrow-up' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isYearOpen && (
                                <div className="dropdown-menu">
                                    <button
                                        className="dropdown-item"
                                        onMouseDown={() => {
                                            setYear('');
                                            setIsYearOpen(false);
                                        }}
                                    >{t('navbar.none')}</button>
                                    {years.map((option) => (
                                        <button
                                            key={option}
                                            className="dropdown-item"
                                            onMouseDown={() => {
                                                setYear(option.toString());
                                                setIsYearOpen(false);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSearch}
                            className="search-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                color='white'
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p className='search-err'>{err || error}</p>
            </div>
        </div>
    );
};

export default SearchBar;