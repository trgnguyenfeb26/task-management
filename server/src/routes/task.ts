import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  closeTask,
  reopenTask,
  getTasksDone,
} from '../controllers/task';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.get('/:projectId/tasks', auth, getTasks);
router.post('/:projectId/tasks', auth, createTask);
router.put('/:projectId/tasks/:taskId', auth, updateTask);
router.delete('/:projectId/tasks/:taskId', auth, deleteTask);
router.post('/:projectId/tasks/:taskId/close', auth, closeTask);
router.post('/:projectId/tasks/:taskId/reopen', auth, reopenTask);
router.get('/tasks/done', getTasksDone);

export default router;
