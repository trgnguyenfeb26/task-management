import { TaskState, TaskSortValues } from '../redux/types';

const sortTasks = (tasks: TaskState[], sortBy: TaskSortValues) => {
  switch (sortBy) {
    case 'newest':
      return tasks
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    case 'oldest':
      return tasks
        .slice()
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

    case 'a-z':
      return tasks
        .slice()
        .sort((a, b) =>
          a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
        );

    case 'z-a':
      return tasks
        .slice()
        .sort((a, b) =>
          b.title.localeCompare(a.title, 'en', { sensitivity: 'base' })
        );

    case 'h-l':
      return tasks.slice().sort((a, b) => {
        if (a.priority === 'high') {
          return -1;
        }

        if (b.priority === 'low') {
          return 0;
        }

        return -1;
      });

    case 'l-h':
      return tasks.slice().sort((a, b) => {
        if (a.priority === 'low') {
          return -1;
        }

        if (b.priority === 'high') {
          return 0;
        }

        return 1;
      });

    case 'closed':
      return tasks.slice().sort((a, b) => {
        if (!a.closedAt) {
          return 1;
        }

        if (!b.closedAt) {
          return -1;
        }

        return +new Date(b.closedAt) - +new Date(a.closedAt);
      });

    case 'reopened':
      return tasks.slice().sort((a, b) => {
        if (!a.reopenedAt) {
          return 1;
        }

        if (!b.reopenedAt) {
          return -1;
        }

        return +new Date(b.reopenedAt) - +new Date(a.reopenedAt);
      });

    case 'updated':
      return tasks.slice().sort((a, b) => {
        if (!a.updatedAt) {
          return 1;
        }

        if (!b.updatedAt) {
          return -1;
        }

        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      });

    case 'most-notes':
      return tasks.slice().sort((a, b) => b.notes.length - a.notes.length);

    case 'least-notes':
      return tasks.slice().sort((a, b) => a.notes.length - b.notes.length);
  }
};

export default sortTasks;
