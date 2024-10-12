import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Project {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

const ProjectAssignment: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, employeesResponse] = await Promise.all([
          api.get('/projects'),
          api.get('/employees'),
        ]);
        setProjects(projectsResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedEmployee) {
      alert('Please select both a project and an employee.');
      return;
    }

    try {
      await api.post('/project-assignments', {
        projectId: selectedProject,
        employeeId: selectedEmployee,
      });
      alert('Assignment successful!');
      setSelectedProject('');
      setSelectedEmployee('');
    } catch (error) {
      console.error('Error assigning project:', error);
      alert('Failed to assign project. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Assignment</h2>
      <form onSubmit={handleAssignment}>
        <div className="mb-4">
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select
            id="project"
            className="w-full p-2 border rounded"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
            Select Employee
          </label>
          <select
            id="employee"
            className="w-full p-2 border rounded"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Assign Project
        </button>
      </form>
    </div>
  );
};

export default ProjectAssignment;