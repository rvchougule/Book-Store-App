export const validateConfig = {
  fullName: [{ required: true, message: "Full Name is required" }],
  username: [
    { required: true, message: "username is required" },
    {
      pattern: /^[A-Za-z]+$/,
      message: "Username must not contain any numeric characters and symbols",
    },
  ],
  email: [
    { required: true, message: "Email is required" },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  ],
  avatar: [{ required: true, message: "avtar is required" }],
  password: [
    { required: true, message: "Password is required" },
    {
      minlength: 8,
      message: "Password should be at least 8 characters long",
    },
    {
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/,
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    },
  ],
  confirmPassword: [
    { required: true, message: "Confirm Password is required" },
    {
      minlength: 8,
      message: "Password should be at least 8 characters long",
    },
    {
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/,
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    },
    {
      matchPassword: true, // Custom rule to match passwords
      message: "Password and Confirm Password do not match",
    },
  ],
};
