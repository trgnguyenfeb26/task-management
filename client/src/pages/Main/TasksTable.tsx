import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { TaskState } from '../../redux/types';
import TasksMenu from './TasksMenu';
import { formatDateTime } from '../../utils/helperFuncs';
import { priorityStyles, statusStyles } from '../../styles/customStyles';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Paper,
} from '@material-ui/core';
import { useTableStyles } from '../../styles/muiStyles';

const tableHeaders = [
  'Title',
  'Priority',
  'Status',
  'Added',
  'Updated',
  'Notes',
  'Actions',
];

const TasksTable: React.FC<{ tasks: TaskState[] }> = ({ tasks }) => {
  const classes = useTableStyles();
  const history = useHistory();

  return (
    <Paper className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((t) => (
              <TableCell key={t} align="center">
                {t}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((b) => (
            <TableRow key={b.id}>
              <TableCell
                align="center"
                onClick={() =>
                  history.push(`/projects/${b.projectId}/tasks/${b.id}`)
                }
                className={classes.clickableCell}
              >
                <Link
                  component={RouterLink}
                  to={`/projects/${b.projectId}/tasks/${b.id}`}
                  color="secondary"
                >
                  {b.title}
                </Link>
              </TableCell>
              <TableCell align="center">
                <div
                  style={{
                    ...priorityStyles(b.priority),
                    textTransform: 'capitalize',
                    margin: '0 auto',
                  }}
                >
                  {b.priority}
                </div>
              </TableCell>
              <TableCell align="center">
                <div
                  style={{
                    ...statusStyles(b.isResolved),
                    margin: '0 auto',
                  }}
                >
                  {b.isResolved ? 'Closed' : 'Open'}
                </div>
              </TableCell>
              <TableCell align="center">
                {formatDateTime(b.createdAt)} ~ {b.createdBy.username}
              </TableCell>
              <TableCell align="center">
                {!b.updatedAt || !b.updatedBy
                  ? 'n/a'
                  : `${formatDateTime(b.updatedAt)} ~ ${b.updatedBy.username}`}
              </TableCell>
              <TableCell align="center">{b.notes.length}</TableCell>
              <TableCell align="center">
                <TasksMenu
                  projectId={b.projectId}
                  taskId={b.id}
                  currentData={{
                    title: b.title,
                    description: b.description,
                    priority: b.priority,
                  }}
                  isResolved={b.isResolved}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TasksTable;
