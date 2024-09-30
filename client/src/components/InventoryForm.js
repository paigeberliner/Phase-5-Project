import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../index.css'; // Make sure the CSS is linked

const InventoryForm = () => {
  // Form validation schema
  const formSchema = yup.object().shape({
    URL: yup.string().url("Invalid URL format").required("URL is required"),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      URL: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log("Form submitted:", values);
    },
  });

  return (
    <div className="inventory-form-container">
      <h2 className="inventory-header">Check Size Inventory</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <label htmlFor="URL">URL</label>
          <input
            id="URL"
            name="URL"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.URL}
            className={formik.touched.URL && formik.errors.URL ? "input-error" : ""}
          />
          {formik.touched.URL && formik.errors.URL ? (
            <div className="error">{formik.errors.URL}</div>
          ) : null}
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default InventoryForm;
