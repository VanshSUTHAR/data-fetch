import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import './Listing.css'
const Listing = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = useSelector(state => state.login.currentUser);
  const userRole = currentUser?.role;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const fetchUsers = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/Home');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users?email=${currentUser.email}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        alert(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await fetch(`http://localhost:5000/api/Active/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateUser = async (id) => {
    const field = prompt("WHICH FIELD YOU WANT TO DELETE?\nOptions: firstname, lastname, email, mobile, gender, birthDate");
    const validFields = ['firstname', 'lastname', 'email', 'mobile', 'gender', 'birthDate'];
    if (!validFields.includes(field)) return alert('INVALID FIELD');
    const newValue = prompt(`ENTER NEW VALUE FOR FIELD ${field}:`);
    if (!newValue) return alert('VALUE CANNOT BE EMPTY');

    try {
      const response = await fetch(`http://localhost:5000/api/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue }),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'UPDATE FAILED');
      } else {
        alert('USER UPDATED SUCCESSFULLY');
        fetchUsers();
      }
    } catch (error) {
      console.error('ERROR UPDATING USER:', error);
    }
  };

  const deleteAll = async () => {
    if (!window.confirm('ARE YOU SURE YOU WANT TO DELETE ALL USERS?')) return;
    try {
      await fetch('http://localhost:5000/api/delete', { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('ARE YOU SURE YOU WANT TO DELETE USER?')) return;
    try {
      await fetch(`http://localhost:5000/api/delete/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const total = users.length;
  const active = users.filter(u => u.active).length;

  return (
    <div>
      <nav>
        <Link to="/Home">Home</Link>
        <Link to="/Inform">Information</Link>

        {userRole?.role === "admin" && <Link to="/Listing">List</Link>}

        {!userRole && (
          <>
            <Link to="/">Login</Link>
            <Link to="/Register">Register</Link>
          </>
        )}
      </nav>
      <div>
        <div>
          <div>
            <div>
              <h2>Registered Users</h2>
              <div>
                <p>Total Users: {total}</p>
                <p>Active Users: {active}</p>
              </div>
            </div>
            <button onClick={deleteAll} >REMOVE</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>firstname</th>
                <th>lastname</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>Birth Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.gender}</td>
                    <td>{new Date(user.birthDate).toLocaleDateString()}</td>
                    <td>
                      <span className={user.active ? 'status-active' : 'status-inactive'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button  onClick={() => toggleStatus(user._id, user.active)}>
                        {user.active ? 'Inactivate' : 'Activate'}
                      </button>
                      <button  onClick={() => updateUser(user._id)}>Update</button>
                      <button  onClick={() => deleteUser(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No User Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer>
               <h3>THANKYOU FOR VISITING!</h3>
      </footer>
    </div>
  );
};


export default Listing;
