@isTest
private class TaskBatchJobTest {
    @isTest
    static void testBatchJob() {
        Task__c task = new Task__c(Name = 'Test Task', Due_Date__c = Date.today().addDays(-1), Completed__c = false);
        insert task;

        Test.startTest();
        Database.executeBatch(new TaskBatchJob());
        Test.stopTest();

        Task__c updatedTask = [SELECT Completed__c FROM Task__c WHERE Id = :task.Id];
        System.assert(updatedTask.Completed__c, 'Task should be marked as completed');
    }
}
