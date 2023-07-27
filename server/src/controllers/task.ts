import { Request, Response } from 'express';
import { Member } from '../entity/Member';
import { Task } from '../entity/Task';
import { Note } from '../entity/Note';
import { Project } from '../entity/Project';
import { createTaskValidator } from '../utils/validators';
import { Assigned } from '../entity/Assigned';

const fieldsToSelect = [
  'task.id',
  'task.projectId',
  'task.title',
  'task.description',
  'task.priority',
  'task.isResolved',
  'task.createdAt',
  'task.updatedAt',
  'task.closedAt',
  'task.reopenedAt',
  'createdBy.id',
  'createdBy.username',
  'updatedBy.id',
  'updatedBy.username',
  'closedBy.id',
  'closedBy.username',
  'reopenedBy.id',
  'reopenedBy.username',
  'note.id',
  'note.taskId',
  'note.body',
  'note.createdAt',
  'note.updatedAt',
  'noteAuthor.id',
  'noteAuthor.username',
  'assigned.id',
  'assigned.joinedAt',
  'user.id',
  'user.username',
];

export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const projectMembers = await Member.find({ projectId });
  if (!projectMembers.map((m) => m.memberId).includes(req.user)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }
  const tasks = await Task.createQueryBuilder('task')
    .leftJoinAndSelect('task.createdBy', 'createdBy')
    .leftJoinAndSelect('task.updatedBy', 'updatedBy')
    .leftJoinAndSelect('task.closedBy', 'closedBy')
    .leftJoinAndSelect('task.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('task.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .leftJoinAndSelect('task.assignedUsers', 'assigned') // Updated relation name
    .leftJoinAndSelect('assigned.user', 'user')
    .where('task.projectId = :projectId', { projectId })
    .select(fieldsToSelect)
    .getMany();
  res.json(tasks);
};

export const getTasksDone = async (req: Request, res: Response) => {
  console.log('req', req);
  const tasksDone = await Task.createQueryBuilder('task')
    .getMany();
  return res.json(tasksDone);

};


export const createTask = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  const { projectId } = req.params;
  console.log('req.body', req.body);
  const assignedUsersIds: string[] = req.body.assignedUsers || [];
  const { errors, valid } = createTaskValidator(title, description, priority);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const newTask = Task.create({
    title,
    description,
    priority,
    projectId,
    createdById: req.user,
  });
  await newTask.save();

  const membersArray = assignedUsersIds.map((userId) => ({
    userId: userId,
    taskId: newTask.id,
  }));
  await Assigned.insert(membersArray);

  const relationedTask = await Task.createQueryBuilder('task')
    .where('task.id = :taskId', { taskId: newTask.id })
    .leftJoinAndSelect('task.createdBy', 'createdBy')
    .leftJoinAndSelect('task.updatedBy', 'updatedBy')
    .leftJoinAndSelect('task.closedBy', 'closedBy')
    .leftJoinAndSelect('task.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('task.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .leftJoinAndSelect('task.assignedUsers', 'assigned') // Updated relation name
    .leftJoinAndSelect('assigned.user', 'user')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedTask);
};

export const updateTask = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  const { projectId, taskId } = req.params;
  const assignedUsersIds: string[] = req.body.assignedUsers || [];

  const { errors, valid } = createTaskValidator(title, description, priority);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const projectMembers = await Member.find({ projectId });
  const memberIds = projectMembers.map((m) => m.memberId);

  if (!memberIds.includes(req.user)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const targetTask = await Task.findOne({ id: taskId });

  if (!targetTask) {
    return res.status(400).send({ message: 'Invalid task ID.' });
  }

  targetTask.title = title;
  targetTask.description = description;
  targetTask.priority = priority;
  targetTask.updatedById = req.user;
  targetTask.updatedAt = new Date();

  await targetTask.save();

  await Assigned.delete({ taskId });
  const membersArray = assignedUsersIds.map((userId) => ({
    userId: userId,
    taskId: targetTask.id,
  }));
  if (membersArray.length > 0) {
    await Assigned.insert(membersArray);
  }


  const relationedTask = await Task.createQueryBuilder('task')
    .where('task.id = :taskId', { taskId })
    .leftJoinAndSelect('task.createdBy', 'createdBy')
    .leftJoinAndSelect('task.updatedBy', 'updatedBy')
    .leftJoinAndSelect('task.closedBy', 'closedBy')
    .leftJoinAndSelect('task.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('task.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .leftJoinAndSelect('task.assignedUsers', 'assigned') // Updated relation name
    .leftJoinAndSelect('assigned.user', 'user')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  const targetProject = await Project.findOne({
    id: projectId,
  });

  if (!targetProject) {
    return res.status(404).send({ message: 'Invalid project ID.' });
  }

  const targetTask = await Task.findOne({ id: taskId });

  if (!targetTask) {
    return res.status(404).send({ message: 'Invalid task ID.' });
  }

  if (
    targetProject.createdById !== req.user &&
    targetTask.createdById !== req.user
  ) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  await Note.delete({ taskId });
  await Assigned.delete({ taskId });
  await targetTask.remove();
  res.status(204).end();
};

export const closeTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  const projectMembers = await Member.find({ projectId });
  const memberIds = projectMembers.map((m) => m.memberId);

  if (!memberIds.includes(req.user)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const targetTask = await Task.findOne({ id: taskId });

  if (!targetTask) {
    return res.status(400).send({ message: 'Invalid task ID.' });
  }

  if (targetTask.isResolved === true) {
    return res
      .status(400)
      .send({ message: 'Task is already marked as closed.' });
  }

  targetTask.isResolved = true;
  targetTask.closedById = req.user;
  targetTask.closedAt = new Date();
  targetTask.reopenedById = null;
  targetTask.reopenedAt = null;

  await targetTask.save();
  const relationedTask = await Task.createQueryBuilder('task')
    .where('task.id = :taskId', { taskId })
    .leftJoinAndSelect('task.createdBy', 'createdBy')
    .leftJoinAndSelect('task.updatedBy', 'updatedBy')
    .leftJoinAndSelect('task.closedBy', 'closedBy')
    .leftJoinAndSelect('task.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('task.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .leftJoinAndSelect('task.assignedUsers', 'assigned') // Updated relation name
    .leftJoinAndSelect('assigned.user', 'user')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedTask);
};

export const reopenTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  const projectMembers = await Member.find({ projectId });
  const memberIds = projectMembers.map((m) => m.memberId);

  if (!memberIds.includes(req.user)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const targetTask = await Task.findOne({ id: taskId });

  if (!targetTask) {
    return res.status(400).send({ message: 'Invalid task ID.' });
  }

  if (targetTask.isResolved === false) {
    return res
      .status(400)
      .send({ message: 'Task is already marked as opened.' });
  }

  targetTask.isResolved = false;
  targetTask.reopenedById = req.user;
  targetTask.reopenedAt = new Date();
  targetTask.closedById = null;
  targetTask.closedAt = null;

  await targetTask.save();
  const relationedTask = await Task.createQueryBuilder('task')
    .where('task.id = :taskId', { taskId })
    .leftJoinAndSelect('task.createdBy', 'createdBy')
    .leftJoinAndSelect('task.updatedBy', 'updatedBy')
    .leftJoinAndSelect('task.closedBy', 'closedBy')
    .leftJoinAndSelect('task.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('task.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .leftJoinAndSelect('task.assignedUsers', 'assigned') // Updated relation name
    .leftJoinAndSelect('assigned.user', 'user')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedTask);
};
