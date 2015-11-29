package com.sgepit.pmis.finalAccounts.prjGeneralInfo.control;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.Constant;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjParams;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.service.FAPrjInfoOveService;

public class PrjGeneralInfoDWR {
	
	private FAPrjInfoOveService infoOveService;
	
	public PrjGeneralInfoDWR(){
		infoOveService = (FAPrjInfoOveService) Constant.wact.getBean("prjInfoOveService");
		
	}

	public List<FAPrjParams> getPrjParamsByType(String typeId) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		return infoOveService.getPrjParamsByType(typeId, pid);
	}
	
	

}
