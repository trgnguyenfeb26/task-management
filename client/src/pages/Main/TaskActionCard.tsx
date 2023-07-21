import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../../components/FilterBar';
import SortBar from '../../components/SortBar';
import FormDialog from '../../components/FormDialog';
import TaskForm from './TaskForm';
import { TaskSortValues, TaskFilterValues } from '../../redux/types';
import {
  sortTasksBy,
  filterTasksBy,
  selectTasksState,
} from '../../redux/slices/tasksSlice';

import {
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import { useActionCardStyles } from '../../styles/muiStyles';
import AddIcon from '@material-ui/icons/Add';

const menuItems = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'Title (A - Z)' },
  { value: 'z-a', label: 'Title (Z - A)' },
  { value: 'h-l', label: 'Priority (High - Low)' },
  { value: 'l-h', label: 'Priority (Low - High)' },
  { value: 'closed', label: 'Recently Closed' },
  { value: 'reopened', label: 'Recently Re-opened' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'most-notes', label: 'Most Notes' },
  { value: 'least-notes', label: 'Least Notes' },
];

const TasksActionCard: React.FC<{
  projectId: string;
  filterValue: string;
  setFilterValue: (filterValue: string) => void;
  isMobile: boolean;
}> = ({ projectId, filterValue, setFilterValue, isMobile }) => {
  const classes = useActionCardStyles();
  const dispatch = useDispatch();
  const { sortBy, filterBy } = useSelector(selectTasksState);

  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = e.target.value as TaskSortValues;
    dispatch(sortTasksBy(selectedValue));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value as TaskFilterValues;
    dispatch(filterTasksBy(selectedValue));
  };

  return (
    <div>
      <div className={classes.inputs}>
        <div className={classes.searchBarWrapper}>
          <FilterBar
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            label="Tasks"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
        <div className={classes.sortBarWrapper}>
          <SortBar
            sortBy={sortBy}
            handleSortChange={handleSortChange}
            menuItems={menuItems}
            label="Tasks"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
      </div>
      <div className={classes.flexWrapper}>
        <FormDialog
          triggerBtn={
            isMobile
              ? {
                type: 'fab',
                variant: 'extended',
                text: 'Task',
                icon: AddIcon,
              }
              : {
                type: 'normal',
                text: 'Add Task',
                icon: AddIcon,
                size: 'large',
              }
          }
          title="Add a new task"
        >
          <TaskForm isEditMode={false} projectId={projectId} />
        </FormDialog>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ fontSize: '0.8em' }}>
            Filter Tasks By
          </FormLabel>
          <RadioGroup row value={filterBy} onChange={handleFilterChange}>
            <FormControlLabel
              value="all"
              control={<Radio color="primary" />}
              label="All"
            />
            <FormControlLabel
              value="closed"
              control={<Radio color="primary" />}
              label="Closed"
            />
            <FormControlLabel
              value="open"
              control={<Radio color="primary" />}
              label="Open"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default TasksActionCard;
