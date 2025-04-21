import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBed, FaBath, FaChair, FaMapMarkerAlt, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/favorites/${currentUser._id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        
        if (res.ok) {
          setFavorites(data);
        } else {
          toast.error(data.message || 'Failed to fetch favorites');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [currentUser, navigate]);

  const handleRemoveFavorite = async (listingId) => {
    try {
      setRemovingId(listingId);
      
      const res = await fetch(`/api/user/favorites/remove/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success) {
        setFavorites(favorites.filter(listing => listing._id !== listingId));
        toast.success('Removed from favorites');
      } else {
        toast.error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      toast.error('Error removing favorite');
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Your Favorite Properties</h1>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <FaRegHeart className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Save properties you're interested in by clicking the heart icon on any listing
            </p>
          </div>
          <Link 
            to="/" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((listing) => (
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Remove from favorites button */}
              <button
                onClick={() => handleRemoveFavorite(listing._id)}
                disabled={removingId === listing._id}
                className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-red-50 transition z-10"
                title="Remove from favorites"
              >
                <FaRegHeart className={`${removingId === listing._id ? 'text-gray-400' : 'text-red-500'} text-lg`} />
              </button>
              
              <div className="p-4">
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{listing.name}</h3>
                </Link>
                
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <FaMapMarkerAlt className="text-blue-500 mr-1" />
                  <p className="line-clamp-1">{listing.address}</p>
                </div>
                
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{listing.description}</p>
                
                <div className="flex justify-between text-sm text-gray-700 mb-4">
                  <span className="flex items-center"><FaBed className="mr-1 text-blue-500" /> {listing.bedrooms}</span>
                  <span className="flex items-center"><FaBath className="mr-1 text-blue-500" /> {listing.bathrooms}</span>
                  <span className="flex items-center">
                    <FaChair className="mr-1 text-blue-500" /> {listing.furnished ? 'Furnished' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg text-blue-600">
                      ₹{listing.offer 
                        ? listing.discountPrice.toLocaleString('en-IN') 
                        : listing.regularPrice.toLocaleString('en-IN')}
                    </span>
                    {listing.type === 'rent' && <span className="text-gray-500 text-sm"> /month</span>}
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 