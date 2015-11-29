package com.sgepit.frame.flow.service;

import java.util.List;

import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwDwrRtnLog;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.ZlInfo;

public interface FlwFileMgmFacade {
	
	public abstract void setFlowDAO(FlowDAO flowDAO);

	public abstract String isOpenModel(String flowid, String nodeid,
			String insid, String userid);

	public abstract boolean isUploadSign(String userid);

	public abstract void showStr(String str);

	public abstract boolean removeToZlInfo(List list);

	public abstract boolean checkyj(String insid);

	public abstract FlwFiles getflwfies(String insid);

	public FlwDwrRtnLog removeToZlListJSON(String zlJSON);
	public boolean removeToZlObj(ZlInfo zlInfo);
	public abstract boolean setRemove(String fileid,String filetype,String ismove);
}
