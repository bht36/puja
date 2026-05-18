// Individual field validators — return error string or null
export const validators = {
  first_name:  (v) => v.trim().length < 2 ? "First name must be at least 2 characters" : /[^a-zA-Z\s]/.test(v) ? "Name must contain letters only" : null,
  last_name:   (v) => v.trim().length < 2 ? "Last name must be at least 2 characters" : /[^a-zA-Z\s]/.test(v) ? "Name must contain letters only" : null,
  fullName:    (v) => /[^a-zA-Z\s]/.test(v) ? "Name must contain letters only" : null,
  city:        (v) => /[^a-zA-Z\s]/.test(v) ? "City must contain letters only" : null,
  phone:       (v) => !/^(97|98)\d{8}$/.test(v) ? "Enter a valid Nepal phone number (97/98XXXXXXXX)" : null,
  postal_code: (v) => v && !/^\d{5}$/.test(v) ? "Postal code must be exactly 5 digits" : null,
  postalCode:  (v) => v && !/^\d{5}$/.test(v) ? "Postal code must be exactly 5 digits" : null,
  username:    (v) => /[^a-zA-Z0-9_]/.test(v) ? "Username can only contain letters, numbers, and underscores" : null,
  email:       (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address" : null,
  password:    (v) => {
    if (v.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(v)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(v)) return "Password must contain at least one number";
    return null;
  },
  weight:      (v) => !/^\d+(\.\d+)?$/.test(v) ? "Weight must be a valid number" : null,
  comment:     (v) => v.trim().length < 10 ? "Comment must be at least 10 characters" : null,
  description: (v) => v.trim().length < 10 ? "Description must be at least 10 characters" : null,
};

export function validateForm(formData, fields, required = fields) {
  const errors = {};
  fields.forEach((field) => {
    const val = (formData[field] ?? "").toString().trim();
    if (required.includes(field) && !val) {
      errors[field] = "This field is required";
      return;
    }
    if (val && validators[field]) {
      const err = validators[field](val);
      if (err) errors[field] = err;
    }
  });
  return errors;
}

export const isValid = (errors) => Object.keys(errors).length === 0;
