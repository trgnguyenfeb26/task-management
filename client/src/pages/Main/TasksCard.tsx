import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasksByProjectId,
  selectTasksByProjectId,
  selectTasksState,
} from '../../redux/slices/tasksSlice';
import { RootState } from '../../redux/store';
import TasksTable from './TasksTable';
import TasksActionCard from './TaskActionCard';
import TasksListMobile from './TasksListMobile';
import sortTasks from '../../utils/sortTasks';
import filterTasks from '../../utils/filterTasks';
import LoadingSpinner from '../../components/LoadingSpinner';
import InfoText from '../../components/InfoText';

import { Paper, Typography } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';

const TasksCard: React.FC<{ projectId: string; isMobile: boolean }> = ({
  projectId,
  isMobile,
}) => {
  const classes = useMainPageStyles();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) =>
    selectTasksByProjectId(state, projectId)
  );
  const { fetchLoading, fetchError, sortBy, filterBy } = useSelector(
    selectTasksState
  );
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    if (!tasks) {
      dispatch(fetchTasksByProjectId(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSortedTasks =
    tasks &&
    sortTasks(
      tasks.filter(
        (b) =>
          b.title.toLowerCase().includes(filterValue.toLowerCase()) &&
          filterTasks(filterBy, b)
      ),
      sortBy
    );

  const tasksDataToDisplay = () => {
    if (fetchLoading) {
      return (
        <LoadingSpinner
          marginTop={isMobile ? '3em' : '4em'}
          size={isMobile ? 60 : 80}
        />
      );
    } else if (fetchError) {
      return (
        <InfoText
          text={`Error: ${fetchError}`}
          variant={isMobile ? 'h6' : 'h5'}
        />
      );
    } else if (!tasks || tasks.length === 0) {
      return (
        <InfoText text="No Tasks added yet." variant={isMobile ? 'h6' : 'h5'} />
      );
    } else if (!filteredSortedTasks || filteredSortedTasks.length === 0) {
      return (
        <InfoText text="No matches found." variant={isMobile ? 'h6' : 'h5'} />
      );
    } else {
      return (
        <div>
          {isMobile ? (
            <TasksListMobile tasks={filteredSortedTasks} />
          ) : (
            <TasksTable tasks={filteredSortedTasks} />
          )}
        </div>
      );
    }
  };

  return (
    <Paper className={classes.tasksPaper}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        color="secondary"
        className={classes.flexHeader}
      >
        <BugReportOutlinedIcon
          fontSize={isMobile ? 'default' : 'large'}
          style={{ marginRight: '0.2em' }}
        />
        Tasks
      </Typography>
      <div className={classes.tasksActionCard}>
        <TasksActionCard
          projectId={projectId}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          isMobile={isMobile}
        />
      </div>
      {tasksDataToDisplay()}
    </Paper>
  );
};

export default TasksCard;
