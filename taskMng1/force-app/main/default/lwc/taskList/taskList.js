import { LightningElement, wire } from 'lwc';
import { refreshApex } from 'lightning/uiRecordApi';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskComplete from '@salesforce/apex/TaskController.markTaskComplete';

export default class TaskList extends LightningElement {
    tasks;
    error;
    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.tasks = undefined;
        }
    }

    handleComplete(event) {
        const taskId = event.target.dataset.id;
        markTaskComplete({ taskId })
            .then(() => {
                // Refresh tasks list after updating completion status
                return refreshApex(this.wiredTasks);
            })
            .catch(error => {
                this.error = error;
            });
    }
}
