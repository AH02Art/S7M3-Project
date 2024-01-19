// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import axios from "axios";
import * as yup from "yup";

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const formSchema = yup.object().shape({
  username: yup
    .string()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .required(e.favLanguageRequired)
    .oneOf(["javascript", "rust"], e.favLanguageOptions),
  favFood: yup
    .string()
    .required(e.favFoodRequired)
    .oneOf(["pizza", "spaghetti", "broccoli"], e.favFoodOptions),
  agreement: yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions)
});

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
function initialValues() {
  return { username: "", favLanguage: "", favFood: "", agreement: false };
};
function initialErrors() {
  return { username: "", favLanguage: "", favFood: "", agreement: false };
};

export default function App() {
  const [values, setValues] = useState(initialValues());
  const [errors, setErrors] = useState(initialErrors());
  const [success, setSuccess] = useState();
  const [failure, setFailure] = useState();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    formSchema.isValid(values).then(setEnabled);
  }, [values]);

  const onChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type === "checkbox" ? checked : value;
    setValues({ ...values, [name]: value });
    yup.reach(formSchema, name).validate(value)
      .then(() => setErrors({ errors, [name]: "" }))
      .catch((error) => setErrors({ errors, [name]: error.errors[0] }))
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios.post("https://webapis.bloomtechdev.com/registration", values)
    .then((response) => {
      setValues(initialValues());
      setSuccess(response.data.message);
      setFailure();
    })
    .catch((error) => {
      setSuccess("");
      setFailure(error.response.data.message)

    })
  };

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className="success">{success}</h4>}
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={values.username} onChange={onChange} />
          { errors.username && <div className="validation">{errors.username}</div> }
        </div>
        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" checked={values.favLanguage === "javascript"} onChange={onChange} />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" checked={values.favLanguage === "rust"} onChange={onChange} />
              Rust
            </label>
          </fieldset>
          { errors.favLanguage && <div className="validation">{errors.favLanguage}</div> }
        </div>
        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" value={values.favFood} onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          { errors.favFood && <div className="validation">{errors.favFood}</div> }
        </div>
        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" checked={values.agreement} onChange={onChange} />
            Agree to our terms
          </label>
          { errors.agreement && <div className="validation">{errors.agreement}</div> }
        </div>
        <div>
          <input type="submit" disabled={!enabled} />
        </div>
      </form>
    </div>
  )
}
