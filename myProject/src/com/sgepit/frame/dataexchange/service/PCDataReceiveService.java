package com.sgepit.frame.dataexchange.service;

import javax.xml.soap.SOAPMessage;

/**
 * 数据交互接受业务类
 *
 */
public interface PCDataReceiveService {

	/**
	 * 接受消息并执行语句
	 * @param message
	 * @return
	 */
	SOAPMessage executeDataExchange(SOAPMessage message);

}