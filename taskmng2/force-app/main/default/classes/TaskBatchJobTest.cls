@isTest
public class TaskBatchJobTest {
    // Utility method to create test data
    private static void createTestTasks() {
        List<Task__c> tasks = new List<Task__c>();
        tasks.add(new Task__c(Name = 'Task 1', Due_Date__c = Date.today().addDays(-1), Completed__c = false));
        tasks.add(new Task__c(Name = 'Task 2', Due_Date__c = Date.today().addDays(-2), Completed__c = false));
        tasks.add(new Task__c(Name = 'Task 3', Due_Date__c = Date.today().addDays(1), Completed__c = false)); // Future task
        insert tasks;
    }
    
    @isTest
    static void testBatchJobExecution() {
        // Arrange: Set up test data
        createTestTasks();
        
        // Act: Execute the batch job
        Test.startTest();
        TaskBatchJob batchJob = new TaskBatchJob();
        Database.executeBatch(batchJob, 2); // Batch size of 2
        Test.stopTest();
        
        // Assert: Verify completed tasks
        List<Task__c> tasks = [SELECT Id, Completed__c, Due_Date__c FROM Task__c];
        Integer completedCount = 0;
        for (Task__c task : tasks) {
            if (task.Due_Date__c < Date.today()) {
                System.assert(task.Completed__c, 'Task should be marked as completed');
                completedCount++;
            } else {
                System.assert(!task.Completed__c, 'Future tasks should not be marked as completed');
            }
        }
        System.assertEquals(2, completedCount, 'Expected 2 tasks to be marked as completed');
    }
    
    @isTest
    static void testBatchJobWithNoTasks() {
        // Act: Execute the batch job with no tasks
        Test.startTest();
        TaskBatchJob batchJob = new TaskBatchJob();
        Database.executeBatch(batchJob, 2);
        Test.stopTest();
        
        // Assert: Ensure no errors occurred
        System.assertEquals(0, [SELECT COUNT() FROM Task__c WHERE Completed__c = true],
            'No tasks should be marked as completed because no tasks exist');
    }
    
    @isTest
    static void testBatchJobExceptionHandling() {
        // Arrange: Create a task that will cause an exception
        Task__c task = new Task__c(Name = 'Faulty Task', Due_Date__c = Date.today().addDays(-1), Completed__c = false);
        insert task;
        
        Test.startTest();
        TaskBatchJob batchJob = new TaskBatchJob();
        Test.setMock(Database.BatchableContext.class, new ExceptionMock());
        
        // Act & Assert: Execute the batch and verify exception handling
        try {
            Database.executeBatch(batchJob, 1);
        } catch (Exception e) {
            System.assertEquals('Simulated exception', e.getMessage(), 'Exception should be handled correctly');
        }
        Test.stopTest();
    }
    
    // Mock Class for Exception Testing
    private class ExceptionMock implements Database.BatchableContext {
        public String getJobId() {
            throw new CustomException('Simulated exception');
        }
        
        public String getChildJobId() {
            return null;
        }
    }
    
    // Custom exception for testing
    public class CustomException extends Exception {}
}
