import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjectsState } from '../../redux/slices/projectsSlice';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
  Typography,
  Tabs,
  Tab,
  makeStyles,
  Select,
  MenuItem,
} from '@material-ui/core';

import ChartTemplate from './chart';
import { fetchTasksDone, selectTasksDoneState } from '../../redux/slices/tasksSlice';
import taskService from '../../services/tasks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  tabsContainer: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '150px',
  },
  content: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  selectedTab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const DashboardPage: React.FC = () => {
  const classes = useStyles();
  const [showMembers, setShowMembers] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const tasksDoneState = useSelector(selectTasksDoneState);
  const [taskDoneData, setTaskDoneData] = useState<any[]>([]);
  console.log('tasksDoneState', tasksDoneState);

  const handleToggleMembers = () => {
    setShowMembers((prevState) => !prevState);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTasksDone());
  }, []);

  const tasksDone = async () => {
    const tasks = await taskService.getTasksDone();
    return tasks;
  };

  // biến dữ liệu task thành dạng chart theo ngày đếm số lượng task theo ngày
  // name: thứ, value: số lượng task
  // biến đổi từ tasks thành dạng chart
  const tasksDoneChart: any[] = [];
  const tasksChart: any[] = [];
  console.log('tasks', tasksDone());
  for (let i = 0; i < tasksDoneState.length; i++) {

    const dateStr = tasksDoneState[i].createdAt.toString().replace(/^(\d{4})-(\d{2})-(\d{2}).*/, '$3/$2/$1');
    console.log('dateStr', dateStr);
    const index = tasksChart.findIndex((item: any) => item.name === dateStr);
    if (index === -1) {
      tasksChart.push({ name: dateStr, value: 1 });
      tasksChart[index].value += 1;
    }
    else {
      tasksChart[index].value += 1;
    }
    if (tasksDoneState[i].closedAt != null) {
      const dateStr = tasksDoneState[i].createdAt?.toString().replace(/^(\d{4})-(\d{2})-(\d{2}).*/, '$3/$2/$1');
      console.log('dateStr', dateStr);
      const index = tasksDoneChart.findIndex((item: any) => item.name === dateStr);
      if (index === -1) {
        tasksDoneChart.push({ name: dateStr, value: 1 });
      }
      else {
        tasksDoneChart[index].value += 1;
      }
    }

  }
  console.log('taskDoneD', tasksDoneChart);
  console.log('taskD', tasksChart);


  const taskCompletedData = [
    { name: 'Day 1', value: 10 },
    { name: 'Day 2', value: 8 },
    { name: 'Day 3', value: 6 },
    // Add more data points for Task Completed chart
  ];

  const newTaskData = [
    { name: 'Day 1', value: 5 },
    { name: 'Day 2', value: 7 },
    { name: 'Day 3', value: 3 },
    // Add more data points for New Task chart
  ];

  const projectDoneData = [
    { name: 'Day 1', value: 2 },
    { name: 'Day 2', value: 5 },
    { name: 'Day 3', value: 3 },
    // Add more data points for Project Done chart
  ];

  const chartColors = [
    '#8884d8',
    '#82ca9d',
    '#ffbb28',
    '#ff8042',
    '#8884d8',
    '#82ca9d',
  ];

  function setTaskDoneTime(value: any) {
    let newData: any[] = []; // Create a new array for the updated data

    if (value === 'days') {
      newData = [
        { name: 'Day 1', value: 1 },
        { name: 'Day 2', value: 2 },
        { name: 'Day 3', value: 4 },
        // Add more data points for Task Done chart
      ];
    }
    if (value === 'weeks') {
      newData = [
        { name: 'Week 1', value: 3 },
        { name: 'Week 2', value: 2 },
        { name: 'Week 3', value: 1 },
        // Add more data points for Task Done chart
      ];
    }
    if (value === 'months') {
      newData = [
        { name: 'Month 1', value: 4 },
        { name: 'Month 2', value: 5 },
        { name: 'Month 3', value: 3 },
        // Add more data points for Task Done chart
      ];
    }

    setTaskDoneData(newData); // Update the taskDoneData state with the new data
  }

  const taskDoneTime = ['days', 'weeks', 'months'];

  useEffect(() => {
    setTaskDoneTime('days'); // Set the default value to "days" and initialize the chart
  }, []);

  return (
    <>
      {/* <NavBar /> */}
      <div className={classes.root}>
        <div className={classes.tabsContainer}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            orientation="vertical"
            variant="scrollable"
          >
            <Tab label="Dashboard" className={currentTab === 0 ? classes.selectedTab : ''} />
            <Tab label="Timeline" className={currentTab === 1 ? classes.selectedTab : ''} />
            <Tab label="Task" className={currentTab === 2 ? classes.selectedTab : ''} />
            <Tab label="Files" className={currentTab === 3 ? classes.selectedTab : ''} />
          </Tabs>
        </div>

        <div className={classes.content}>
          {currentTab === 0 && (
            <div>
              <div style={{ display: 'flex' }}>
                {/* Task Completed Chart */}
                <div style={{ flex: 1, padding: '10px' }}>
                  <h2>Task Completed</h2>
                  <ChartTemplate
                    data={taskCompletedData}
                    color={chartColors[0]}
                    name="Task Completed"
                    lineThickness={2}
                  />
                </div>

                {/* New Task Chart */}
                <div style={{ flex: 1, padding: '10px' }}>
                  <h2>New Task</h2>
                  <ChartTemplate
                    data={newTaskData}
                    color={chartColors[1]}
                    name="New Task"
                    lineThickness={2}
                  />
                </div>

                {/* Project Done Chart */}
                <div style={{ flex: 1, padding: '10px' }}>
                  <h2>Project Done</h2>
                  <ChartTemplate
                    data={tasksChart}
                    color={chartColors[2]}
                    name="Project Done"
                    lineThickness={2}
                  />
                </div>
              </div>
              {/* Task Done Chart */}
              <div>
                <h2>Task Done</h2>
                {/* task done days, weeks, months */}
                <Select
                  value="days" // Set the default value to "days"
                  onChange={(e) => setTaskDoneTime(e.target.value)}
                >
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="weeks">Weeks</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                </Select>
                <ChartTemplate
                  data={[]}
                  color={chartColors[3]}
                  name="Task Done"
                  lineThickness={5}
                />
              </div>
            </div>
          )}

          {/* Rest of the code */}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
