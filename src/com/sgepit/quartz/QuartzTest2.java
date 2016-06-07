package com.sgepit.quartz;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

public class QuartzTest2 extends QuartzJobBean {
	private QuartzService quartzTest;
	
	
	public void setQuartzTest(QuartzTest quartzTest) {
		this.quartzTest = quartzTest;
	}
	
	/**
	 * 定期执行的方法
	 */

	@Override
	protected void executeInternal(JobExecutionContext arg0)
			throws JobExecutionException {
		System.out.println("Quartz 调用=====");
		
	}

}
