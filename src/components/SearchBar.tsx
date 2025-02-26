// SearchBar.tsx
import { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { useSearch } from '../context/SearchContext';




const SearchBar = () => {
    const {handleSearch, error, handleError, title, handleTitle} = useSearch();
    const {t} = useTranslation()
    const theme = useTheme();
    const [type, setType] = useState('');
    const [year, setYear] = useState('');
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);

    useEffect(() => {
        handleTitle('');
    },[])

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1887 }, (_, i) => currentYear - i);

    const handleSearchButton = () => {
        if (title.trim().length < 3) {
            handleError(t('error.titleError'));
            return;
        }
        handleError('');
        handleSearch(title, year, type);
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

            <div className={styles['search-container']} >
                <div className={clsx(styles["search-box"], (error) && styles['search-box-err'])} style={{ color: theme.palette.text.secondary }}>
                        <input
                            type="text"
                            placeholder={t('navbar.searchPlaceholder')}
                            value={title}
                            onChange={(e) => {
                                if(e.target.value === ''){
                                    handleError(null);
                                }
                                handleTitle(e.target.value);
                            }}
                            className={styles["search-title"]}
                        />

                    <div className={styles['select-container']}>
                        <div className={clsx(styles["select-dropdown"], styles["search-type"])}>
                            <button
                                onClick={() => setIsTypeOpen(!isTypeOpen)}
                                onBlur={() => setIsTypeOpen(false)}
                                className={styles["select-button"]}
                            >
                                {typeOption}
                                <span className={clsx(styles.arrow, isTypeOpen && styles['arrow-up'])}>
                                    ▼
                                </span>
                            </button>

                            {isTypeOpen && (
                                <div className={styles["dropdown-menu"]}>
                                    {[t('navbar.typeAll'), t('navbar.typeMovies'), t('navbar.typeSeries'), t('navbar.typeGames')].map((option) => (
                                        <button
                                            key={option}
                                            className={styles["dropdown-item"]}
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
                        <div className={styles["select-dropdown"]}>
                            <button
                                onClick={() => setIsYearOpen(!isYearOpen)}
                                onBlur={() => setIsYearOpen(false)}
                                className={styles["select-button"]}
                            >
                                {year ? year : t('navbar.Year')}
                                <span className={clsx(styles.arrow, isYearOpen && styles['arrow-up'])}>
                                    ▼
                                </span>
                            </button>

                            {isYearOpen && (
                                <div className={styles["dropdown-menu"]}>
                                    <button
                                        className={styles["dropdown-item"]}
                                        onMouseDown={() => {
                                            setYear('');
                                            setIsYearOpen(false);
                                        }}
                                    >{t('navbar.none')}</button>
                                    {years.map((option) => (
                                        <button
                                            key={option}
                                            className={styles["dropdown-item"]}
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
                            onClick={handleSearchButton}
                            className={styles["search-button"]}
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
                <p className={styles['search-err']}>{error}</p>
            </div>
        </div>
    );
};

export default SearchBar;