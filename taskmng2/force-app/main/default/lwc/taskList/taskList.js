import { LightningElement, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks'; // Apex method to fetch tasks
import updateTaskCompletion from '@salesforce/apex/TaskController.updateTaskCompletion'; // Apex method to update task completion
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // For showing toast messages

export default class TaskList extends LightningElement {
    tasks = [];
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Due Date', fieldName: 'Due_Date__c' },
        {
            label: 'Completed',
            type: 'boolean',
            fieldName: 'Completed__c',
            typeAttributes: {
                label: 'Completed',
                name: 'completed',
                onchange: this.handleCheckboxChange.bind(this),
            },
        },
    ];

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleCheckboxChange(event) {
        const taskId = event.target.dataset.id;
        const isChecked = event.target.checked;

        // Call Apex method to update task completion
        updateTaskCompletion({ taskId, isChecked })
            .then(() => {
                this.showToast('Success', 'Task completion updated!', 'success');
            })
            .catch((error) => {
                this.showToast('Error', 'Error updating task completion', 'error');
                console.error(error);
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
