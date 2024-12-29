import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';

const columns = [
    { label: 'Task Name', fieldName: 'Name' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    { label: 'Completed', fieldName: 'Completed__c', type: 'checkbox' }
];

export default class TaskList extends LightningElement {
    @track tasks;
    columns = columns;

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
        } else if (error) {
            this.error = error;
        }
    }
}
