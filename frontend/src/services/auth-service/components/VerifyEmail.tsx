import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { authApi } from "../api/authApi";
import { AuthMode, Mode, OtpMode } from "../utils/authTypes";

type VerifyEmailProps = {
  email: string;
  setEmail: (email: string) => void;
  setAuthMode: (mode: AuthMode) => void;
  setOtpMode: (mode: OtpMode | undefined) => void;
  setError: (error: string) => void;
  setCurrentMode: (mode: Mode) => void;
};

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  email,
  setEmail,
  setAuthMode,
  setOtpMode,
  setError,
  setCurrentMode,
}) => {
  const { t } = useTranslation();

  const validationSchema = z.object({
    email: z.string()
      .min(1, t("auth.emailRequired"))
      .email(t("auth.invalidEmail")),
  });

  const formik = useFormik({
    initialValues: { email },
    validationSchema: toFormikValidationSchema(validationSchema),
    onSubmit: async (values, actions) => {
      setEmail(values.email);

      try {
        const response = await authApi.verifyEmail(values.email);

        if (response.data.status) {
          setCurrentMode('login');
          setAuthMode("login-password");
        } else {
          await authApi.sendOtp(values.email);
          setCurrentMode('register');
          setOtpMode("register");
          setAuthMode("otp");
        }
      } catch (err) {
        setError(t("auth.emailVerificationFailed"));
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="email"
        name="email"
        label={t("auth.email")}
        size="small"
        placeholder={t("auth.enterEmail")}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={formik.isSubmitting}
        sx={{ mt: 2 }}
      >
        {t("auth.continue") || "Continue"}
      </Button>
    </form>
  );
};

export default VerifyEmail;
