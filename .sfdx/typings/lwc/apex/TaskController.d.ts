declare module "@salesforce/apex/TaskController.getTasks" {
  export default function getTasks(): Promise<any>;
}
declare module "@salesforce/apex/TaskController.markTaskComplete" {
  export default function markTaskComplete(param: {taskId: any}): Promise<any>;
}
