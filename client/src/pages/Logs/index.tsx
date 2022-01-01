import * as React  from 'react';
import './Logs.css';
import axios from 'axios';
import {useEffect, useState} from 'react';
import { Log } from '../../common/models/Log';
import {toast} from 'react-toastify';
import {Button, Table} from 'react-bootstrap'

function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    axios
    .get('http://localhost:5001/logs')
    .then(res => {
      setLogs(res.data as Log[])
    })
    .catch((error) => toast.error(error.message))
  }

  const addLog = () => {
    const log: Log = {
      code: 'AB42',
      callstack: [],
      description: 'A log',
      deviceInfo: {
        device: '?',
        os: '?',
        browser: navigator.appName,
        os_version: '?',
        userAgent: navigator.userAgent,
      },
      identifier: '42',
      message: 'Added a log',
      type: 0,
    }

    axios
    .post('http://localhost:5001/log', log)
    .then(() => {
      getLogs()
      toast.success('Toast added')
    })
    .catch((error) => toast.error(error.message))
  }

  return (
    <div className="logs" data-testid="logs-page">
      <h1>Logs</h1>
      <Table striped bordered hover data-testid="logs-table">
        <tbody>
        <tr>
          <th>description</th>
          <th>message</th>
          <th>timestamp</th>
        </tr>
        {logs.map((log, index) => (
            <tr key={`log-${index}`}>
              <td>{log.description}</td><td>{log.message}</td>
              <td>{log.timestamp}</td>
            </tr>
        ))}
        </tbody>
      </Table>
      <Button
        data-testid="btn-add-log"
        onClick={addLog}
      >
        Add a log
      </Button>
    </div>
  );
}

export default Logs;
