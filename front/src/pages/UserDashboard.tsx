import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserParking } from '../services/parkingService';
import { Car, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ParkingInfo {
  _id: string;
  spotNumber: string;
  assignedDate: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [parking, setParking] = useState<ParkingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        const data = await getUserParking();
        setParking(data);
      } catch (error) {
        console.error('Error fetching parking info:', error);
        toast.error('Failed to load parking information');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mb-4">University ID: {user?.idUniversity}</p>
        <div className="h-0.5 bg-gray-100 my-4"></div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Car className="mr-2 text-blue-600" size={20} />
            Your Parking Information
          </h2>
          
          {parking ? (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Spot {parking.spotNumber}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Assigned on {new Date(parking.assignedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                    Active
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Important Information:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Your parking permit is valid until the end of the semester</li>
                  <li>• Please display your student ID on your dashboard when parked</li>
                  <li>• Parking in any other spot may result in a fine</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Parking Spot Assigned</h3>
                  <p className="text-gray-600">
                    You don't have a parking spot assigned yet. Please contact a parking administrator or guard to get a spot assigned to you.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Parking Rules</h2>
        <div className="space-y-3 text-gray-600">
          <p>• Parking is available from 6:00 AM to 11:00 PM daily</p>
          <p>• Always park within the designated lines of your assigned spot</p>
          <p>• Vehicles without valid permits will be towed at owner's expense</p>
          <p>• Report any issues to the campus security office</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;