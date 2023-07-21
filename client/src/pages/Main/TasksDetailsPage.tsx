import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTaskById,
  deleteTask,
  closeReopenTask,
} from '../../redux/slices/tasksSlice';
import { RootState } from '../../redux/store';
import FormDialog from '../../components/FormDialog';
import TaskForm from './TaskForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import NotesCard from './NotesCard';
import { formatDateTime } from '../../utils/helperFuncs';
import { priorityStyles, statusStyles } from '../../styles/customStyles';
import CSS from 'csstype';

import { Paper, Typography, Divider, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useMainPageStyles } from '../../styles/muiStyles';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

interface ParamTypes {
  projectId: string;
  taskId: string;
}

const TasksDetailsPage = () => {
  const classes = useMainPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { projectId, taskId } = useParams<ParamTypes>();
  const history = useHistory();
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) =>
    selectTaskById(state, projectId, taskId)
  );

  if (!task) {
    return (
      <div className={classes.root}>
        <Paper className={classes.notFoundPaper}>
          <Typography
            variant="h6"
            color="secondary"
            className={classes.error404Text}
            style={{ marginTop: '5em' }}
          >
            404: Task Not Found!
          </Typography>
        </Paper>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    priority,
    isResolved,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    closedBy,
    closedAt,
    reopenedBy,
    reopenedAt,
    notes,
  } = task;

  const handleDeleteTask = () => {
    dispatch(deleteTask(projectId, taskId, history));
  };

  const handleCloseTask = () => {
    dispatch(closeReopenTask(projectId, taskId, 'close'));
  };

  const handleReopenTask = () => {
    dispatch(closeReopenTask(projectId, taskId, 'reopen'));
  };

  const statusCSS: CSS.Properties = {
    ...statusStyles(isResolved),
    display: 'inline',
    padding: '0.20em 0.4em',
  };

  const statusInfo = () => {
    if (!isResolved && reopenedAt && reopenedBy) {
      return (
        <span>
          <div style={statusCSS}>Re-opened</div> -{' '}
          <em>{formatDateTime(reopenedAt)}</em> ~{' '}
          <strong>{reopenedBy.username}</strong>
        </span>
      );
    } else if (isResolved && closedAt && closedBy) {
      return (
        <span>
          <div style={statusCSS}>Closed</div> -{' '}
          <em>{formatDateTime(closedAt)}</em> ~{' '}
          <strong>{closedBy.username}</strong>
        </span>
      );
    } else {
      return <div style={statusCSS}>Open</div>;
    }
  };

  const closeReopenBtns = () => {
    if (isResolved) {
      return (
        <ConfirmDialog
          title="Re-open the Task"
          contentText="Are you sure you want to re-open the task?"
          actionBtnText="Re-open Task"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Re-open Task',
            icon: RedoIcon,
          }}
          actionFunc={handleReopenTask}
        />
      );
    } else {
      return (
        <ConfirmDialog
          title="Close the Task"
          contentText="Are you sure you want to close the task?"
          actionBtnText="Close Task"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Close Task',
            icon: DoneOutlineIcon,
          }}
          actionFunc={handleCloseTask}
        />
      );
    }
  };

  const updateTaskBtn = () => {
    return (
      <FormDialog
        triggerBtn={{
          type: isMobile ? 'round' : 'normal',
          text: 'Update Task Info',
          icon: EditOutlinedIcon,
          style: { marginLeft: '1em' },
        }}
        title="Edit the task details"
      >
        <TaskForm
          isEditMode={true}
          projectId={projectId}
          taskId={id}
          currentData={{ title, description, priority }}
        />
      </FormDialog>
    );
  };

  const deleteTaskBtn = () => {
    return (
      <ConfirmDialog
        title="Confirm Delete Task"
        contentText="Are you sure you want to permanently delete the task?"
        actionBtnText="Delete Task"
        triggerBtn={{
          type: isMobile ? 'round' : 'normal',
          text: 'Delete Task',
          icon: DeleteOutlineIcon,
          style: { marginLeft: '1em' },
        }}
        actionFunc={handleDeleteTask}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.detailsHeader}>
        <Typography variant={isMobile ? 'h5' : 'h4'} color="secondary">
          <strong>{title}</strong>
        </Typography>
        <Divider style={{ margin: '0.5em 0' }} />
        <Typography color="secondary" variant="h6">
          {description}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Status: {statusInfo()}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Priority:{' '}
          <div
            style={{
              ...priorityStyles(priority),
              display: 'inline',
              padding: '0.20em 0.4em',
              textTransform: 'capitalize',
            }}
          >
            {priority}
          </div>
        </Typography>
        <Typography color="secondary" variant="subtitle2">
          Created: <em>{formatDateTime(createdAt)}</em> ~{' '}
          <strong>{createdBy.username}</strong>
        </Typography>
        {updatedBy && updatedAt && (
          <Typography color="secondary" variant="subtitle2">
            Updated: <em>{formatDateTime(updatedAt)}</em> ~{' '}
            <strong>{updatedBy.username}</strong>
          </Typography>
        )}
        <div className={classes.btnsWrapper}>
          {closeReopenBtns()}
          {updateTaskBtn()}
          {deleteTaskBtn()}
        </div>
      </Paper>
      <NotesCard
        notes={notes}
        projectId={projectId}
        taskId={id}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TasksDetailsPage;
