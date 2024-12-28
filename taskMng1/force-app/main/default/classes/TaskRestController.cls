@RestResource(urlMapping='/tasks/*')
global with sharing class TaskRestController {
    @HttpGet
    global static List<Task__c> getTasks() {
        return [SELECT Name, Due_Date__c, Completed__c FROM Task__c];
    }
}