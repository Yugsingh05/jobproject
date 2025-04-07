"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
} from "@mui/material";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../FireBase";
import { toast, ToastContainer } from "react-toastify";
import { useAuthStore } from "@/store/AuthStore";
 
import { useRouter } from 'next/navigation'
import Link from "next/link";

// Initialize Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// SignUp Component
const SignUp = () => {
  // Formik Setup with Yup Validation


  const {user,setUser} = useAuthStore();


const router = useRouter();

if(user?.email){
  router.push('/')}



  const handleGoogleLogin = async () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)

      console.log("user", user);
      console.log("token", token);
      console.log("credential", credential);
      setUser(user); // Store user in Zustand store
      toast.success("Google login successful!");
      // ...
    }).catch((error) => {
     
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
   
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google login error:", errorMessage);
      // ...
    });
  }



  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        console.log("User signed up successfully:", userCredential.user);
        setUser(userCredential.user); // Store user in Zustand store
        toast.success("User signed up successfully!"); // Notify user of success
       router.push('/login')

       
        resetForm();
      } catch (error) {
        console.error("Error signing up:", error.message);
        toast.error("Error signing up: " + error.message); // Notify user of error

      } finally {
        setSubmitting(false); // Ensure the submit button is re-enabled
      }
    },
  });

  return (
    <Container maxWidth="sm" className="flex items-center justify-center h-screen">
      <Box
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        sx={{
          "& .MuiTextField-root": { marginBottom: 2 },
        }}
      >
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Sign Up
        </Typography>

        {/* Error Alert (Optional) */}
        {formik.errors.submit && (
          <Alert severity="error" className="mb-4">
            {formik.errors.submit}
          </Alert>
        )}

<form onSubmit={formik.handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            className="rounded-lg"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password && Boolean(formik.errors.password)
            }
            helperText={formik.touched.password && formik.errors.password}
            className="rounded-lg"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            {formik.isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          startIcon={
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              className="w-5 h-5"
            />
          }
          sx={{
            mt: 2,
            textTransform: "none",
            borderColor: "#d1d5db",
            color: "#374151",
            "&:hover": {
              backgroundColor: "#f3f4f6",
              borderColor: "#d1d5db",
            },
          }}
          className="font-semibold py-3 px-4 rounded-lg transition-all"
        >
          Continue with Google
        </Button>

        <Typography
          variant="body2"
          className="text-center text-gray-600 mt-6 tracking-wide"
        >
           Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
      <ToastContainer/>
    </Container>
  );
};

export default SignUp;