import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskAsCompleted from '@salesforce/apex/TaskController.markTaskAsCompleted';
import { refreshApex } from '@salesforce/apex';

export default class TaskList extends LightningElement {
    @track tasks = [];
    @track showToast = false; // To control toast visibility
    @track toastMessage = ''; // To set the toast message
    wiredTasksData; // Store the wired data for refreshing

    @wire(getTasks)
    wiredTasks(response) {
        this.wiredTasksData = response;
        const { data, error } = response;
        if (data) {
            this.tasks = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleCheckboxChange(event) {
        const taskId = event.target.dataset.id;
        markTaskAsCompleted({ taskId: taskId })
            .then(() => {
                this.toastMessage = 'Task completed successfully!';
                this.showToast = true;

                // Auto-hide the toast after 3 seconds
                setTimeout(() => {
                    this.showToast = false;
                }, 3000);

                this.refreshTasks();
            })
            .catch((error) => {
                console.error('Error completing task:', error);
            });
    }

    refreshTasks() {
        return refreshApex(this.wiredTasksData); // Refresh the task list
    }
}
