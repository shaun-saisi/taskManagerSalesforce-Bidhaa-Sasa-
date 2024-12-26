@isTest
public class TaskControllerTest {
    @isTest
    static void testGetTasks() {
        // Create test data
        Task__c task = new Task__c(Name = 'Test Task', Due_Date__c = Date.today(), Completed__c = false);
        insert task;

        // Call the method
        List<Task__c> tasks = TaskController.getTasks();
        System.assert(!tasks.isEmpty());
    }

    @isTest
    static void testMarkTaskComplete() {
        // Create test data
        Task__c task = new Task__c(Name = 'Test Task', Due_Date__c = Date.today(), Completed__c = false);
        insert task;

        // Call the method
        TaskController.markTaskComplete(task.Id);

        // Verify the update
        Task__c updatedTask = [SELECT Completed__c FROM Task__c WHERE Id = :task.Id];
        System.assert(updatedTask.Completed__c);
    }
}
