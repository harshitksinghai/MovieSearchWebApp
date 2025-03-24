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

interface ProfilePopupProps {
    open: boolean;
    handleClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, handleClose }) => {

    const dispatch = useAppDispatch();
    const { userId, userDetails } = useAppSelector((state) => state.auth);
    console.log("ProfilePopup => userDetails redux store state: ", userDetails)

    const {t} = useTranslation();

        const { currentTheme, darkMode } = useCustomTheme();
      const getCurrentPalette = () => {
        const palette = themePalettes[currentTheme];
        return darkMode ? palette.dark : palette.light;
      };
    
      const currentPalette = getCurrentPalette();

    const validationSchema = z.object({
        firstName: z.string().min(1, 'First name is required'),
        middleName: z.string().nullable(),
        lastName: z.string().min(1, 'Last name is required'),
        dateOfBirth: z.string()
            .min(1, 'Date of birth is required')
            .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, 'Must be in YYYY-MM-DD format'),
        phone: z.string().min(1, 'Phone number is required'),
    })

    const initialValues: UserFormItem = {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: (values, actions) => {

            console.log({ values });
            dispatch(updateCurrentUserDetails({ formDetails: values }))
            // alert(JSON.stringify(values, null, 2));

            actions.setSubmitting(false);
            handleClose();
        },
    });

    const handleDialogClose = () => {
        formik.resetForm();
        handleClose();
    };

    useEffect(() => {
        if (userDetails && open) {
            formik.resetForm({
                values: {
                    firstName: userDetails.firstName || '',
                    middleName: userDetails.middleName || '',
                    lastName: userDetails.lastName || '',
                    dateOfBirth: userDetails.dateOfBirth || '',
                    phone: userDetails.phone || '',
                }
            });
        }
    }, [userDetails, open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                PaperProps={{
                    style: {backgroundColor: currentPalette.background}
                }}
            >
                <DialogTitle sx={{ fontWeight: '600', bgcolor: currentPalette.background, color: currentPalette.textPrimary, py: 2 }}>
                    {t('profile.profile')}
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', height: 'auto', pb: 8 }}>
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
                                        style: {color: currentPalette.textPrimary}
                                    }}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    id="middleName"
                                    name="middleName"
                                    label={t('profile.middleName') + "*"} 
                                    size="small"
                                    placeholder={userDetails?.middleName || "Enter middle name"}
                                    value={formik.values.middleName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                                    helperText={formik.touched.middleName && formik.errors.middleName}
                                    InputLabelProps={{
                                        style: {color: currentPalette.textPrimary}
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
                                        style: {color: currentPalette.textPrimary}
                                    }}
                                />
                            </Grid>

                            {/* Second row: Phone, DOB */}
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    label={t('profile.phoneNo') + "*"} 
                                    size="small"
                                    placeholder={userDetails?.phone || "Enter phone number"}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    InputLabelProps={{
                                        style: {color: currentPalette.textPrimary}
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    label={t('profile.dob') + "*"} 
                                    size="small"
                                    placeholder={userDetails?.dateOfBirth || "Enter date of birth"}
                                    value={formik.values.dateOfBirth}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                    InputLabelProps={{
                                        style: {color: currentPalette.textPrimary}
                                    }}
                                />
                            </Grid>

                            {/* Third row: Email, Password */}
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
                                        style: {color: currentPalette.textPrimary}
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 24,
                            display: 'flex',
                            gap: 2,
                            width: '100%',
                            maxWidth: '250px'
                        }}>
                            <Button
                                color="inherit"
                                variant="outlined"
                                fullWidth
                                onClick={handleDialogClose}
                            >
                                {t('profile.cancel')}
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={formik.isSubmitting || !formik.dirty}
                            >
                                {t('profile.update')}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProfilePopup;