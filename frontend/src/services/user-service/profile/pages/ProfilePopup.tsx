import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid2';
import { Box, FormControl, InputAdornment, MenuItem, Select } from '@mui/material';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import { UserFormItem } from '@/services/user-service/profile/types/profileTypes';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { updateCurrentUserDetails } from '@/redux/auth/authSlice';
import { useEffect, useState } from 'react';
import { useCustomTheme, themePalettes } from '@/context/CustomThemeProvider';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js/mobile';
import {
    getCountriesData,
    isValidPhoneNumber,
    parseFullPhoneNumber,
    formatPhoneNumberAsYouType,
    unformatPhoneNumber
} from '../utils/phoneUtils';
import { formatDateForStorage, formatDateForInput, parseUTCDate, getDateFormatByCountry } from '@/services/user-service/profile/utils/dateUtils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface ProfilePopupProps {
    open: boolean;
    handleClose: () => void;
}
interface ExtendedUserFormItem extends Omit<UserFormItem, "country"> {
    countryCode: CountryCode;
    phoneNumber: string;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, handleClose }) => {
    const dispatch = useAppDispatch();
    const { userId, userDetails, countryFromIP } = useAppSelector((state) => state.auth);

    const countryCode = userDetails.country ?? countryFromIP ?? 'IN';
    const phoneNumber = userDetails.phone ? parseFullPhoneNumber(userDetails.phone).phoneNumber : "";

    const [formCountryCode, setFormCountryCode] = useState<CountryCode>(countryCode as CountryCode);
    const [phoneInputFocused, setPhoneInputFocused] = useState(false);

    console.log("formCountryCode: ", formCountryCode);
    const { t } = useTranslation();
    const countries = getCountriesData();

    const { currentTheme, darkMode } = useCustomTheme();
    const getCurrentPalette = () => {
        const palette = themePalettes[currentTheme];
        return darkMode ? palette.dark : palette.light;
    };
    const currentPalette = getCurrentPalette();

    const isAtLeastEightYearsOld = (dateString: string) => {
        if (!dateString) return false;

        const today = new Date();
        const birthDate = new Date(dateString);
        const ageDifference = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayOccurred =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        return ageDifference > 8 || (ageDifference === 8 && hasBirthdayOccurred);
    };

    const validationSchema = z.object({
        firstName: z.string().min(1, t('profile.firstNameRequired')),
        middleName: z.string().nullable().optional(),
        lastName: z.string().min(1, t('profile.lastNameRequired')),
        dateOfBirth: z.string()
            .min(1, t('profile.dobRequired'))
            .refine(
                (value) => isAtLeastEightYearsOld(value),
                { message: t('profile.dobAtleastEight') }
            ),
        countryCode: z.string().min(1, t('profile.countryCodeRequired')),
        phoneNumber: z.string()
            .min(1, t('profile.phRequired'))
            .refine(
                (value) => isValidPhoneNumber(value, formCountryCode),
                { message: t('profile.phNotValid') }
            ),
        displayDateOfBirth: z.string().optional()
    });

    const initialValues: ExtendedUserFormItem = {
        firstName: '',
        middleName: null,
        lastName: '',
        dateOfBirth: '',
        phone: '',
        countryCode: countryFromIP as CountryCode,
        phoneNumber: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values, actions) => {
            if (!isValidPhoneNumber(values.phoneNumber, values.countryCode)) {
                formik.setFieldError('phoneNumber', t('profile.phNotValid'));
                actions.setSubmitting(false);
                return;
            }
            const utcDateOfBirth = formatDateForStorage(values.dateOfBirth);

            dispatch(updateCurrentUserDetails({
                formDetails: {
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    country: values.countryCode,
                    phone: `+${getCountryCallingCode(values.countryCode)}${unformatPhoneNumber(values.phoneNumber)}`,
                    dateOfBirth: utcDateOfBirth
                }
            }));

            actions.setSubmitting(false);
            handleClose();
            toast.success(t('profile.toastSuccess'));
        },
    });

    const handleDialogClose = () => {
        formik.resetForm();
        handleClose();
    };

    const handlePhoneFocus = () => {
        setPhoneInputFocused(true);
    };

    useEffect(() => {
        if (userDetails && open) {
            const localDateObj = parseUTCDate(userDetails.dateOfBirth);
            const inputDate = formatDateForInput(localDateObj);
            setFormCountryCode(countryCode as CountryCode);

            formik.resetForm({
                values: {
                    firstName: userDetails.firstName || '',
                    middleName: userDetails.middleName,
                    lastName: userDetails.lastName || '',
                    dateOfBirth: inputDate,
                    phone: userDetails.phone || '',
                    countryCode: countryCode as CountryCode || countryFromIP as CountryCode,
                    phoneNumber: phoneNumber || '',
                }
            });
        }
    }, [userDetails, open, countryFromIP]);

    const handleCountryChange = (e: any) => {
        const newCountryCode = e.target.value as CountryCode;
        setFormCountryCode(newCountryCode);
        console.log("formCountryCode: ", newCountryCode);

        formik.setFieldValue('countryCode', newCountryCode);

        setTimeout(() => {
            if (formik.values.phoneNumber) {
                const unformattedPhone = unformatPhoneNumber(formik.values.phoneNumber);
                validatePhoneNumber(unformattedPhone, newCountryCode);
            }
        }, 0);
    };

    const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setPhoneInputFocused(false);
        formik.handleBlur(e);
        const formattedNumber = formatPhoneNumberAsYouType(formik.values.phoneNumber, formik.values.countryCode);
        formik.setFieldValue('phoneNumber', formattedNumber);
        validatePhoneNumber(unformatPhoneNumber(e.target.value), formik.values.countryCode);
    };

    const validatePhoneNumber = (phoneNumber: string, countryCode: CountryCode) => {
        if (!phoneNumber) return;

        const isValid = isValidPhoneNumber(phoneNumber, countryCode);
        console.log("isValid: ", isValid)
        if (!isValid) {
            formik.setFieldError('phoneNumber', t('profile.phNotValid'));
        } else {
            formik.setFieldError('phoneNumber', undefined);
        }
    };

    const handleDOBChange = (value: { dateOfBirth: string }) => {
        const newDate = value.dateOfBirth;
        formik.setFieldValue('dateOfBirth', newDate);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                PaperProps={{
                    style: { backgroundColor: currentPalette.background }
                }}
            >
                <DialogTitle sx={{ fontWeight: '600', bgcolor: currentPalette.background, color: currentPalette.textPrimary, py: 2 }}>
                    {t('profile.profile')}
                </DialogTitle>
                <DialogContent sx={{ height: 'auto' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} sx={{ pt: '12px' }}>
                            {/* First row: First name, Middle name, Last name */}
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label={t('profile.firstName') + "*"}
                                    size="small"
                                    placeholder={userDetails.firstName || t('profile.enterFirstName')}
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                    InputLabelProps={{
                                        style: { color: currentPalette.textPrimary }
                                    }}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    id="middleName"
                                    name="middleName"
                                    label={t('profile.middleName')}
                                    size="small"
                                    placeholder={userDetails?.middleName || t('profile.enterMiddleName')}
                                    value={formik.values.middleName || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                                    helperText={formik.touched.middleName && formik.errors.middleName}
                                    InputLabelProps={{
                                        style: { color: currentPalette.textPrimary }
                                    }}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label={t('profile.lastName') + "*"}
                                    size="small"
                                    placeholder={userDetails?.lastName || t('profile.enterLastName')}
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                    InputLabelProps={{
                                        style: { color: currentPalette.textPrimary }
                                    }}
                                />
                            </Grid>

                            {/* Second row: Phone, DOB */}
                            <Grid size={6}>
                                {/* Integrated Phone Input Field */}
                                <TextField
                                    fullWidth
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label={t('profile.phoneNo') + "*"}
                                    size="small"
                                    placeholder={userDetails?.phone || t('profile.enterPhNo')}
                                    value={formatPhoneNumberAsYouType(formik.values.phoneNumber, formik.values.countryCode)}
                                    onChange={formik.handleChange}
                                    onBlur={handlePhoneBlur}
                                    onFocus={handlePhoneFocus}
                                    error={(formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber))}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                    InputLabelProps={{
                                        style: { color: currentPalette.textPrimary },
                                        shrink: Boolean(userDetails?.phone || formik.values.phoneNumber || phoneInputFocused)
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FormControl variant="standard" size="small" sx={{ minWidth: 50 }}>
                                                    <Select
                                                        value={formik.values.countryCode}
                                                        onChange={handleCountryChange}
                                                        disableUnderline
                                                        sx={{
                                                            '& .MuiSelect-select': {
                                                                paddingRight: '14px',
                                                                paddingLeft: '4px',
                                                            }
                                                        }}
                                                        renderValue={(selected) => {
                                                            const country = countries.find(c => c.code === selected);
                                                            return (
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span style={{ marginRight: 8 }}>{country?.flag}</span>
                                                                    <span>{country?.dialCode}</span>
                                                                </Box>
                                                            );
                                                        }}
                                                    >
                                                        {countries.map((country) => (
                                                            <MenuItem key={country.code} value={country.code}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                    <span style={{ marginRight: 8 }}>{country.flag}</span>
                                                                    <span>{country.name}</span>
                                                                    <span style={{ marginLeft: 8 }}>({country.dialCode})</span>
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
                                            transform: 'translate(80%, 8px) scale(1)'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label={t('profile.dob') + "*"}
                                        value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                const dateString = newValue.format('YYYY-MM-DD');
                                                handleDOBChange({ dateOfBirth: dateString });
                                            }
                                        }}
                                        format={getDateFormatByCountry(countryCode)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: "small",
                                                id: "dateOfBirth",
                                                name: "dateOfBirth",
                                                error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                                                helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
                                                InputLabelProps: {
                                                    style: { color: currentPalette.textPrimary }
                                                },
                                                onBlur: formik.handleBlur
                                            }
                                        }}
                                        maxDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Third row: Email */}
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    disabled
                                    id="email"
                                    name="email"
                                    label={t('profile.email')}
                                    size="small"
                                    placeholder={userId || "Enter email address"}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                    value={userId}
                                    InputLabelProps={{
                                        style: { color: currentPalette.textPrimary }
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        color="inherit"
                                        variant="outlined"
                                        sx={{ px: '5%' }}
                                        onClick={handleDialogClose}
                                    >
                                        {t('profile.cancel')}
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        sx={{ px: '5%' }}
                                        type="submit"
                                        disabled={formik.isSubmitting || !formik.dirty}
                                    >
                                        {t('profile.update')}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProfilePopup;