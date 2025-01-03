@isTest
public class TaskBatchJobSchedulerTest {
    
    @isTest
    static void testSchedulerExecution() {
        // Arrange: Create test data for the batch job
        List<Task__c> tasks = new List<Task__c>();
        tasks.add(new Task__c(Name = 'Task 1', Due_Date__c = Date.today().addDays(-1), Completed__c = false));
        tasks.add(new Task__c(Name = 'Task 2', Due_Date__c = Date.today().addDays(-2), Completed__c = false));
        insert tasks;

        // Act: Schedule the job and trigger execution
        String cronExpression = '0 0 0 * * ?'; // Run once daily at midnight
        String jobName = 'Test_TaskBatchJobScheduler';
        Test.startTest();
        System.schedule(jobName, cronExpression, new TaskBatchJobScheduler());
        Test.stopTest();

        // Assert: Verify that the batch job was executed
        List<AsyncApexJob> jobs = [SELECT Id, Status, JobType FROM AsyncApexJob WHERE JobType = 'BatchApex' AND Status = 'Completed'];
        System.assert(!jobs.isEmpty(), 'Batch job should have been executed by the scheduler');

        // Verify that tasks were updated
        List<Task__c> updatedTasks = [SELECT Id, Completed__c FROM Task__c];
        for (Task__c task : updatedTasks) {
            if (task.Due_Date__c < Date.today()) {
                System.assert(task.Completed__c, 'Tasks due before today should be marked as completed');
            } else {
                System.assert(!task.Completed__c, 'Future tasks should not be marked as completed');
            }
        }
    }

    @isTest
    static void testSchedulerWithoutTasks() {
        // Act: Schedule the job with no tasks in the database
        String cronExpression = '0 0 0 * * ?'; // Run once daily at midnight
        String jobName = 'Test_TaskBatchJobScheduler_NoTasks';
        Test.startTest();
        System.schedule(jobName, cronExpression, new TaskBatchJobScheduler());
        Test.stopTest();

        // Assert: Verify the batch job executed without errors
        List<AsyncApexJob> jobs = [SELECT Id, Status, JobType FROM AsyncApexJob WHERE JobType = 'BatchApex' AND Status = 'Completed'];
        System.assert(!jobs.isEmpty(), 'Batch job should have executed even with no tasks');
    }
}
