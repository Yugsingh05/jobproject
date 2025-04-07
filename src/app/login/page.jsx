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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../FireBase";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { useAuthStore } from "@/store/AuthStore";
 
import { useRouter } from 'next/navigation'


const auth = getAuth(app);



const Login = () => {

  const {user, setUser  } = useAuthStore();

  const router = useRouter();

  if(!user.email){
    router.push('/signup')
  }

  if(user.email){
    router.push('/')}


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Enter a valid email")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        console.log("Logged in:", userCredential.user);
        toast.success("Login successful!");
        resetForm();
        // You can redirect or store user here
      } catch (error) {
        console.error("Login error:", error.message);
        toast.error("Login failed: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });



  console.log("user", user);
  

  return (
    <Container

      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white w-full"
    >
      <Box
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300"
        sx={{
          "& .MuiTextField-root": { marginBottom: 2 },
        }}
      >
        <Typography
          variant="h4"
          className="text-center text-neutral-800 font-bold mb-4 tracking-tight"
        >
          Welcome Back
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-center text-gray-500 mb-8"
        >
          Log in to your account
        </Typography>

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
            error={formik.touched.password && Boolean(formik.errors.password)}
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

        <Typography
          variant="body2"
          className="text-center text-gray-600 mt-6 tracking-wide"
        >
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </Typography>
      </Box>

      <ToastContainer />
    </Container>
  );
};

export default Login;
