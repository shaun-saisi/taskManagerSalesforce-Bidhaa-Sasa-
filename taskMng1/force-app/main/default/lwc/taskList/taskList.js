import { LightningElement, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskComplete from '@salesforce/apex/TaskController.markTaskComplete';

export default class TaskList extends LightningElement {
    tasks;
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
        { label: 'Completed', fieldName: 'Completed__c', type: 'boolean' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Mark Complete',
                name: 'markComplete',
                disabled: { fieldName: 'Completed__c' }
            }
        }
    ];

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const taskId = event.detail.row.Id;
        markTaskComplete({ taskId })
            .then(() => {
                this.tasks = this.tasks.map(task =>
                    task.Id === taskId ? { ...task, Completed__c: true } : task
                );
            })
            .catch(error => {
                console.error(error);
            });
    }
}
