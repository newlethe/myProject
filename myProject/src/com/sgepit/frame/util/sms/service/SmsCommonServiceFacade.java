package com.sgepit.frame.util.sms.service;

import java.util.List;

import com.sgepit.frame.flow.hbm.TaskView;

public interface SmsCommonServiceFacade {

	void sendSms();

	/**
	 * 判断流程发送后是否发送短信
	 * @param flwTasks	需要发送短信的流程任务
	 * @author pengy 2013-10-25
	 */
	public void isSendMsgNow(List<TaskView> flwTasks);

}