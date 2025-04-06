import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import { UserFormItem } from '@/types/authTypes';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateCurrentUserDetails } from '@/features/auth/authSlice';
import { useEffect } from 'react';
import { useCustomTheme, themePalettes } from '../context/CustomThemeProvider';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js/mobile';
import PhoneNumInput, { getCountriesData, isValidPhoneNumber, parseFullPhoneNumber } from './PhoneNumInput';
import { formatDateForDisplay, formatDateForStorage, formatDateForInput, parseUTCDate, getDateFormatByCountry } from '@/utils/dateUtils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface ProfilePopupProps {
    open: boolean;
    handleClose: () => void;
}

// Extended form item type to include additional fields for UI
interface ExtendedUserFormItem extends UserFormItem {
    countryCode: CountryCode;
    phoneNumber: string;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, handleClose }) => {

    const dispatch = useAppDispatch();
    const { userId, userDetails, country } = useAppSelector((state) => state.auth);
    console.log("ProfilePopup => userDetails redux store state: ", userDetails)

    const { countryCode, phoneNumber } = userDetails.phone
        ? parseFullPhoneNumber(userDetails.phone)
        : { countryCode: 'IN' as CountryCode, phoneNumber: '' };

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
            .min(1, t('profile.phRequired')),
        displayDateOfBirth: z.string().optional()
    })
        .refine(
            (data) => isValidPhoneNumber(data.phoneNumber, data.countryCode as CountryCode),
            {
                message: t('profile.phNotValid'),
                path: ['phoneNumber']
            }
        );

    const initialValues: ExtendedUserFormItem = {
        firstName: '',
        middleName: null,
        lastName: '',
        dateOfBirth: '',
        phone: '',
        countryCode: 'IN' as CountryCode,
        phoneNumber: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values, actions) => {
            console.log({ values });

            // Format date to UTC for storage
            const utcDateOfBirth = formatDateForStorage(values.dateOfBirth);

            dispatch(updateCurrentUserDetails({
                formDetails: {
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    phone: `+${getCountryCallingCode(values.countryCode)}${values.phoneNumber}`,
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

    useEffect(() => {
        if (userDetails && open) {
            const localDateObj = parseUTCDate(userDetails.dateOfBirth);
            const inputDate = formatDateForInput(localDateObj);

            formik.resetForm({
                values: {
                    firstName: userDetails.firstName || '',
                    middleName: userDetails.middleName,
                    lastName: userDetails.lastName || '',
                    dateOfBirth: inputDate,
                    phone: userDetails.phone || '',
                    countryCode: countryCode || 'IN' as CountryCode,
                    phoneNumber: phoneNumber || '',
                }
            });
        }
    }, [userDetails, open, country]);

    const handlePhoneChange = (value: { countryCode: CountryCode; phoneNumber: string }) => {
        formik.setFieldValue('countryCode', value.countryCode);
        formik.setFieldValue('phoneNumber', value.phoneNumber);
    };

    const handleDOBChange = (value: { dateOfBirth: string }) => {
        const newDate = value.dateOfBirth;
        console.log("handleDOBchange => newDate: ", newDate)
        formik.setFieldValue('dateOfBirth', newDate);

        if (newDate) {
            const localDateObj = new Date(newDate);
            const displayDate = formatDateForDisplay(localDateObj, country);
            console.log("handleDOBchange => displayDate: ", displayDate)
        }
    }

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
                                    placeholder={userDetails.firstName || "Enter first name"}
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
                                    placeholder={userDetails?.middleName || "Enter middle name"}
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
                                    placeholder={userDetails?.lastName || "Enter last name"}
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
                                <PhoneNumInput
                                    value={{
                                        countryCode: formik.values.countryCode,
                                        phoneNumber: formik.values.phoneNumber
                                    }}
                                    placeholder={userDetails?.phone || "Enter phone number"}
                                    onChange={handlePhoneChange}
                                    onBlur={formik.handleBlur}
                                    error={(formik.touched.phoneNumber || formik.touched.countryCode) &&
                                        (Boolean(formik.errors.phoneNumber) || Boolean(formik.errors.countryCode))}
                                    helperText={(formik.touched.phoneNumber && formik.errors.phoneNumber) ||
                                        (formik.touched.countryCode && formik.errors.countryCode)}
                                    label={t('profile.phoneNo')}
                                    required={true}
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    countries={countries}
                                    currentPalette={currentPalette}
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
                                        format={getDateFormatByCountry(country)}
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