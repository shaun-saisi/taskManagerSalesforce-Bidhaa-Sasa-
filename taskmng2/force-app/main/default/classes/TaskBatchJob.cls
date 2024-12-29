public class TaskBatchJob implements Database.Batchable<SObject> {
    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator(
            'SELECT Id FROM Task__c WHERE Due_Date__c < TODAY AND Completed__c = false'
        );
    }

    public void execute(Database.BatchableContext context, List<SObject> scope) {
        for (Task__c task : (List<Task__c>)scope) {
            task.Completed__c = true;
        }
        update scope;
    }

    public void finish(Database.BatchableContext context) {
        System.debug('Batch Job Completed');
    }
}
