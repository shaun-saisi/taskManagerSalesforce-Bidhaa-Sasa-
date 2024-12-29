@isTest
public class TaskControllerTest {
    @isTest
    static void testGetTasks() {
        Task__c task = new Task__c(Name='Test Task', Due_Date__c=Date.today(), Completed__c=false);
        insert task;

        Test.startTest();
        List<Task__c> tasks = TaskController.getTasks();
        Test.stopTest();

        System.assertEquals(1, tasks.size());
    }

    @isTest
    static void testMarkTaskCompleted() {
        Task__c task = new Task__c(Name='Incomplete Task', Due_Date__c=Date.today(), Completed__c=false);
        insert task;

        Test.startTest();
        TaskController.markTaskCompleted(task.Id);
        Test.stopTest();

        Task__c updatedTask = [SELECT Completed__c FROM Task__c WHERE Id = :task.Id];
        System.assertEquals(true, updatedTask.Completed__c);
    }
}
