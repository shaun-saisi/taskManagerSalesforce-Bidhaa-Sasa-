// force-app/main/default/lwc/taskList/__mocks__/@salesforce/apex/TaskController.getTasks.js
export default jest.fn(() => Promise.resolve([{ Id: '1', Name: 'Test Task', Completed__c: false }]));
