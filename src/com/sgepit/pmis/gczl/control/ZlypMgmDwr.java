package com.sgepit.pmis.gczl.control;

import java.io.IOException;
import java.sql.SQLException;

import javax.naming.NamingException;

import org.jdom.JDOMException;

import com.sgepit.frame.base.Constant;
import com.sgepit.pmis.gczl.service.GczlYpMgmFacade;

public class ZlypMgmDwr {

	private GczlYpMgmFacade gczlYpMgm;

	public ZlypMgmDwr() {
		gczlYpMgm = (GczlYpMgmFacade) Constant.wact.getBean("gczlYpMgm");
	}

	public String getGczlYpDetailXml(String jyStatId) {
		return gczlYpMgm.getGczlYpDetailXml(jyStatId);
	}
	
	public Boolean checkSjTypeAvailable(String sjType, String deptId){
		return gczlYpMgm.checkSjTypeAvailable(sjType, deptId);
	}
	
	public String updateYpStatDetailData(String statId ,String dataXML){
		try {
			gczlYpMgm.updateYpStatDetailData(statId, dataXML);
		} catch (Exception e) {
			e.printStackTrace();
			return "fail";
		}
		return "success";
	}

}
