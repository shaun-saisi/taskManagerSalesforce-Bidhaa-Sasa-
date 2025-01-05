import { createElement } from 'lwc';
import TaskList from 'c/taskList';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import { createApexTestWireAdapter } from '@salesforce/wire-service-jest-util';

// Mock getTasks adapter
const mockGetTasks = createApexTestWireAdapter(getTasks);

describe('c-task-list', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-task-list', {
            is: TaskList
        });
        document.body.appendChild(element);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders task list when data is returned', async () => {
        // Manually set tasks for testing
        const mockData = [{ Id: '1', Name: 'Test Task', Completed__c: false }];
        element.setTasksForTest(mockData);

        // Wait for any asynchronous DOM updates
        await Promise.resolve();

        console.log('element.tasks:', element.tasks); // Check tasks property
        console.log('element.filteredTasks:', element.filteredTasks); // Check filteredTasks property

        const taskList = element.shadowRoot.querySelector('ul');
        console.log('taskList:', taskList); // Add logging
        console.log('element.shadowRoot:', element.shadowRoot); // Debugging shadowRoot

        expect(taskList).not.toBeNull();
        expect(taskList.children.length).toBeGreaterThan(0);
    });

    it('displays a loading spinner while fetching tasks', async () => {
        // Emit empty data to simulate loading state
        mockGetTasks.emit([]);

        // Wait for any asynchronous DOM updates
        await Promise.resolve();

        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        console.log('spinner:', spinner); // Add logging
        expect(spinner).not.toBeNull();
    });
});
