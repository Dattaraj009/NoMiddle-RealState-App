import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PanVerification() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    panNumber: currentUser.panNumber || '',
    aadharNumber: currentUser.aadharNumber || '',
  });
  const [files, setFiles] = useState({
    panImage: null,
    aadharImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectAfter = location.state?.redirectAfter || '/profile';

  // Close popup and redirect to profile or specified redirect
  useEffect(() => {
    let redirectTimer;
    if (showPopup && popupType === 'success') {
      redirectTimer = setTimeout(() => {
        setShowPopup(false);
        navigate(redirectAfter, { 
          state: { fromVerification: true, success: true } 
        });
      }, 3000); // Redirect after 3 seconds
    }
    
    return () => clearTimeout(redirectTimer);
  }, [showPopup, popupType, navigate, redirectAfter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('pancard', formData.panNumber);
      formDataToSubmit.append('aadharcard', formData.aadharNumber);

      if (files.panImage) {
        formDataToSubmit.append('panDocument', files.panImage);
      }

      if (files.aadharImage) {
        formDataToSubmit.append('aadharDocument', files.aadharImage);
      }

      // For debugging
      console.log('FormData contents:');
      for (let pair of formDataToSubmit.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await fetch(`/api/user/verify-documents`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSubmit
      });

      const data = await res.json();

      if (data.success === false) {
        setPopupType('error');
        setPopupMessage(data.message);
        setShowPopup(true);
        
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
        
        return;
      }

      setPopupType('success');
      setPopupMessage('Documents submitted successfully! They will be verified shortly.');
      setShowPopup(true);
      
      setTimeout(() => {
        setShowPopup(false);
        // Navigate back to profile with state indicating successful submission
        navigate('/profile', { state: { fromVerification: true, success: true } });
      }, 3000);
    } catch (error) {
      setPopupType('error');
      setPopupMessage(error.message);
      setShowPopup(true);
      
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Close popup and handle redirection manually if the timer doesn't work
  const handleClosePopup = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      navigate(redirectAfter, { 
        state: { fromVerification: true, success: true } 
      });
    }
  };

  return (
    <div className='p-5 max-w-3xl mx-auto bg-white shadow-md rounded-lg relative'>
      {showPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full ${
            popupType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${
              popupType === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {popupType === 'success' ? 'Success!' : 'Error'}
            </h3>
            <p className='text-gray-700'>{popupMessage}</p>
            {popupType === 'success' && (
              <p className='text-sm text-gray-500 mt-2'>
                Redirecting to {redirectAfter === '/profile' ? 'profile' : 'create listing'} page...
              </p>
            )}
            <button
              onClick={handleClosePopup}
              className='mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
            >
              {popupType === 'success' ? `Go to ${redirectAfter === '/profile' ? 'Profile' : 'Create Listing'}` : 'Close'}
            </button>
          </div>
        </div>
      )}

      <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Document Verification</h2>
      
      {/* Show message about where user will be redirected */}
      {redirectAfter === '/create-listing' && (
        <div className='mb-6 p-3 bg-blue-50 text-blue-700 rounded-md text-center'>
          After verification, you'll be redirected to create your listing
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='border-b pb-6'>
          <h3 className='text-lg font-medium mb-4 text-gray-700'>PAN Card Details</h3>
          <div className='space-y-4'>
            <div>
              <label htmlFor='panNumber' className='block text-sm font-medium text-gray-700 mb-1'>PAN Number</label>
              <input
                id='panNumber'
                type='text'
                placeholder='Enter PAN Number (e.g., ABCDE1234F)'
                className='border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                title='Enter a valid PAN number (e.g., ABCDE1234F)'
                required
              />
            </div>
            <div>
              <label htmlFor='panImage' className='block text-sm font-medium text-gray-700 mb-1'>PAN Card Document</label>
              <input
                id='panImage'
                type='file'
                accept='image/*,application/pdf'
                onChange={(e) => setFiles({ ...files, panImage: e.target.files[0] })}
                className='border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Upload PAN card image or PDF (max 2MB)
              </p>
            </div>
          </div>
        </div>

        <div className='pt-2'>
          <h3 className='text-lg font-medium mb-4 text-gray-700'>Aadhaar Card Details</h3>
          <div className='space-y-4'>
            <div>
              <label htmlFor='aadharNumber' className='block text-sm font-medium text-gray-700 mb-1'>Aadhaar Number</label>
              <input
                id='aadharNumber'
                type='text'
                placeholder='Enter Aadhaar Number (e.g., 1234 5678 9012)'
                className='border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                value={formData.aadharNumber}
                onChange={(e) => {
                  // Allow only numbers and format with spaces
                  const value = e.target.value.replace(/\D/g, '');
                  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                  setFormData({ ...formData, aadharNumber: formattedValue });
                }}
                pattern="[0-9]{4} [0-9]{4} [0-9]{4}"
                title='Enter a valid 12-digit Aadhaar number'
                required
              />
            </div>
            <div>
              <label htmlFor='aadharImage' className='block text-sm font-medium text-gray-700 mb-1'>Aadhaar Card Document</label>
              <input
                id='aadharImage'
                type='file'
                accept='image/*,application/pdf'
                onChange={(e) => setFiles({ ...files, aadharImage: e.target.files[0] })}
                className='border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                Upload Aadhaar card image or PDF (max 2MB)
              </p>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-70 font-medium mt-4 transition duration-200'
        >
          {loading ? 'Submitting...' : 'Submit Documents for Verification'}
        </button>
        
        {/* Show "Go back" button */}
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='text-gray-600 p-2 text-center hover:underline'
        >
          ← Go back
        </button>
      </form>
      {error && !showPopup && (
        <div className={`mt-4 p-3 rounded-md bg-red-50 text-red-700`}>
          {error}
        </div>
      )}
    </div>
  );
}