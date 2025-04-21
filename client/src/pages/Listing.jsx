import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaArrowLeft,
  FaRegHeart,
  FaHeart,
  FaDownload,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Contact from '../components/Contact';
import { toast } from 'react-toastify';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Check if listing is in user's favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUser) return;
      
      try {
        const res = await fetch(`/api/user/favorites/${currentUser._id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        
        if (data.success === false) {
          toast.error(data.message);
          return;
        }
        
        const isFavorite = data.some(favListing => favListing._id === params.listingId);
        setFavorite(isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [currentUser, params.listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      toast.info('Please sign in to add favorites');
      navigate('/sign-in');
      return;
    }
    
    try {
      setFavLoading(true);
      
      if (favorite) {
        // Remove from favorites
        const res = await fetch(`/api/user/favorites/remove/${params.listingId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        const data = await res.json();
        
        if (data.success) {
          setFavorite(false);
          toast.success('Removed from favorites');
        } else {
          toast.error(data.message || 'Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const res = await fetch(`/api/user/favorites/add/${params.listingId}`, {
          method: 'POST',
          credentials: 'include',
        });
        
        const data = await res.json();
        
        if (data.success) {
          setFavorite(true);
          toast.success('Added to favorites');
        } else {
          toast.error(data.message || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      toast.error('Error updating favorites');
      console.error(error);
    } finally {
      setFavLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      setDeleting(true);
      const res = await fetch(`/api/listing/delete/${params.listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success === false) {
        toast.error(data.message);
        setDeleting(false);
        return;
      }
      
      toast.success('Listing deleted successfully!');
      setDeleting(false);
      navigate('/profile');
    } catch (error) {
      setDeleting(false);
      toast.error('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">We couldn't load this listing. Please try again later.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50">
      {listing && (
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="p-4">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to search</span>
            </button>
          </div>

          {/* Image slider */}
          <div className="relative">
            <Swiper 
              navigation 
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded-lg overflow-hidden shadow-lg"
              style={{ height: '550px' }}
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[550px] w-full'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button 
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`p-3 rounded-full shadow-md transition duration-200 ${
                  favLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-100'
                }`}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                {favorite ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-700 text-xl" />
                )}
              </button>
              <button 
                onClick={handleShare} 
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
                title="Share listing"
              >
                <FaShare className="text-gray-700 text-xl" />
              </button>
            </div>
            
            {copied && (
              <div className="absolute top-20 right-4 z-10 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md">
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Main details - left section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-blue-600">₹{' '}
                      {listing.offer
                        ? listing.discountPrice.toLocaleString('en-IN')
                        : listing.regularPrice.toLocaleString('en-IN')}
                    </span>
                    {listing.type === 'rent' && 
                      <span className="text-gray-500 text-sm ml-1">/ month</span>
                    }
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  <p>{listing.address}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                    ${listing.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                  {listing.offer && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100).toFixed(0)}% Off
                    </span>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-3">Property Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <FaBed className="text-blue-500 text-2xl mb-2" />
                      <span className="text-gray-800 font-medium">{listing.bedrooms} {listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <FaBath className="text-blue-500 text-2xl mb-2" />
                      <span className="text-gray-800 font-medium">{listing.bathrooms} {listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <FaParking className="text-blue-500 text-2xl mb-2" />
                      <span className="text-gray-800 font-medium">{listing.parking ? 'Parking' : 'No Parking'}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <FaChair className="text-blue-500 text-2xl mb-2" />
                      <span className="text-gray-800 font-medium">{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Document section (if there's a document URL) */}
              {listing.documentUrl && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Property Documents</h2>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Property Documentation</p>
                      <p className="text-sm text-gray-600">View or download property documents</p>
                    </div>
                    <div className="flex space-x-2">
                      <a 
                        href={listing.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 bg-white rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        <FiExternalLink className="mr-1" /> View
                      </a>
                      <a 
                        href={listing.documentUrl} 
                        download
                        className="flex items-center px-3 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition"
                      >
                        <FaDownload className="mr-1" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - right section */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-4 space-y-6">
                {/* Owner Action Buttons */}
                {currentUser && listing.userRef === currentUser._id && (
                  <div className="space-y-3 border-b pb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Listing Management</h3>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
                      >
                        <FaEdit /> Edit Listing
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition"
                      >
                        <FaTrash /> {deleting ? 'Deleting...' : 'Delete Listing'}
                      </button>
                    </div>
                  </div>
                )}

                {listing.offer && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">Special Offer!</p>
                    <div className="flex items-baseline mt-1">
                      <p className="text-gray-500 line-through">₹{listing.regularPrice.toLocaleString('en-IN')}</p>
                      <p className="text-2xl font-bold text-green-700 ml-2">
                        ₹{listing.discountPrice.toLocaleString('en-IN')}
                        {listing.type === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
                      </p>
                    </div>
                    <p className="text-sm text-green-800 mt-1">Save ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact the Owner</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Interested in this property? Get in touch with the owner directly.
                  </p>
                  
                  {currentUser && listing.userRef !== currentUser._id ? (
                    !contact ? (
                      <button
                        onClick={() => setContact(true)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                      >
                        Contact Owner
                      </button>
                    ) : (
                      <Contact listing={listing} />
                    )
                  ) : currentUser && listing.userRef === currentUser._id ? (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">This is your listing</p>
                    </div>
                  ) : (
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 mb-2">Sign in to contact the owner</p>
                      <Link to="/sign-in" className="text-blue-600 hover:underline">
                        Sign in now
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-gray-500 text-sm mb-2">Property Reference</h3>
                  <p className="text-gray-900 font-mono">#{params.listingId.substring(0, 8)}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Listed {new Date(listing.createdAt || Date.now()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
