package com.sgepit.frame.flow.service;

import java.io.IOException;

import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwCommonNodeFiles;

public interface FlwDefinitionMgmFacade {
	
	public abstract void setFlowDAO(FlowDAO flowDAO);

	public abstract UpdateBeanInfo parseJsonStr(String str, String className,
			String primayKey);

	public abstract int saveFlwCommonNode(boolean flag, String flowid,
			String nodeid, String xmlName, String cnodePaths, String cnodes);

	public abstract int saveFlwDefGuide(String flowid, String flwTitle,
			String xmlName, String nodePaths, String nodes, String userBelongUnitid);

	public abstract String createXML(String xml, String name)
			throws IOException;

	public abstract void deleteXML(String xml);

	public abstract void stopFlow(String flowid);

	public abstract void changeFlowFrame(String flowid, String frameid);

	public abstract boolean saveBKToNode(String nodeList[][]);

	public abstract boolean saveBKToCommon(String commonList[][]);

	public abstract String getFlwRolws(String flowid);
	
	/**
	 * 设置流程的起草权限及查询权限
	 * @param flowid
	 * @param roles			起草权限
	 * @param rolesSearch	查询权限
	 * @return
	 */
	public abstract boolean setFlwRolws(String flowid,String roles, String rolesSearch);
	
	/**
	 * 设置流程的适用单位
	 * @param flowid
	 * @param unitIds
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 22, 2011
	 */
	public boolean setFlwRangeUnit(String flowid, String unitIds);
	
	/**
	 * 获取流程设置的适用范围
	 * @param flowid
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 22, 2011
	 */
	public String getFlwRangeUnit(String flowid);
	
	
	/**
	 * 根据当前关键节点初始化普通节点文档读写权限配置
	 * @param nodeid 当前关键节点id
	 * @return
	 * @author zhangh 2012-08-02
	 */
	public String initCommonNodeFileType(String nodeid);
	
	/**
	 * 保存普通节点文档读写权限配置
	 * @param cnodeFiles
	 * @return
	 * @author zhangh 2012-08-03
	 */
	public String saveCommonNodeFileType(FlwCommonNodeFiles[] cnodeFilesArr);
}
