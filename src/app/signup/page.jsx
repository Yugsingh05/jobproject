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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../FireBase";
import { toast, ToastContainer } from "react-toastify";
import { useAuthStore } from "@/store/AuthStore";
 
import { useRouter } from 'next/navigation'

// Initialize Firebase Authentication
const auth = getAuth(app);


// SignUp Component
const SignUp = () => {
  // Formik Setup with Yup Validation

  const {setUser} = useAuthStore();

const router = useRouter();



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

        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            className="mb-4"
          />

          {/* Password Field */}
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
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            className="mb-6"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting} // Disable the button while submitting
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Box>
      <ToastContainer/>
    </Container>
  );
};

export default SignUp;