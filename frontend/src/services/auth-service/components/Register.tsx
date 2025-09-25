import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { authApi } from "../api/authApi";
import { AuthMode, OtpMode } from "../utils/authTypes";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { setUserId } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/app/reduxHooks";

type RegisterProps = {
    email: string;
    setError: (error: string) => void;
    setOtpMode: (mode: OtpMode | undefined) => void;
    setAuthMode: (mode: AuthMode) => void;
}
const Register: React.FC<RegisterProps> = ({ email, setError, setOtpMode, setAuthMode }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const validationSchema = z.object({
        password: z.string()
            .min(1, t('auth.passwordRequired'))
            .min(8, t('auth.passwordMinLength')),
        confirmPassword: z.string()
            .min(1, t('auth.confirmPasswordRequired'))
    })
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: t('auth.passwordsDoNotMatch')
        })

    const initialValues = {
        password: '',
        confirmPassword: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: async (values, actions) => {
            try {
                console.log("calling: authApi.register({email, password})");
                const response = await authApi.register({ userId: email, password: values.password });
                console.log("worked: authApi.register({email, password})");

                if (response.data.status) {
                    dispatch(setUserId(email));
                    navigate('/home');
                }
                else {
                    setError(t('auth.registerFailed'));
                }
            } catch (err) {
                setError(t('auth.registerFailed'));
            }
            finally {
                actions.setSubmitting(false);
            }
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth
                id="email"
                name="email"
                label={t("auth.email")}
                size="small"
                value={email}
                slotProps={{
                    input: {
                        readOnly: true,
                    },
                }}
                onChange={(e) => {
                    if (e.target.value !== email) {
                        setOtpMode(undefined);
                        setAuthMode('verify-email');
                    }
                }}
            />
            <TextField
                fullWidth
                id="password"
                name="password"
                label={t('auth.newPassword')}
                placeholder={t('auth.newPassword')}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPassword')}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{ mt: 2 }}
            >
                {t('auth.submit') || "Submit"}
            </Button>
        </form>
    )
}
export default Register;