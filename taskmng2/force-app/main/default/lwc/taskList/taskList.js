import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskAsCompleted from '@salesforce/apex/TaskController.markTaskAsCompleted'; // Corrected method name
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskList extends LightningElement {
  @track tasks;
  columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    { label: 'Completed', fieldName: 'Completed__c', type: 'boolean' },
    { type: 'button', typeAttributes: { label: 'Mark Completed', name: 'complete' } }
  ];

  @wire(getTasks)
  wiredTasks({ data, error }) {
    if (data) {
      this.tasks = data;
    } else if (error) {
      console.error(error);
    }
  }

  handleRowAction(event) {
    const taskId = event.detail.row.Id;
    markTaskAsCompleted({ taskId })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Task marked as completed.',
            variant: 'success',
          })
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
}
