
import  TaskList from 'c/taskList';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskCompleted from '@salesforce/apex/TaskController.markTaskCompleted';
import { flushPromises } from 'testUtils/flushPromises'; 
import { createElement } from 'lwc';

jest.mock('@salesforce/apex/TaskController.getTasks', () => {
    return {
        default: jest.fn()
    };
}, { virtual: true });

jest.mock('@salesforce/apex/TaskController.markTaskCompleted', () => {
    return {
        default: jest.fn()
    };
}, { virtual: true });

describe('c-task-list', () => {
    afterEach(() => {
        // Clear the DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders tasks correctly when data is returned', async () => {
        // Mock data
        getTasks.mockResolvedValue([
            { Id: '1', Name: 'Task 1', Completed__c: false },
            { Id: '2', Name: 'Task 2', Completed__c: true }
        ]);

        // Arrange
        const element = createElement('c-task-list', {
            is: TaskList
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Assert
        const taskItems = element.shadowRoot.querySelectorAll('.task-item');
        expect(taskItems.length).toBe(2);
        expect(taskItems[0].textContent).toContain('Task 1');
        expect(taskItems[1].textContent).toContain('Task 2');
    });

    it('shows error message when tasks fail to load', async () => {
        // Mock error
        getTasks.mockRejectedValue(new Error('Error loading tasks'));

        // Arrange
        const element = createElement('c-task-list', {
            is: TaskList
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Assert
        const errorMessage = element.shadowRoot.textContent;
        expect(errorMessage).toContain('Error loading tasks');
    });

    it('filters tasks based on filter type', async () => {
        // Mock data
        getTasks.mockResolvedValue([
            { Id: '1', Name: 'Task 1', Completed__c: false },
            { Id: '2', Name: 'Task 2', Completed__c: true }
        ]);

        // Arrange
        const element = createElement('c-task-list', {
            is: TaskList
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Simulate filter change
        const pendingButton = element.shadowRoot.querySelector('lightning-button[data-filter="pending"]');
        pendingButton.click();
        await flushPromises();

        // Assert
        const taskItems = element.shadowRoot.querySelectorAll('.task-item');
        expect(taskItems.length).toBe(1);
        expect(taskItems[0].textContent).toContain('Task 1');
    });

    it('toggles task completion status and refreshes data', async () => {
        // Mock data
        getTasks.mockResolvedValue([
            { Id: '1', Name: 'Task 1', Completed__c: false }
        ]);
        markTaskCompleted.mockResolvedValue();

        // Arrange
        const element = createElement('c-task-list', {
            is: TaskList
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Simulate toggle status
        const toggleButton = element.shadowRoot.querySelector('lightning-button[data-id="1"]');
        toggleButton.click();
        await flushPromises();

        // Assert
        expect(markTaskCompleted).toHaveBeenCalledWith({ taskId: '1' });
        expect(getTasks).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
});
