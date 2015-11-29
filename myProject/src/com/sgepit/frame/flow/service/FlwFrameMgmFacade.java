package com.sgepit.frame.flow.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwFace;
import com.sgepit.frame.flow.hbm.FlwFaceParams;
import com.sgepit.frame.sysman.hbm.AppFileinfo;

public interface FlwFrameMgmFacade {

	public abstract void setFlowDAO(FlowDAO flowDAO);

	public abstract boolean saveOrUpdateFlwFrame(String frameid,
			String framename, String unitid) throws SQLException, BusinessException;

	public abstract void deleteFlwFrame(String frameid, boolean flag);

	public abstract String checkIsUploadDoc(String flowid, String fileid);

	public abstract int addOrUpdateFlwFace(FlwFace flwFace);

	public abstract String deleteFlwFace(String faceid);

	public abstract int addOrUpdateFlwFaceParams(FlwFaceParams flwFaceParams);

	public abstract String deleteFlwFaceParams(String paramid);

	public abstract void insertFaceParamsIns(String insid, String nodeid,
			String paramvalues);
	
	public abstract String getFaceParamsIns(String insid, String nodeid);
	
	public abstract void deleteFaceParamsIns(String insid, String nodeid);

	public abstract boolean checkIsUploadSign(String userid);

	public abstract List getTableColumns(String tabName);	
	
	public abstract String getFlowTreeByFrameidAndUserid(String frameid,String userid);	

	public abstract String getFlowTreeByFrameid(String frameid);	
	
	public List<TreeNode> getFlowTreeNodeById(String frameid);
	
	public List<TreeNode> getFlowTreeNodeByIdAndRole(String frameid);
	
	/**
     * 更新流程的业务参数： 
     * @param insid	流程实例ID
     * @param nodeid 流程节点ID
     * @param paramvalues	需要变更的参数： 格式为：param1:value1`param2:value2;
     * @author: Liuay
     * @createDate: Aug 2, 2011
     */
    public void updateFaceParamsIns (String insid, String nodeid, String paramvalues);
    
	/**
	 * 流程查询权限的流程树结构
	 * 
	 * @param frameid	流程文件夹ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-7-13
	 */
	public List<TreeNode> getFlowTreeNodeByIdAndSearchRole(String frameid);
	
	/**
	 * 获取所有的查询权限范围内的已处理、未处理流程
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-7-13
	 */
	public List getFlwInsBySearchRoles(String orderBy, Integer start, Integer limit, HashMap<String, String> param);
	
    /**
     * 查找用户签名盖章图片是否已经上传
     * @param userid
     * @return
     * @author zhangh 2013-11-06
     */
    public boolean checkIsUploadStamp(String userid, String order);
}
