@isTest
public class TaskControllerTest {
    @isTest
    static void testGetTasks() {
        // Create and insert a test task
        Task__c task = new Task__c(Name = 'Test Task', Due_Date__c = Date.today(), Completed__c = false);
        insert task;

        // Test the getTasks method
        Test.startTest();
        List<Task__c> tasks = TaskController.getTasks();
        Test.stopTest();

        // Assert that the task was retrieved
        System.assertEquals(1, tasks.size(), 'The number of tasks retrieved should be 1');
        System.assertEquals(task.Id, tasks[0].Id, 'The retrieved task ID should match the inserted task ID');
    }

    @isTest
    static void testMarkTaskCompleted() {
        // Create and insert a test task
        Task__c task = new Task__c(Name = 'Incomplete Task', Due_Date__c = Date.today(), Completed__c = false);
        insert task;

        // Test the markTaskCompleted method
        Test.startTest();
        TaskController.markTaskCompleted(task.Id);
        Test.stopTest();

        // Retrieve the updated task and assert that it is marked as completed
        Task__c updatedTask = [SELECT Completed__c FROM Task__c WHERE Id = :task.Id];
        System.assertEquals(true, updatedTask.Completed__c, 'The task should be marked as completed');
    }
}
