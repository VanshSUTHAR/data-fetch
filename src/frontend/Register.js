import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { registerUser } from "../slice/registerSlice";
import './Register.css'

const validationSchema = yup.object().shape({
  firstname: yup.string().matches(/^[A-Za-z\s'-]+$/, 'Only Characters Allowed').required('Required First Name'),
  lastname: yup.string().matches(/^[A-Za-z\s'-]+$/, 'Only Characters Allowed').required('Required Last Name'),
  gender: yup.string().oneOf(['Male', 'female', 'other'], 'Must choose one').required('Gender is required'),
  email: yup.string().matches(/^[a-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'First letter must be lowercase').required('Required Email'),
  birthDate: yup.date().required('Birth Date is required').max(new Date(), 'Birth Date cannot be in the future'),
  password: yup.string().min(8).matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must include uppercase, lowercase, number and special character'
  ).required('Required min 8 char'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password does not match').required('Confirm Password is required'),
  mobile: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
});

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.login.currentUser);

  const handleSubmit = async (values) => {
    const newUser = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      birthDate: values.birthDate,
      mobile: values.mobile,
      gender: values.gender,
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(registerUser(result.user));
        alert('Registration successful!');
        navigate('/Login');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <nav>
        <Link to="/Home">home</Link>
        <Link to="/Inform">information</Link>
        {currentUser?.role === 'admin' && <Link to="/Listing">list</Link>}
        {!currentUser && (
          <>
            <Link to="/">Login</Link>
            <Link to="/Register">register</Link>
          </>
        )}
      </nav>

      <div>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            mobile: '',
            gender: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <h1>Register Form</h1>

            <div>
              <label htmlFor="firstname">First Name:</label>
              <Field id="firstname" name="firstname" type="text" placeholder="First Name" />
              <ErrorMessage name="firstname" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="lastname">Last Name:</label>
              <Field id="lastname" name="lastname" type="text" placeholder="Last Name" />
              <ErrorMessage name="lastname" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="gender">Gender:</label>
              <Field as="select" id="gender" name="gender">
                <option value="">--- Select Gender ---</option>
                <option value="Male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="birthDate">Birth Date:</label>
              <Field id="birthDate" name="birthDate" type="date" />
              <ErrorMessage name="birthDate" component="div" className="error" />
            </div>

            <div >
              <label htmlFor="mobile">Mobile:</label>
              <Field id="mobile" name="mobile" tupe="text" placeholder="Mobile Number" />
              <ErrorMessage name="mobile" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <Field id="email" name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field id="password" name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit">SUBMIT</button>
            <p>Already registered? <Link to="/Login">Login here</Link></p>
          </Form>
        </Formik>
      </div>
       <footer>
               <h3>THANKYOU FOR VISITING!</h3>
      </footer>
   
    </div>
  );
}

export default Register;
