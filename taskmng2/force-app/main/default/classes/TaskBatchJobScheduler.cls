public class TaskBatchJobScheduler implements Schedulable {
    public void execute(SchedulableContext context) {
        TaskBatchJob batchJob = new TaskBatchJob();
        Database.executeBatch(batchJob);
    }
}
