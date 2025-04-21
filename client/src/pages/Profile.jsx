import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure, 
  signOutUserStart 
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is coming from verification page
  useEffect(() => {
    if (location.state?.fromVerification && location.state?.success) {
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserListings(data);
      setActiveTab('listings');
    } catch (error) {
      console.error(error);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  // Navigate to the verification page
  const handleVerify = () => {
    navigate('/pan-verification');
  };

  if (!currentUser) {
    return (
      <div className='p-4 max-w-lg mx-auto flex flex-col items-center'>
        <p className='text-xl mb-4'>Sign in to view your profile</p>
        <Link to='/sign-in' className='bg-blue-500 text-white p-2 rounded hover:bg-blue-700'>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-2xl font-semibold text-center my-4'>Profile</h1>
      
      {/* Tabs */}
      <div className='flex border-b mb-4'>
        <button 
          className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-gray-800' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'listings' ? 'border-b-2 border-gray-800' : ''}`}
          onClick={handleShowListings}
        >
          Listings
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'favorites' ? 'border-b-2 border-gray-800' : ''}`}
          onClick={handleFavorites}
        >
          Favorites
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          {/* Verification Status Section */}
          <div className='mb-6 p-4 border rounded-lg bg-gray-50'>
            <h3 className='text-lg font-semibold mb-2'>Document Verification Status</h3>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span>PAN Card:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  currentUser.panVerified 
                    ? 'bg-green-100 text-green-700' 
                    : currentUser.panNumber 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                }`}>
                  {currentUser.panVerified 
                    ? 'Verified' 
                    : currentUser.panNumber 
                      ? 'Pending' 
                      : 'Not Submitted'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span>Aadhaar Card:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  currentUser.isAadharVerified 
                    ? 'bg-green-100 text-green-700' 
                    : currentUser.aadharNumber 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                }`}>
                  {currentUser.isAadharVerified 
                    ? 'Verified' 
                    : currentUser.aadharNumber 
                      ? 'Pending' 
                      : 'Not Submitted'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleVerify}
              className='mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'
            >
              {currentUser.panNumber && currentUser.aadharNumber ? 'Update Documents' : 'Verify Documents'}
            </button>
            
            {(currentUser.panNumber || currentUser.aadharNumber) && 
              !currentUser.panVerified && !currentUser.isAadharVerified && (
                <p className='text-xs text-gray-500 mt-2 text-center'>
                  Your documents are under review by our team.
                </p>
              )
            }
          </div>

          {/* Existing Profile Form */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              type='text'
              placeholder='Username'
              defaultValue={currentUser.username}
              id='username'
              onChange={handleChange}
              className='border p-3 rounded-lg'
            />
            <input
              type='email'
              placeholder='Email'
              defaultValue={currentUser.email}
              id='email'
              onChange={handleChange}
              className='border p-3 rounded-lg'
            />
            <input
              type='password'
              placeholder='Password'
              id='password'
              onChange={handleChange}
              className='border p-3 rounded-lg'
            />
            <img src={currentUser.avatar} alt="Profile" className='h-24 w-24 rounded-full object-cover cursor-pointer mx-auto' />

            <button
              className='bg-green-600 text-white p-3 rounded-lg uppercase hover:bg-green-700 disabled:opacity-80'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
            
            <Link
              className='bg-blue-600 text-white p-3 rounded-lg uppercase text-center hover:bg-blue-700 disabled:opacity-80'
              to='/create-listing'
            >
              Create Listing
            </Link>

            <div className='flex justify-between mt-4'>
              <span
                onClick={handleDelete}
                className='text-red-600 cursor-pointer'
              >
                Delete account
              </span>
              <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>
                Sign out
              </span>
            </div>

            {error && <p className='text-red-500'>{error}</p>}
            {updateSuccess && (
              <p className='text-green-500'>
                {location.state?.fromVerification 
                  ? 'Documents submitted successfully!' 
                  : 'User updated successfully'}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className='flex flex-col gap-4'>
          {userListings.length === 0 ? (
            <p>You have no listings</p>
          ) : (
            userListings.map((listing) => (
              <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className='h-16 w-16 object-cover'
                  />
                </Link>
                <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-700 hover:underline truncate'>
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col item-center'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-600'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-600'>Edit</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className='flex flex-col gap-4 items-center'>
          <p>View your favorite properties</p>
          <button
            onClick={handleFavorites}
            className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700'
          >
            Go to Favorites
          </button>
        </div>
      )}
    </div>
  );
}