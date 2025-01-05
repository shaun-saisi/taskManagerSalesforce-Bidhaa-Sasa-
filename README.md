# Task Manager Salesforce Project  

This project is a Task Manager application built on Salesforce. It fulfills the requirements of managing "Tasks" with due dates and completion flags using Salesforce technologies such as Custom Objects, Lightning Web Components (LWC), Apex Batch/Queueable jobs, and an Apex REST Endpoint.  

---

## Table of Contents  
- [Project Overview](#project-overview)  
- [Deliverables](#deliverables)  
  - [Custom Object Creation](#custom-object-creation)  
  - [LWC Component](#lwc-component)  
  - [Apex Batch or Queueable Job](#apex-batch-or-queueable-job)  
  - [Apex REST Endpoint](#apex-rest-endpoint)  
- [Deployment Instructions](#deployment-instructions)  
  - [Custom Object Deployment](#custom-object-deployment)  
  - [LWC Deployment](#lwc-deployment)  
  - [Apex Batch/Queueable Deployment](#apex-batchqueueable-deployment)  
  - [REST Endpoint Deployment](#rest-endpoint-deployment)  
- [Testing Instructions](#testing-instructions)  
  - [Testing the LWC](#testing-the-lwc)  
  - [Testing the Batch/Queueable Job](#testing-the-batchqueueable-job)  
  - [Testing the REST Endpoint](#testing-the-rest-endpoint)  
- [Known Limitations and Assumptions](#known-limitations-and-assumptions)  

---

## Project Overview  

This application allows your company to:  
- Track and manage tasks with due dates and completion flags.  
- Use a Lightning Web Component for seamless UI interactions.  
- Automate task updates using Apex Batch/Queueable jobs.  
- Provide a REST API to interact with tasks programmatically.  

---

## Deliverables  

### Custom Object Creation  
**Object Name:** `Task__c`  

**Fields:**  
- `Name` (Text) - **Required**  
- `Due_Date__c` (Date)  
- `Completed__c` (Checkbox, default: false)

  ### Custom Object Deployment  
1. Ensure you have Salesforce CLI (SF CLI) installed.
2. Connect to your org
3. From the project root directory, deploy the custom object metadata:  
   sf project deploy start -d force-app/main/default/objects/Task__c

---

### LWC Component  
**Component Name:** `taskList`  

**Features:**  
- Displays a list of `Task__c` records in a table, showing:  
  - Name  
  - Due Date  
  - Completed  
- Allows users to mark a task as completed by calling an `@AuraEnabled` Apex method.  

**LWC Testing Command:**  
To run LWC tests, use the following command: sf force:lightning:lwc:test:run

## Deployment Instructions  
- Deploy the lwc using this command: sf project deploy start -d force-app/main/default/lwc

- Add the taskList component to a tab and access it on the Sales homepage:
Navigate to Setup > Tabs and Apps > Lightning App Builder.
Select the Sales app.
Click Edit and add a new tab.
Choose Custom as the tab type and name it "Task Manager".
Drag the taskList component to the canvas.
Save and activate the page.
Go to the Salesforce homepage and select the Sales app. You should see the "Task Manager" tab with the LWC.
---

### Apex Batch or Queueable Job  
**Functionality:**  
- Finds all `Task__c` records where:  
  - `Due_Date__c` < TODAY()  
  - `Completed__c` = false  
- Updates these records to set `Completed__c` = true.

- ## Deployment Instructions  
  Deploy the lwc using this command: sf project deploy start -d force-app/main/default/classes

**Apex Classes Testing Command:** 
 - : sf force:apex:test:run -d force-app/main/default/classes
---

### Apex REST Endpoint  
**Class Annotation:** `@RestResource`  

**Features:**  
- Provides a `GET` method that returns a JSON list of all `Task__c` records, including:  
  - Name  
  - Due Date  
  - Completed
 
    -
Use curl.
Make a GET request to the endpoint:
/services/apexrest/TaskRestEndpoint
---

Limitations:

The batch job is not scheduled by default; users must manually execute or schedule it.
The REST endpoint does not include advanced filtering or sorting capabilities.

Assumptions:

Tasks without due dates are excluded from batch updates.
Users have the necessary permissions to interact with the Task__c object, LWC, and Apex classes.



