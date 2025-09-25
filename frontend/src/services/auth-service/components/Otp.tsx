import { useNavigate } from "react-router-dom";
import { AuthMode, OtpMode } from "../utils/authTypes";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { authApi } from "../api/authApi";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type OtpProps = {
    email: string;
    otpMode: string | undefined;
    setOtpMode: (mode: OtpMode | undefined) => void;
    setAuthMode: (mode: AuthMode) => void;
    setError: (error: string) => void;
}
const Otp: React.FC<OtpProps> = ({ email, otpMode, setOtpMode, setAuthMode, setError }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleResendOtp = async () => {
            try {
                console.log("calling: authApi.sendOtp(email)");
                await authApi.sendOtp(email);
                console.log("worked: authApi.sendOtp(email)");
    
            } catch (err) {
                setError(t('auth.sendOtpFailed'));
            }
        }

    const validationSchema = z.object({
        otp: z.string()
            .min(1, t('auth.otpRequired'))
            .length(6, t('auth.otp6Characters'))
    })

    const initialValues = {
        otp: ''
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: toFormikValidationSchema(validationSchema),
        onSubmit: async (values, actions) => {
            try {
                console.log("calling: authApi.verifyOtp({email, otp})");
                const response = await authApi.verifyOtp({ userId: email, otp: values.otp });
                console.log("worked: authApi.verifyOtp({email, otp})");
    
                if (response.data.status) {
                    if (otpMode === 'login') {
                        setOtpMode(undefined);
                        navigate('/home');
                    }
                    else if (otpMode === 'reset-password') {
                        setOtpMode(undefined);
                        setAuthMode('reset-password');
                    }
                    else if (otpMode === 'register') {
                        setOtpMode(undefined);
                        setAuthMode('register');
                    }
                }
                else {
                    setError("Invalid OTP!");
                }
            } catch (err) {
                setError("OTP verification failed!");
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
                // slotProps={{
                //     input: {
                //         readOnly: true,
                //     },
                // }}
                onChange={(e) => {
                    if (e.target.value !== email) {
                        setOtpMode(undefined);
                        setAuthMode('verify-email');
                    }
                }}
            />
            <TextField
                fullWidth
                id="otp"
                name="otp"
                label={t('auth.otp')}
                size="small"
                placeholder={t('auth.otp')}
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
            />
            <Typography onClick={handleResendOtp} sx={{cursor: "pointer"}}>
                {t('auth.resendOtp') || "Resend OTP"}
            </Typography>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{ mt: 2 }}
            >
                {t('auth.verifyOtp') || "Verify OTP"}
            </Button>
        </form>
    )
}
export default Otp;