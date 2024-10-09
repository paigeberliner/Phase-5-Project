import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../index.css'; // Make sure the CSS is linked

const InventoryForm = ({ setAllUrls }) => {
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
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/urls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: values.URL }),
          mode: 'cors', // Ensure CORS mode is set
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Form submitted successfully:', data);

        // Update state in parent component
        setAllUrls(prevUrls => [...prevUrls, data]);

        // Reset the form after submission
        formik.resetForm();
      } catch (error) {
        console.error('Error submitting the URL:', error);
      }
    }
  });

  return (
    <div className="inventory-form-container">
      <h2 className="inventory-header">Submit a URL to Check Inventory</h2>
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