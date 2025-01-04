import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskCompleted from '@salesforce/apex/TaskController.markTaskCompleted';
import { refreshApex } from '@salesforce/apex';
import { flushPromises } from 'testUtils/flushPromises';


export default class TaskList extends LightningElement {
    // Reactive properties
    @track tasks = [];
    @track filteredTasks = [];
    @track filterType = 'all';
    @track sortDirection = 'asc';
    @track isLoading = true;

    // Toast properties
    @track showToast = false;
    @track toastMessage = '';
    @track toastVariant = 'success';

    // Wired Apex response holder
    wiredTaskResult;

    connectedCallback() {
        this.isLoading = true;
    }

    // Fetch tasks via wire service
    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTaskResult = result;
        const { data, error } = result;

        if (data) {
            this.processTasks(data);
        } else if (error) {
            this.showNotification(
                'Error loading tasks: ' + this.reduceErrors(error),
                'error'
            );
            console.error('Error fetching tasks:', error);
        }
    }

    // Process fetched tasks
    processTasks(data) {
        this.tasks = data;
        this.filterAndSortTasks();
        this.isLoading = false;
    }

    // Handle filter change
    handleFilterChange(event) {
        this.filterType = event.target.dataset.filter;
        this.filterAndSortTasks();
    }

    // Filter and sort tasks
    filterAndSortTasks() {
        // Filter tasks based on filterType
        this.filteredTasks = this.tasks.filter((task) => {
            if (this.filterType === 'pending') {
                return !task.Completed__c;
            } else if (this.filterType === 'completed') {
                return task.Completed__c;
            }
            return true;
        });

        // Sort the tasks
        this.sortTasks();
    }

    // Toggle sort direction and sort tasks
    handleSort() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.sortTasks();
    }

    // Sort tasks based on name and direction
    sortTasks() {
        const isAsc = this.sortDirection === 'asc';
        this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
            const nameA = (a.Name || '').toLowerCase();
            const nameB = (b.Name || '').toLowerCase();

            if (nameA < nameB) return isAsc ? -1 : 1;
            if (nameA > nameB) return isAsc ? 1 : -1;
            return 0;
        });
    }

    // Handle task completion toggle
    async handleStatusToggle(event) {
        try {
            const taskId = event.target.dataset.id;
            this.isLoading = true;

            await markTaskCompleted({ taskId });
            await this.refreshData();

            this.showNotification('Task marked as completed successfully', 'success');
        } catch (error) {
            this.showNotification(
                'Error updating task: ' + this.reduceErrors(error),
                'error'
            );
            console.error('Error updating task status:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // Refresh task data
    async refreshData() {
        try {
            await refreshApex(this.wiredTaskResult);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }

    // Display toast notifications
    showNotification(message, variant) {
        this.toastMessage = message;
        this.toastVariant = variant;
        this.showToast = true;

        setTimeout(() => {
            this.hideToast();
        }, 3000); // Auto-hide after 3 seconds
    }

    hideToast() {
        this.showToast = false;
    }

    // Utility to reduce errors into readable format
    reduceErrors(errors) {
        if (!Array.isArray(errors)) {
            errors = [errors];
        }

        return errors
            .filter((error) => !!error)
            .map((error) => {
                if (Array.isArray(error.body)) {
                    return error.body.map((e) => e.message).join(', ');
                }
                return error.message || error.body?.message || error.statusText || 'Unknown error';
            })
            .join(', ');
    }

    // Computed button variants for filtering
    get buttonVariants() {
        return {
            all: this.filterType === 'all' ? 'brand' : 'neutral',
            pending: this.filterType === 'pending' ? 'brand' : 'neutral',
            completed: this.filterType === 'completed' ? 'brand' : 'neutral',
        };
    }

    // Computed sort icon
    get sortIcon() {
        return `utility:${this.sortDirection === 'asc' ? 'arrowup' : 'arrowdown'}`;
    }
}
