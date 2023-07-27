import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import taskService from '../../services/tasks';
import noteService from '../../services/notes';
import {
  TaskState,
  TaskSortValues,
  TaskPayload,
  EditedTaskData,
  ClosedReopenedTaskData,
  Note,
  TaskFilterValues,
} from '../types';
import { notify } from './notificationSlice';
import { History } from 'history';
import { getErrorMsg } from '../../utils/helperFuncs';

interface InitialTaskState {
  tasks: { [projectId: string]: TaskState[] };
  fetchLoading: boolean;
  fetchError: string | null;
  submitLoading: boolean;
  submitError: string | null;
  sortBy: TaskSortValues;
  filterBy: TaskFilterValues;
  tasksDone: TaskState[];
}

const initialState: InitialTaskState = {
  tasks: {},
  fetchLoading: false,
  fetchError: null,
  submitLoading: false,
  submitError: null,
  sortBy: 'newest',
  filterBy: 'all',
  tasksDone: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (
      state,
      action: PayloadAction<{ tasks: TaskState[]; projectId: string }>
    ) => {
      state.tasks[action.payload.projectId] = action.payload.tasks;
      state.fetchLoading = false;
      state.fetchError = null;
    },
    addTask: (
      state,
      action: PayloadAction<{ task: TaskState; projectId: string }>
    ) => {
      if (action.payload.projectId in state.tasks) {
        state.tasks[action.payload.projectId].push(action.payload.task);
      } else {
        state.tasks[action.payload.projectId] = [action.payload.task];
      }
      state.submitLoading = false;
      state.submitError = null;
    },
    updateTask: (
      state,
      action: PayloadAction<{
        data: EditedTaskData;
        taskId: string;
        projectId: string;
      }>
    ) => {
      state.tasks[action.payload.projectId] = state.tasks[
        action.payload.projectId
      ].map((b) =>
        b.id === action.payload.taskId ? { ...b, ...action.payload.data } : b
      );

      state.submitLoading = false;
      state.submitError = null;
    },
    removeTask: (
      state,
      action: PayloadAction<{ taskId: string; projectId: string }>
    ) => {
      state.tasks[action.payload.projectId] = state.tasks[
        action.payload.projectId
      ].filter((b) => b.id !== action.payload.taskId);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{
        data: ClosedReopenedTaskData;
        taskId: string;
        projectId: string;
      }>
    ) => {
      state.tasks[action.payload.projectId] = state.tasks[
        action.payload.projectId
      ].map((b) =>
        b.id === action.payload.taskId ? { ...b, ...action.payload.data } : b
      );
    },
    addNote: (
      state,
      action: PayloadAction<{ note: Note; taskId: string; projectId: string }>
    ) => {
      state.tasks[action.payload.projectId] = state.tasks[
        action.payload.projectId
      ].map((b) =>
        b.id === action.payload.taskId
          ? { ...b, notes: [...b.notes, action.payload.note] }
          : b
      );
      state.submitLoading = false;
      state.submitError = null;
    },
    updateNote: (
      state,
      action: PayloadAction<{
        data: { body: string; updatedAt: Date };
        noteId: number;
        taskId: string;
        projectId: string;
      }>
    ) => {
      const task = state.tasks[action.payload.projectId].find(
        (b) => b.id === action.payload.taskId
      );

      if (task) {
        const updatedNotes = task.notes.map((n) =>
          n.id === action.payload.noteId ? { ...n, ...action.payload.data } : n
        );

        state.tasks[action.payload.projectId] = state.tasks[
          action.payload.projectId
        ].map((b) =>
          b.id === action.payload.taskId ? { ...b, notes: updatedNotes } : b
        );

        state.submitLoading = false;
        state.submitError = null;
      }
    },
    removeNote: (
      state,
      action: PayloadAction<{
        noteId: number;
        taskId: string;
        projectId: string;
      }>
    ) => {
      const task = state.tasks[action.payload.projectId].find(
        (b) => b.id === action.payload.taskId
      );

      if (task) {
        const updatedNotes = task.notes.filter(
          (n) => n.id !== action.payload.noteId
        );

        state.tasks[action.payload.projectId] = state.tasks[
          action.payload.projectId
        ].map((b) =>
          b.id === action.payload.taskId ? { ...b, notes: updatedNotes } : b
        );
      }
    },
    setFetchTasksLoading: (state) => {
      state.fetchLoading = true;
      state.fetchError = null;
    },
    setFetchTasksError: (state, action: PayloadAction<string>) => {
      state.fetchLoading = false;
      state.fetchError = action.payload;
    },
    setSubmitTaskLoading: (state) => {
      state.submitLoading = true;
      state.submitError = null;
    },
    setSubmitTaskError: (state, action: PayloadAction<string>) => {
      state.submitLoading = false;
      state.submitError = action.payload;
    },
    clearSubmitTaskError: (state) => {
      state.submitError = null;
    },
    sortTasksBy: (state, action: PayloadAction<TaskSortValues>) => {
      state.sortBy = action.payload;
    },
    filterTasksBy: (state, action: PayloadAction<TaskFilterValues>) => {
      state.filterBy = action.payload;
    },
    getTasksDone: (state, action: PayloadAction<TaskState[]>) => {
      state.tasksDone = action.payload;
    }
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  updateTaskStatus,
  addNote,
  updateNote,
  removeNote,
  setFetchTasksLoading,
  setFetchTasksError,
  setSubmitTaskLoading,
  setSubmitTaskError,
  clearSubmitTaskError,
  sortTasksBy,
  filterTasksBy,
  getTasksDone,
} = tasksSlice.actions;

