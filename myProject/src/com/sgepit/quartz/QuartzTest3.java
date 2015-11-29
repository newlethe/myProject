package com.sgepit.quartz;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;

public class QuartzTest3 implements StatefulJob {
	private QuartzService quartzTest;
	
	
	public void setQuartzTest(QuartzTest quartzTest) {
		this.quartzTest = quartzTest;
	}
	
	/**
	 * 定期执行的方法
	 */
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		quartzTest.sayHello();
	}

}
