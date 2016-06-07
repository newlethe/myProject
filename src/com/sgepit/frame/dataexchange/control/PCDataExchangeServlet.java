package com.sgepit.frame.dataexchange.control;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.xml.messaging.JAXMServlet;
import javax.xml.messaging.ReqRespListener;
import javax.xml.soap.SOAPMessage;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.service.PCDataReceiveService;

public class PCDataExchangeServlet extends JAXMServlet implements ReqRespListener {
	

	private static final long serialVersionUID = 1L;
	private PCDataReceiveService pcDataReceiveService;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		pcDataReceiveService = (PCDataReceiveService) Constant.wact.getBean("PCDataReceiveService");
	}
	
	public PCDataReceiveService getPcDataReceiveService() {
		return pcDataReceiveService;
	}

	public void setPcDataReceiveService(PCDataReceiveService pcDataReceiveService) {
		this.pcDataReceiveService = pcDataReceiveService;
	}

	public SOAPMessage onMessage(SOAPMessage message) {
		return pcDataReceiveService.executeDataExchange(message);
	}

}
