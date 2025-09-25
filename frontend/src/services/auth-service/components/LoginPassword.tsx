import TextField from "@mui/material/TextField";
import { AuthMode, OtpMode } from "../utils/authTypes";
import { authApi } from "../api/authApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Typography from "@mui/material/Typography";
import { setUserId } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/app/reduxHooks";

type LoginPasswordProps = {
    email: string;
    setAuthMode: (mode: AuthMode) => void;
    setOtpMode: (mode: OtpMode | undefined) => void;
    setError: (error: string) => void;
}
const LoginPassword: React.FC<LoginPasswordProps> = ({ email, setAuthMode, setOtpMode, setError }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const handleForgotPassword = async () => {
        try {
            console.log("calling: authApi.sendOtp(email)");
            await authApi.sendOtp(email);
            console.log("worked: authApi.sendOtp(email)");

            setOtpMode('reset-password');
            setAuthMode('otp');

        } catch (err) {
            setError(t('auth.sendOtpFailed'));
        }
    }

    const validationSchema = z.object({
        password: z.string()
            .min(1, t('auth.passwordRequired'))
    })

    const initialValues = {
        password: ''
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: async (values, actions) => {
            try {
                console.log("calling: authApi.login({email, password})");
                const response = await authApi.login({ userId: email, password: values.password });
                console.log("worked: authApi.login({email, password})");
    
                if (response.data.status) {
                    dispatch(setUserId(email));
                    navigate('/home');
                } 
                else {
                    setError(t('auth.loginFailed'));
                }
    
            } catch (err) {
                setError(t('auth.loginFailed'));
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
                label={t("auth.password")}
                size="small"
                placeholder={t('auth.enterPassword')}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <Typography onClick={handleForgotPassword} sx={{cursor: "pointer"}}>
                {t('auth.forgotPassword') || "Forgot Password"}
            </Typography>
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
export default LoginPassword;