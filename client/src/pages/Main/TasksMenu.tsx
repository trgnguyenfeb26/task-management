import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTask, closeReopenTask } from '../../redux/slices/tasksSlice';
import { TaskPayload } from '../../redux/types';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormDialog from '../../components/FormDialog';
import TaskForm from './TaskForm';
import NoteForm from './NoteForm';

import { Menu, IconButton, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import AssignIcon from '@material-ui/icons/AssignmentInd';

interface TasksMenuProps {
  projectId: string;
  taskId: string;
  currentData: TaskPayload;
  isResolved: boolean;
  iconSize?: 'small' | 'default' | 'large';
}

const TasksMenu: React.FC<TasksMenuProps> = ({
  projectId,
  taskId,
  currentData,
  isResolved,
  iconSize,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(projectId, taskId, history));
  };

  const handleCloseTask = () => {
    dispatch(closeReopenTask(projectId, taskId, 'close'));
  };

  const handleReopenTask = () => {
    dispatch(closeReopenTask(projectId, taskId, 'reopen'));
  };
  console.log('currentData', currentData);

  return (
    <div>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreHorizIcon color="primary" fontSize={iconSize || 'large'} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        marginThreshold={8}
        elevation={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={handleCloseMenu}
          component={RouterLink}
          to={`/projects/${projectId}/tasks/${taskId}`}
        >
          <OpenInNewIcon style={{ marginRight: '10px' }} />
          Task Details
        </MenuItem>
        {isResolved ? (
          <ConfirmDialog
            title="Re-open the Task"
            contentText="Are you sure you want to re-open the task?"
            actionBtnText="Re-open Task"
            triggerBtn={{
              type: 'menu',
              text: 'Re-open Task',
              icon: RedoIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleReopenTask}
          />
        ) : (
          <ConfirmDialog
            title="Close the Task"
            contentText="Are you sure you want to close the task?"
            actionBtnText="Close Task"
            triggerBtn={{
              type: 'menu',
              text: 'Close Task',
              icon: DoneOutlineIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleCloseTask}
          />
        )}
        <FormDialog
          triggerBtn={{
            type: 'menu',
            text: 'Update Task',
            icon: EditOutlinedIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          title="Edit the task details"
        >
          <TaskForm
            isEditMode={true}
            projectId={projectId}
            taskId={taskId}
            currentData={currentData}
          />
        </FormDialog>
        <ConfirmDialog
          title="Confirm Delete Task"
          contentText="Are you sure you want to permanently delete the task?"
          actionBtnText="Delete Task"
          triggerBtn={{
            type: 'menu',
            text: 'Delete Task',
            icon: DeleteOutlineIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          actionFunc={handleDeleteTask}
        />
        <FormDialog
          triggerBtn={{
            type: 'menu',
            text: 'Leave A Note',
            icon: CommentOutlinedIcon,
            iconStyle: { marginRight: '10px' },
            closeMenu: handleCloseMenu,
          }}
          title="Post a note"
        >
          <NoteForm isEditMode={false} projectId={projectId} taskId={taskId} />
        </FormDialog>

      </Menu>
    </div>
  );
};

export default TasksMenu;
