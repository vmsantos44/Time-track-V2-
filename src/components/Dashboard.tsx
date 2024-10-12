import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface TimeEntry {
  id: number;
  userId: number;
  projectId: number;
  startTime: string;
  endTime: string;
  duration: number;
}

const Dashboard: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const response = await api.get(`/time-entries/${user?.id}`);
        setTimeEntries(response.data);
        const total = response.data.reduce((acc: number, entry: TimeEntry) => acc + entry.duration, 0);
        setTotalHours(total / 3600); // Convert seconds to hours
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    };

    if (user) {
      fetchTimeEntries();
    }
  }, [user]);

  const chartData = timeEntries.map((entry) => ({
    date: new Date(entry.startTime).toLocaleDateString(),
    hours: entry.duration / 3600,
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Total Hours Worked</h3>
        <p className="text-3xl font-bold text-blue-600">{totalHours.toFixed(2)} hours</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Hours Worked by Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Time Entries</h3>
        <ul className="divide-y divide-gray-200">
          {timeEntries.slice(0, 5).map((entry) => (
            <li key={entry.id} className="py-4">
              <p className="text-sm font-medium text-gray-900">
                {new Date(entry.startTime).toLocaleDateString()} -{' '}
                {new Date(entry.startTime).toLocaleTimeString()} to{' '}
                {new Date(entry.endTime).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {(entry.duration / 3600).toFixed(2)} hours
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;