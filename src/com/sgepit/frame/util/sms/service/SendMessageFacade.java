package com.sgepit.frame.util.sms.service;

import java.util.ArrayList;

public interface SendMessageFacade {
	// 发送短信
	public void doIt(ArrayList msgList);
	
	/**
	 * 开放只发送一条短信接口
	 * @param content	短信内容
	 * @param mobile	接收号码
	 * @author: Liuay
	 * @createDate: 2012-7-19
	 */
	public void sendASms(String content, String mobile);
}
