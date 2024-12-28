public with sharing class TaskController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [SELECT Id, Name, Due_Date__c, Completed__c FROM Task__c];
    }
    //Enabling aura for the lwc
    @AuraEnabled
    public static void markTaskComplete(Id taskId) {
        Task__c task = [SELECT Id, Completed__c FROM Task__c WHERE Id = :taskId LIMIT 1];
        task.Completed__c = true;
        update task;
    }
}
