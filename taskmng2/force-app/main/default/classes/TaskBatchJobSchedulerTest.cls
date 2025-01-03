@isTest
public class TaskBatchJobSchedulerTest {
    
    @isTest
    static void testSchedulerExecution() {
        // Arrange: Create test data
        List<Task__c> tasks = new List<Task__c>();
        tasks.add(new Task__c(Name = 'Task 1', Due_Date__c = Date.today().addDays(-1), Completed__c = false));
        tasks.add(new Task__c(Name = 'Task 2', Due_Date__c = Date.today().addDays(-2), Completed__c = false));
        insert tasks;
        
        // Act: Schedule the job
        Test.startTest();
        String cronExp = '0 0 0 * * ?';
        String jobId = System.schedule('Test Task Batch Job', 
                                     cronExp, 
                                     new TaskBatchJobScheduler());
        
        // Verify the scheduled job exists
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered 
                         FROM CronTrigger 
                         WHERE Id = :jobId];
        System.assertEquals(cronExp, ct.CronExpression, 'Cron expression should match');
        
        // Force the batch job to run
        TaskBatchJob batchJob = new TaskBatchJob();
        Database.executeBatch(batchJob);
        Test.stopTest();
        
        // Assert: Verify tasks were updated
        List<Task__c> updatedTasks = [SELECT Id, Due_Date__c, Completed__c 
                                    FROM Task__c 
                                    WHERE Due_Date__c < TODAY];
        System.assertEquals(2, updatedTasks.size(), 'Should find 2 tasks due in the past');
        for(Task__c task : updatedTasks) {
            System.assert(task.Completed__c, 'Past due tasks should be marked as completed');
        }
    }
    
    @isTest
    static void testSchedulerWithoutTasks() {
        // Act: Schedule the job
        Test.startTest();
        String cronExp = '0 0 0 * * ?';
        String jobId = System.schedule('Test Task Batch Job No Tasks', 
                                     cronExp, 
                                     new TaskBatchJobScheduler());
        
        // Verify the scheduled job exists
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered 
                         FROM CronTrigger 
                         WHERE Id = :jobId];
        System.assertEquals(cronExp, ct.CronExpression, 'Cron expression should match');
        
        // Force the batch job to run
        TaskBatchJob batchJob = new TaskBatchJob();
        Database.executeBatch(batchJob);
        Test.stopTest();
        
        // Assert: Verify no tasks were updated
        Integer taskCount = [SELECT COUNT() FROM Task__c WHERE Completed__c = true];
        System.assertEquals(0, taskCount, 'No tasks should be marked as completed');
    }
}
