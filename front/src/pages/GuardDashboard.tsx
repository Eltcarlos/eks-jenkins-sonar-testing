import React, { useState, useEffect } from 'react';
import { assignParking, getAllStudents, getAvailableParkingSpots } from '../services/parkingService';
import { Search, UserCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
  _id: string;
  name: string;
  email: string;
  idUniversity: string;
}

interface ParkingSpot {
  spotNumber: string;
  isAvailable: boolean;
}

const GuardDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Mock data for development - will be replaced with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, these would be API calls
        setStudents([
          { _id: '1', name: 'John Smith', email: 'john@student.edu', idUniversity: 'UNI001' },
          { _id: '2', name: 'Maria Garcia', email: 'maria@student.edu', idUniversity: 'UNI002' },
          { _id: '3', name: 'David Lee', email: 'david@student.edu', idUniversity: 'UNI003' },
          { _id: '4', name: 'Sarah Johnson', email: 'sarah@student.edu', idUniversity: 'UNI004' },
          { _id: '5', name: 'Carlos Rodriguez', email: 'carlos@student.edu', idUniversity: 'UNI123' },
        ]);
        
        setAvailableSpots([
          { spotNumber: 'A1', isAvailable: true },
          { spotNumber: 'A2', isAvailable: true },
          { spotNumber: 'B1', isAvailable: true },
          { spotNumber: 'B2', isAvailable: true },
          { spotNumber: 'C1', isAvailable: true },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.idUniversity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignParking = async () => {
    if (!selectedStudent || !selectedSpot) {
      toast.error('Please select both a student and a parking spot');
      return;
    }

    setIsAssigning(true);
    try {
      // In a real app, this would be an API call
      // await assignParking(selectedStudent._id, selectedSpot);
      
      // Mock successful assignment
      toast.success(`Parking spot ${selectedSpot} assigned to ${selectedStudent.name}`);
      
      // Update available spots
      setAvailableSpots(availableSpots.map(spot => 
        spot.spotNumber === selectedSpot 
          ? { ...spot, isAvailable: false } 
          : spot
      ));
      
      // Clear selection
      setSelectedStudent(null);
      setSelectedSpot('');
    } catch (error) {
      toast.error('Failed to assign parking spot');
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Guard Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage parking assignments for university students</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <UserCheck className="mr-2 text-blue-600" size={20} />
              Select Student
            </h2>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="h-72 overflow-y-auto border border-gray-200 rounded-md">
              {filteredStudents.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <li 
                      key={student._id}
                      className={`p-3 cursor-pointer transition-colors hover:bg-blue-50 ${selectedStudent?._id === student._id ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">ID: {student.idUniversity}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No students found matching your search
                </div>
              )}
            </div>
          </div>
          
          {/* Parking Spot Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <MapPin className="mr-2 text-blue-600" size={20} />
              Select Parking Spot
            </h2>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {availableSpots.map(spot => (
                <button
                  key={spot.spotNumber}
                  disabled={!spot.isAvailable}
                  className={`p-3 rounded-md border transition-colors ${
                    selectedSpot === spot.spotNumber
                      ? 'bg-blue-100 border-blue-300'
                      : spot.isAvailable
                      ? 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => setSelectedSpot(spot.spotNumber)}
                >
                  <span className="font-medium">{spot.spotNumber}</span>
                </button>
              ))}
            </div>
            
            {/* Spot Legend */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm mr-1"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm mr-1"></div>
                <span>Occupied</span>
              </div>
            </div>
            
            {/* Summary & Assignment Button */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">Assignment Summary</h3>
              
              {selectedStudent ? (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Student:</strong> {selectedStudent.name} ({selectedStudent.idUniversity})
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-1">No student selected</p>
              )}
              
              {selectedSpot ? (
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Parking Spot:</strong> {selectedSpot}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No parking spot selected</p>
              )}
              
              <button
                onClick={handleAssignParking}
                disabled={!selectedStudent || !selectedSpot || isAssigning}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
                  !selectedStudent || !selectedSpot || isAssigning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAssigning ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Assigning...
                  </span>
                ) : 'Assign Parking Spot'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Assignments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spot</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm text-gray-800">Carlos Rodriguez</td>
                <td className="py-3 px-4 text-sm text-gray-600">UNI123</td>
                <td className="py-3 px-4 text-sm text-gray-600">A3</td>
                <td className="py-3 px-4 text-sm text-gray-600">{new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-800">Maria Garcia</td>
                <td className="py-3 px-4 text-sm text-gray-600">UNI002</td>
                <td className="py-3 px-4 text-sm text-gray-600">B4</td>
                <td className="py-3 px-4 text-sm text-gray-600">{new Date(Date.now() - 86400000).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;