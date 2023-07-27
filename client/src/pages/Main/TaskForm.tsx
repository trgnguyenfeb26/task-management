import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  createNewTask,
  editTask,
  clearSubmitTaskError,
  selectTasksState,
} from '../../redux/slices/tasksSlice';
import { AssignedUser, TaskPayload, User } from '../../redux/types';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import GroupIcon from '@material-ui/icons/Group';

import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputAdornment,
  FormLabel,
  FormControl,
  Checkbox,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete'; // Import Autocomplete
import { useFormStyles } from '../../styles/muiStyles';
import TitleIcon from '@material-ui/icons/Title';
import SubjectIcon from '@material-ui/icons/Subject';
import { selectProjectById } from '../../redux/slices/projectsSlice';
import { RootState } from '../../redux/store';
import React from 'react';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Required')
    .min(3, 'Must be at least 3 characters')
    .max(60, 'Must be at most 60 characters'),

  description: yup.string().required('Required'),
});

interface TaskFormProps {
  closeDialog?: () => void;
  projectId: string;
  isEditMode: boolean;
  currentData?: TaskPayload;
  taskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  closeDialog,
  isEditMode,
  projectId,
  currentData,
  taskId,
}) => {
  const classes = useFormStyles();
  const dispatch = useDispatch();
  const userAssignedDefaultValues = currentData?.assignedUsers?.map(
    (u) => u.user.id
  );

  const { submitError, submitLoading } = useSelector(selectTasksState);
  const projectInState = useSelector((state: RootState) =>
    selectProjectById(state, projectId)
  );
  const users = projectInState?.members.map((m) => m) || [];
  const { register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: currentData?.title || '',
      description: currentData?.description || '',
      priority: currentData?.priority || 'low',
      assignedUsers: userAssignedDefaultValues || [],
    },
  });


  const [selectedMembers, setSelectedMembers] = useState<any[]>(
    userAssignedDefaultValues || []
  );

  const handleSelectMembersOnChange = (
    event: React.ChangeEvent<{}>,
    value: any[]
  ) => {
    setSelectedMembers(value.map((u) => u.member.id));
  }


  const handleCreateTask = (data: TaskPayload) => {
    data.assignedUsers = selectedMembers;
    dispatch(createNewTask(projectId, data, closeDialog));
  };

  const handleUpdateTask = (data: TaskPayload) => {
    data.assignedUsers = selectedMembers;
    dispatch(editTask(projectId, taskId as string, data, closeDialog));
  };
  console.log('selectedMembers', selectedMembers);
  console.log('currentData', currentData);

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? handleUpdateTask : handleCreateTask)}
    >
      <TextField
        inputRef={register}
        name="title"
        required
        fullWidth
        type="text"
        label="Task Title"
        variant="outlined"
        error={'title' in errors}
        helperText={'title' in errors ? errors.title?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TitleIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        className={classes.fieldMargin}
        multiline
        rows={1}
        rowsMax={4}
        inputRef={register}
        name="description"
        required
        fullWidth
        type="text"
        label="Description"
        variant="outlined"
        error={'description' in errors}
        helperText={'description' in errors ? errors.description?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Autocomplete
        className={classes.fieldMargin}
        multiple
        options={users}
        getOptionLabel={(option) => option.member.username}
        value={users.filter((u) => selectedMembers.includes(u.member.id))}
        onChange={handleSelectMembersOnChange}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={register}
            variant="outlined"
            label="Select Members to Assign"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <GroupIcon color="primary" />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="priority"
        as={
          <FormControl className={classes.radioGroupForm}>
            <RadioGroup row defaultValue={ currentData?.priority || "low"} className={classes.radioGroup}>
              <FormLabel className={classes.radioGroupLabel}>
                Priority:
              </FormLabel>
              <div className={classes.formControlLabels}>
                <FormControlLabel
                  value="low"
                  control={<Radio color="primary" />}
                  label="Low"
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio color="primary" />}
                  label="Medium"
                />
                <FormControlLabel
                  value="high"
                  control={<Radio color="primary" />}
                  label="High"
                />
              </div>
            </RadioGroup>
          </FormControl>
        }
      />
      <Button
        size="large"
        color="primary"
        variant="contained"
        fullWidth
        className={classes.submitBtn}
        type="submit"
        disabled={submitLoading}
      >
        {isEditMode ? 'Update Task' : 'Create New Task'}
      </Button>
      {submitError && (
        <ErrorBox
          errorMsg={submitError}
          clearErrorMsg={() => dispatch(clearSubmitTaskError())}
        />
      )}
    </form>
  );
};

export default TaskForm;
