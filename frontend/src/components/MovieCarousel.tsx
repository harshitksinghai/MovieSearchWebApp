import { useTranslation } from 'react-i18next';
import { Typography, useTheme } from '@mui/material';

const MovieCarousel = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    return(
        <div>
            <Typography sx={{position: 'relative', top: '300px', textAlign: 'center', color: theme.palette.text.flow}}>{t("carousel.soon")}</Typography>
        </div>
    )
}

export default MovieCarousel;