import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [docUploading, setDocUploading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
  
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
  
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.error("Image upload error:", error);
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };
  
  
  const handleDocumentUpload = () => {
    if (!documentFile) return;
  
    setDocUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + documentFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, documentFile);
  
    uploadTask.on('state_changed',
      null,
      (error) => {
        toast.error("Failed to upload document.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDocumentUrl(url);
          setFormData((prev) => ({ ...prev, documentUrl: url }));
          setDocUploading(false);
          toast.success("Document uploaded successfully!");
        });
      }
    );
  };
  
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  return (
    <main className='p-3 max-w-5xl mx-auto'>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white mb-8">
        <h1 className='text-3xl font-bold text-center'>Create a New Listing</h1>
        <p className="text-center text-white/80 mt-2">
          Fill in the details below to list your property for sale or rent
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
          {/* Left Side */}
          <div className='flex flex-col gap-5 flex-1'>
            <h2 className="text-xl font-semibold border-b pb-2">Property Details</h2>
            
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Property Title
              </label>
              <input
                type='text'
                placeholder='Luxury Apartment, Family Home, etc.'
                className='border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                id='name'
                maxLength='62'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder='Describe your property in detail...'
                className='border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type='text'
                placeholder='Property address'
                className='border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                id='address'
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>
    
            {/* Checkboxes */}
            <div className="pt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Property Type & Features</h3>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {[
                  { id: 'sale', label: 'For Sale' },
                  { id: 'rent', label: 'For Rent' },
                  { id: 'parking', label: 'Parking Spot' },
                  { id: 'furnished', label: 'Furnished' },
                  { id: 'offer', label: 'Special Offer' }
                ].map(({ id, label }) => (
                  <div className='flex items-center gap-2 bg-gray-50 p-2 rounded-md' key={id}>
                    <input
                      type='checkbox'
                      id={id}
                      className='w-4 h-4 text-blue-600'
                      onChange={handleChange}
                      checked={
                        id === 'sale' || id === 'rent'
                          ? formData.type === id
                          : formData[id]
                      }
                    />
                    <label htmlFor={id} className="text-sm text-gray-700">{label}</label>
                  </div>
                ))}
              </div>
            </div>
    
            {/* Beds, Baths, Prices */}
            <div className="pt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Property Specifications</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {[
                  { id: 'bedrooms', label: 'Bedrooms', min: 1, max: 10 },
                  { id: 'bathrooms', label: 'Bathrooms', min: 1, max: 10 },
                  { id: 'regularPrice', label: 'Regular Price', min: 50, max: 10000000 }
                ].map(({ id, label, min, max }) => (
                  <div className='space-y-1' key={id}>
                    <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
                    <div className="flex items-center">
                      <input
                        type='number'
                        id={id}
                        min={min}
                        max={max}
                        required
                        className='p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        onChange={handleChange}
                        value={formData[id]}
                      />
                      {id === 'regularPrice' && formData.type === 'rent' && (
                        <span className='text-xs ml-2 text-gray-500'>$ / month</span>
                      )}
                    </div>
                  </div>
                ))}
    
                {formData.offer && (
                  <div className='space-y-1'>
                    <label htmlFor="discountPrice" className="text-sm text-gray-600">Discounted Price</label>
                    <div className="flex items-center">
                      <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='10000000'
                        required
                        className='p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      {formData.type === 'rent' && (
                        <span className='text-xs ml-2 text-gray-500'>$ / month</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
    
          {/* Right Side */}
          <div className='flex flex-col gap-5 flex-1'>
            <h2 className="text-xl font-semibold border-b pb-2">Images & Documents</h2>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Property Images
                <span className='text-xs text-gray-500 ml-2'>
                  (The first image will be the cover, max 6)
                </span>
              </label>
              <div className='flex gap-2'>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className='p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                />
                <button
                  type='button'
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className='px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition'
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {imageUploadError && (
                <p className='text-red-700 text-sm'>
                  {imageUploadError}
                </p>
              )}
            </div>
    
            {/* Preview Images */}
            {formData.imageUrls.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Uploaded Images</label>
                <div className="grid grid-cols-2 gap-2">
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className='border rounded-lg overflow-hidden flex flex-col'
                    >
                      <div className="w-full h-32 relative">
                        <img
                          src={url}
                          alt={`listing image ${index+1}`}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className="bg-gray-50 p-2">
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='w-full text-red-600 text-sm hover:text-red-800 transition'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
    
            {/* 📄 Document Upload */}
            <div className='border p-4 rounded-lg bg-gray-50'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Property Documents (PDF/DOCX)
              </label>
              <input
                type='file'
                accept='.pdf,.doc,.docx'
                onChange={(e) => setDocumentFile(e.target.files[0])}
                className='mb-3 w-full border p-2 rounded-lg bg-white'
              />
              <button
                type='button'
                onClick={handleDocumentUpload}
                disabled={docUploading}
                className='w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition'
              >
                {docUploading ? 'Uploading...' : 'Upload Document'}
              </button>
              {documentUrl && (
                <div className="bg-white p-3 mt-3 rounded-lg border border-green-200 flex justify-between items-center">
                  <p className='text-green-600 text-sm'>
                    Document uploaded successfully
                  </p>
                  <a
                    href={documentUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 text-sm hover:underline'
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
    
            {/* Submit */}
            <button
              disabled={loading || uploading}
              className='mt-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg uppercase font-medium hover:opacity-95 disabled:opacity-70 transition'
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
      
      {/* Back button */}
      <div className="text-center">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:underline flex items-center justify-center mx-auto"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Profile
        </button>
      </div>
    </main>
  );
}
