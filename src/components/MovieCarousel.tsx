import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

const MovieCarousel = () => {
    const {t} = useTranslation();
    return(
        <div>
            <Typography sx={{position: 'relative', top: '300px', textAlign: 'center'}}>{t("carousel.soon")}</Typography>
        </div>
    )
}

export default MovieCarousel;