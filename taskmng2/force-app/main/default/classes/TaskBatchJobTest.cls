@isTest
public class TaskBatchJobTest {
    @isTest
    static void testBatchJob() {
        List<Task__c> tasks = new List<Task__c>();
        for (Integer i = 0; i < 5; i++) {
            tasks.add(new Task__c(Name='Task ' + i, Due_Date__c=Date.today().addDays(-1), Completed__c=false));
        }
        insert tasks;

        Test.startTest();
        Database.executeBatch(new TaskBatchJob());
        Test.stopTest();

        for (Task__c task : [SELECT Completed__c FROM Task__c]) {
            System.assertEquals(true, task.Completed__c);
        }
    }
}
