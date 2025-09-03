import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { setCurrentUser } from "../slice/loginSlice";
import './Login.css'

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^[a-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "First letter must be lowercase"
    )
    .required("Required Email"),
  password: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include uppercase, lowercase, number and special character"
    )
    .required("Required min 8 char"),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login.currentUser);

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        const { user } = result;
        dispatch(setCurrentUser(user));

        alert(`LOGIN SUCCESSFULL! Welcome, ${user.firstname || user.email}`);

        if (user.role === "admin") {
          navigate("/Listing");
        } else {
          navigate("/Home");
        }
      } else {
        alert(result.message || "LOGIN FAILED");
      }
    } catch (error) {
      alert("SOMETHING WENT WRONG PLEASE TRY AGAIN.");
    }
  };
  return (
    <div>
      <nav>
        <Link to="/Home">home</Link>
        <Link to="/Inform">information</Link>

        {currentUser?.role === "admin" && <Link to="/Listing">list</Link>}

        {!currentUser && (
          <>
            <Link to="/">Login</Link>
            <Link to="/Register">register</Link>
          </>
        )}
      </nav>

      <div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <h1>Login Form</h1>
            <br />
            <div>
              <label htmlFor="email">Email:</label>
              <Field id="email" name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password:</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit">SUBMIT</button>
            <p>
              Don't have an account? <Link to="/Register">Register here</Link>
            </p>
          </Form>
        </Formik>
      </div>
<footer>
  <h3>THANKYOU FOR VISITING!</h3>
</footer>
    </div>
  );
}

export default Login;

