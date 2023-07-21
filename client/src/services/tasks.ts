import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';
import { TaskPayload } from '../redux/types';

const baseUrl = `${backendUrl}/projects`;

const getTasks = async (projectId: string) => {
  const response = await axios.get(`${baseUrl}/${projectId}/tasks`, setConfig());
  return response.data;
};

const getTasksDone = async () => {
  const response = await axios.get(`${baseUrl}/tasks/done`, setConfig()); 
  return response.data;
};
const createTask = async (projectId: string, taskData: TaskPayload) => {
  const response = await axios.post(
    `${baseUrl}/${projectId}/tasks`,
    taskData,
    setConfig()
  );
  return response.data;
};

const updateTask = async (
  projectId: string,
  taskId: string,
  taskData: TaskPayload
) => {
  const response = await axios.put(
    `${baseUrl}/${projectId}/tasks/${taskId}`,
    taskData,
    setConfig()
  );
  return response.data;
};

const deleteTask = async (projectId: string, taskId: string) => {
  const response = await axios.delete(
    `${baseUrl}/${projectId}/tasks/${taskId}`,
    setConfig()
  );
  return response.data;
};

const closeTask = async (projectId: string, taskId: string) => {
  const response = await axios.post(
    `${baseUrl}/${projectId}/tasks/${taskId}/close`,
    null,
    setConfig()
  );
  return response.data;
};

const reopenTask = async (projectId: string, taskId: string) => {
  const response = await axios.post(
    `${baseUrl}/${projectId}/tasks/${taskId}/reopen`,
    null,
    setConfig()
  );
  return response.data;
};

const taskService = {
  getTasks,
  getTasksDone,
  createTask,
  updateTask,
  deleteTask,
  closeTask,
  reopenTask,
};

export default taskService;