export const fetchTasksByProjectId = (projectId: string): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setFetchTasksLoading());
      const projectTasks = await taskService.getTasks(projectId);
      dispatch(setTasks({ tasks: projectTasks, projectId }));
    } catch (e: any) {
      dispatch(setFetchTasksError(getErrorMsg(e)));
    }
  };
};

// getTasksDone
export const fetchTasksDone = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setFetchTasksLoading());
      const tasksDone = await taskService.getTasksDone();
      dispatch(getTasksDone(tasksDone));
    } catch (e: any) {
      dispatch(setFetchTasksError(getErrorMsg(e)));
    }
  };
};

export const createNewTask = (
  projectId: string,
  taskData: TaskPayload,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitTaskLoading());
      const newTask = await taskService.createTask(projectId, taskData);
      dispatch(addTask({ task: newTask, projectId }));
      dispatch(notify('New task added!', 'success'));
      closeDialog && closeDialog();
    } catch (e: any) {
      dispatch(setSubmitTaskError(getErrorMsg(e)));
    }
  };
};

export const editTask = (
  projectId: string,
  taskId: string,
  taskData: TaskPayload,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitTaskLoading());
      const updatedTask = await taskService.updateTask(projectId, taskId, taskData);
      const {
        title,
        description,
        priority,
        assignedUsers,
        updatedAt,
        updatedBy,
      } = updatedTask as EditedTaskData;

      dispatch(
        updateTask({
          data: { title, description, priority, assignedUsers, updatedAt, updatedBy },
          taskId,
          projectId,
        })
      );
      dispatch(notify('Successfully updated the task!', 'success'));
      closeDialog && closeDialog();
    } catch (e: any) {
      dispatch(setSubmitTaskError(getErrorMsg(e)));
    }
  };
};

export const deleteTask = (
  projectId: string,
  taskId: string,
  history: History
): AppThunk => {
  return async (dispatch) => {
    try {
      await taskService.deleteTask(projectId, taskId);
      history.push(`/projects/${projectId}`);
      dispatch(removeTask({ taskId, projectId }));
      dispatch(notify('Deleted the task.', 'success'));
    } catch (e: any) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const closeReopenTask = (
  projectId: string,
  taskId: string,
  action: 'close' | 'reopen'
): AppThunk => {
  return async (dispatch) => {
    try {
      let returnedData;
      if (action === 'close') {
        returnedData = await taskService.closeTask(projectId, taskId);
      } else {
        returnedData = await taskService.reopenTask(projectId, taskId);
      }
      const {
        isResolved,
        closedAt,
        closedBy,
        reopenedAt,
        reopenedBy,
      } = returnedData as ClosedReopenedTaskData;
      dispatch(
        updateTaskStatus({
          data: { isResolved, closedAt, closedBy, reopenedAt, reopenedBy },
          taskId,
          projectId,
        })
      );
      dispatch(
        notify(
          `${action === 'close' ? 'Closed' : 'Re-opened'} the task!`,
          'success'
        )
      );
    } catch (e: any) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const createNote = (
  projectId: string,
  taskId: string,
  noteBody: string,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitTaskLoading());
      const newNote = await noteService.createNote(projectId, taskId, noteBody);
      dispatch(addNote({ note: newNote, taskId, projectId }));
      dispatch(notify('New note added!', 'success'));
      closeDialog && closeDialog();
    } catch (e: any) {
      dispatch(setSubmitTaskError(getErrorMsg(e)));
    }
  };
};

export const editNote = (
  projectId: string,
  taskId: string,
  noteId: number,
  noteBody: string,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitTaskLoading());
      const returnedData = await noteService.editNote(
        projectId,
        noteId,
        noteBody
      );
      const { body, updatedAt } = returnedData as Note;
      dispatch(
        updateNote({ data: { body, updatedAt }, noteId, taskId, projectId })
      );
      dispatch(notify('Updated the note!', 'success'));
      closeDialog && closeDialog();
    } catch (e: any) {
      dispatch(setSubmitTaskError(getErrorMsg(e)));
    }
  };
};

export const deleteNote = (
  projectId: string,
  taskId: string,
  noteId: number
): AppThunk => {
  return async (dispatch) => {
    try {
      await noteService.deleteNote(projectId, noteId);
      dispatch(removeNote({ noteId, taskId, projectId }));
      dispatch(notify('Deleted the note.', 'success'));
    } catch (e: any) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const selectTasksState = (state: RootState) => state.tasks;
export const selectTasksDoneState = (state: RootState) => state.tasks.tasksDone;

export const selectTasksByProjectId = (state: RootState, projectId: string) => {
  return state.tasks.tasks?.[projectId];
};

export const selectTaskById = (
  state: RootState,
  projectId: string,
  taskId: string
) => {
  return state.tasks.tasks?.[projectId].find((b) => b.id === taskId);
};

export default tasksSlice.reducer;
