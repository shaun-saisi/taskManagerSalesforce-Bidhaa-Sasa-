public class TaskBatchJob implements Database.Batchable<SObject> {
    private static final String QUERY = 'SELECT Id FROM Task__c WHERE Due_Date__c < TODAY AND Completed__c = false';

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator(QUERY);
    }

    public void execute(Database.BatchableContext context, List<SObject> scope) {
        try {
            for (Task__c task : (List<Task__c>)scope) {
                task.Completed__c = true;
            }
            update scope;
        } catch (Exception e) {
            System.debug('Error in execute method: ' + e.getMessage());
        }
    }

    public void finish(Database.BatchableContext context) {
        System.debug('Batch Job Completed');
    }
}
