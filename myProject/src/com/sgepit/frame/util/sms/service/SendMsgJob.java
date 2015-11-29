package com.sgepit.frame.util.sms.service;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.sgepit.frame.base.Constant;

public class SendMsgJob extends QuartzJobBean {
	
	//quartz任务调度
	@Override
	protected void executeInternal(JobExecutionContext arg0)
			throws JobExecutionException {
		try{
			System.out.println("任务调度开始..."+Constant.wact.getBean("smsCommonService"));
			
			SmsCommonServiceFacade SmsCommon= (SmsCommonServiceFacade)Constant.wact.getBean("smsCommonService");
			SmsCommon.sendSms();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
