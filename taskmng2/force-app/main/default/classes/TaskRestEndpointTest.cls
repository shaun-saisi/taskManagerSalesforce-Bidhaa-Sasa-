@isTest
public class TaskRestEndpointTest {
    
    @isTest
    static void testGetTasks() {
        // Arrange: Create test data
        List<Task__c> tasks = new List<Task__c>();
        tasks.add(new Task__c(Name = 'Task 1', Due_Date__c = Date.today().addDays(-1), Completed__c = false));
        tasks.add(new Task__c(Name = 'Task 2', Due_Date__c = Date.today(), Completed__c = true));
        insert tasks;

        // Act: Simulate the HTTP GET request
        Test.startTest();
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/tasks';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<Task__c> result = TaskRestEndpoint.getTasks();
        Test.stopTest();

        // Assert: Verify the response contains the correct tasks
        System.assertEquals(2, result.size(), 'The response should contain 2 tasks');
        System.assertEquals('Task 1', result[0].Name, 'The first task name should match');
        System.assertEquals(false, result[0].Completed__c, 'The first task should not be completed');
        System.assertEquals('Task 2', result[1].Name, 'The second task name should match');
        System.assertEquals(true, result[1].Completed__c, 'The second task should be completed');
    }

    @isTest
    static void testGetTasksNoData() {
        // Act: Simulate the HTTP GET request with no tasks in the database
        Test.startTest();
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/tasks';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<Task__c> result = TaskRestEndpoint.getTasks();
        Test.stopTest();

        // Assert: Verify the response is empty
        System.assertEquals(0, result.size(), 'The response should be empty when there are no tasks');
    }
}
