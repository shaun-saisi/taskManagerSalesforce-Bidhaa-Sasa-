public with sharing class TaskController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [SELECT Id, Name, Completed__c, Due_Date__c FROM Task__c];
    }

    @AuraEnabled
    public static void updateTaskCompletion(Id taskId, Boolean isChecked) {
        Task__c taskToUpdate = [SELECT Id, Completed__c FROM Task__c WHERE Id = :taskId LIMIT 1];
        taskToUpdate.Completed__c = isChecked;
        update taskToUpdate;
    }
}
