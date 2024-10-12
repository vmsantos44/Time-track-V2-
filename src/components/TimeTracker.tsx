import React, { useState, useEffect } from 'react';
import { Play, Pause, Coffee } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TimeTracker: React.FC = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProject, setCurrentProject] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let interval: number;
    if (isWorking && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, isOnBreak]);

  const handleClockIn = async () => {
    if (!currentProject) {
      alert('Please select a project before clocking in.');
      return;
    }
    const now = new Date();
    setStartTime(now);
    setIsWorking(true);
    setElapsedTime(0);
    try {
      await api.post('/time-entries', {
        userId: user?.id,
        projectId: currentProject,
        startTime: now.toISOString(),
      });
    } catch (error) {
      console.error('Error clocking in:', error);
    }
  };

  const handleClockOut = async () => {
    setIsWorking(false);
    setIsOnBreak(false);
    try {
      await api.put(`/time-entries/${user?.id}/current`, {
        endTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clocking out:', error);
    }
  };

  const handleBreak = async () => {
    setIsOnBreak(!isOnBreak);
    try {
      if (!isOnBreak) {
        await api.post('/breaks', {
          userId: user?.id,
          startTime: new Date().toISOString(),
        });
      } else {
        await api.put(`/breaks/${user?.id}/current`, {
          endTime: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error handling break:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Time Tracker</h2>
      <div className="mb-4">
        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
          Select Project
        </label>
        <select
          id="project"
          className="w-full p-2 border rounded"
          value={currentProject}
          onChange={(e) => setCurrentProject(e.target.value)}
          disabled={isWorking}
        >
          <option value="">Select a project</option>
          <option value="1">Project A</option>
          <option value="2">Project B</option>
          <option value="3">Project C</option>
        </select>
      </div>
      <div className="text-4xl font-bold text-center mb-4">{formatTime(elapsedTime)}</div>
      <div className="flex justify-center space-x-4">
        {!isWorking ? (
          <button
            onClick={handleClockIn}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Play size={20} className="mr-2" /> Clock In
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Pause size={20} className="mr-2" /> Clock Out
          </button>
        )}
        <button
          onClick={handleBreak}
          className={`${
            isOnBreak ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold py-2 px-4 rounded flex items-center`}
          disabled={!isWorking}
        >
          <Coffee size={20} className="mr-2" /> {isOnBreak ? 'End Break' : 'Start Break'}
        </button>
      </div>
      {startTime && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Started at: {format(startTime, 'h:mm a')}
        </p>
      )}
    </div>
  );
};

export default TimeTracker;