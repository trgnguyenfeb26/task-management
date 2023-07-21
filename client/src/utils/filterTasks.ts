import { TaskState, TaskFilterValues } from '../redux/types';

const filterTasks = (filterBy: TaskFilterValues, task: TaskState) => {
  switch (filterBy) {
    case 'all':
      return true;
    case 'closed':
      return task.isResolved === true;
    case 'open':
      return task.isResolved === false;
  }
};

export default filterTasks;
