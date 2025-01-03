public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [SELECT Id, Name, Due_Date__c, Completed__c FROM Task__c];
    }

    @AuraEnabled
    public static void markTaskAsCompleted(Id taskId) {
        Task__c task = [SELECT Id, Completed__c FROM Task__c WHERE Id = :taskId LIMIT 1];
        if (task != null) {
            task.Completed__c = true;
            update task;
        }
    }
}
