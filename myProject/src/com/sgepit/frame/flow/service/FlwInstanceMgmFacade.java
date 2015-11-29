package com.sgepit.frame.flow.service;

import java.sql.SQLException;

import org.apache.commons.collections.map.ListOrderedMap;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwLog;

public interface FlwInstanceMgmFacade {

	public abstract void setFlowDAO(FlowDAO flowDAO);
	/**
	 * 流程发起 flw.new.action.js
	 * @param defid 定义的流程id 表flw_definition的pk
	 * @param ins 流程实例记录 表flw_instance记录
	 * @param log 流程日志 表flw_log记录
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public abstract String insertFlwInstance(String defid, FlwInstance ins,
			FlwLog log) throws SQLException, BusinessException;

	public abstract boolean deleteFlwInstance(String insid);

	public abstract ListOrderedMap getTableColumns(String tabName, String where)
			throws Exception;

	public abstract boolean deleteFlowIns(String insid, boolean isDelBiz);

	public abstract String findFlwInsno(String type);

	public abstract void addConToFaceIns(String insid, String conno);

	public abstract String DEL_FLOW(String flowid);

	public abstract String DEL_INS(String insid);

	public abstract boolean resetFlwLog(String arrEdit[][]);

	public abstract void saveFlwTitle(String insid, String title);

	public abstract void saveFlwNo(String insid, String flwno);

	public abstract boolean isFlwData(String data_no, String data);

	public abstract boolean delInsAdjunct(String fileids);
	
	public abstract String getSelectData();
}
