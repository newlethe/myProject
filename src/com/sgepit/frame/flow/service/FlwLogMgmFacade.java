package com.sgepit.frame.flow.service;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwCommonNode;
import com.sgepit.frame.flow.hbm.FlwDwrRtnLog;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwLog;
import com.sgepit.frame.flow.hbm.FlwNodeView;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;

public interface FlwLogMgmFacade {
	public final String BALL = "BALL";//无条件分裂
	public final String BSOLE = "BSOLE";//选择性件分裂
	public final String DEFUAL = "S";//普通
	public final String MAND = "MAND";//无条件合并
	public final String MOR = "MOR";//选择性合并
	
	public abstract void setFlowDAO(FlowDAO flowDAO);
	/**
	 * 是否已经签字
	 * @param flwLog
	 * @param insid
	 * @return
	 */
	public abstract boolean checkSignature(FlwLog flwLog, String insid);

	public abstract void setOtherFlowLog(FlwLog flwLog, String insid);

	public abstract void addSysFlwLog(FlwInstance ins, Date fTime,
			String toNode, String type);
	/**
	 * 流程状态节点改变时，系统自动产生日志
	 * @param logid
	 */
	public abstract void addChangeStateLog(String logid);

	public abstract void addTaskFlwLog(FlwInstance ins, Date fTime,
			String toNode, String type);
	/**
	 * 退回时删除状态节点路由（调整表FLW_INSTANCE的worklog字段）
	 * @param ins
	 */
	public abstract void removeCommitState(FlwInstance ins);
	/**
	 * 发送到状态节点
	 * @param flwLog 新的日志对象
	 * @param logid  当前日志id
	 * @param nodeid 当前节点id
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public abstract boolean sendToStateFlow(FlwLog flwLog, String logid,
			String nodeid) throws SQLException, BusinessException;
	/**
	 * 任务节点系统自动日志
	 * @param logid
	 */
	public abstract void finishedTask(String logid);
	/**
	 * 发送到普通节点
	 * @param logid 当前日志ID
	 * @param insid 实例ID
	 * @param nodeid 当前状态节点
	 * @param currentCnodeid 当前普通节点 
	 * @param logList 日志集(当要发送到多个人时，会有多条记录)
	 * @return
	 */
	public abstract boolean sendToCommonFlow(String logid, String insid, String nodeid,
			String currentCnodeid, String logList);
	/**
	 * 功能描述：当前节点为状态节点，接受节点为普通节点时，添加状态改变系统提示，把该节点下所有普通节点保存到普通节点路由实例
	 * 		   当前节点为普通节点，则删除普通节点实例代办（删除表FLW_COMMON_CURRENT_NODE_INS中相关记录）
	 * @param flowid
	 * @param logid
	 * @param insid
	 * @param nodeid
	 * @param cnodeid
	 */
	public abstract void setFinishPrev(String flowid, String logid,
			String insid, String nodeid, String cnodeid);
	/**
	 * 获取下一个或多个状态节点
	 * @param insid
	 * @return
	 */
	public abstract List<FlwNodeView> getNextFlowState(String insid);
	/**
	 * 获取下一个或多个普通节点
	 * @param flowid
	 * @param insid
	 * @param logid
	 * @param nodeid
	 * @param userid
	 * @return
	 */
	public abstract List<FlwCommonNode> getNextCommonState(String flowid, String insid,String logid,
			String nodeid, String userid);
	/**
	 * 退回按钮控制
	 * @param nodeid
	 * @param cnodeid
	 * @return 返回格式"{backBegin:false,backNode:false,backPrev:false}" 
	 * backBegin表示是否显示退回发起人
	 * backNode表示是否显示退回本业务发起人
	 * backPrev表示是否显示退回上一步
	 */
	public abstract FlwDwrRtnLog isToBackOk(String logid);
	/**
	 * 检查退回上一步按钮
	 * @param logid
	 * @return
	 */
	public abstract FlwDwrRtnLog checkToBackPrev(String logid);
	/**
     * 检查退回本业务发起人按钮
     * @param logid
     * @return
     */
    public abstract FlwDwrRtnLog checkToBackNode(String logid);
    /**
     * 检查退回本业务发起人按钮
     * @param logid
     * @return
     */
    public abstract FlwDwrRtnLog checkToBackBegin(String logid);
	/**
	 * 普通节点的退回，并且该节点不是第一个普通节点，也就是该退回节点的上一个节点必须满足是普通节点
	 * @param flowid 流程id
	 * @param insid  流程实例id
	 * @param nodeid 当前状态节点id
	 * @param cnodeid 当前普通节点id
	 * @param logid   当前日志id
	 * @param flwLog  退回日志对象
	 * @return
	 */
	public abstract FlwDwrRtnLog toBackCommon(String flowid, String insid,
			String nodeid, String cnodeid, String logid, FlwLog flwLog);

	public abstract FlwDwrRtnLog toBackNode(String insid, String nodeid,
			String logid, FlwLog flwLog);

	public abstract boolean finishFlow(String logid) throws SQLException,
			BusinessException;

	public abstract boolean sendFileToOthers(String insid, String logList);

	public abstract boolean finishSendFileLog(String logid);

	public abstract RockUser getFlowActionPerson(String insid);
	/**
	 * 插入日志记录
	 * @param flwlog 新的日志对象
	 * @param logid 当前日志id
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public abstract boolean insertFlwLog(FlwLog flwlog, String logid, HttpServletRequest request)
			throws SQLException, BusinessException;
	/**
	 * 判断路由是否都已经通过审批
	 * @param insid 流程实例id
	 * @param path  路由
	 * @param limitFtime 时间限制
	 */
	public abstract boolean isAllPassByPathAndFtime(String insid, String path, Date limitFtime);
	/**
	 * 实例化状态节点下的普通节点的路由
	 * @param nodeid 状态节点
	 * @param reCreate 是否重新生成，reCreate=true,如果路由链表(Flw_Common_Node_Path_Link)中已经存
	 * 在该状态节点的路由集,则删除，重新生成，反之，有则不生成，没有则生成
	 */
	
	public abstract void initCommonNodePathLink(String nodeid, boolean reCreate);
	/**
	 * 重新发送
	 * @param logid
	 * @param newlog
	 * @return
	 */
	public abstract FlwDwrRtnLog resendFlow(String logid,  FlwLog newlog);
	 /**
	 * 查询经过节点普通节点cnodeid并且位于普通节点cnodeid之前的第一个分裂节点
	 * @param cnodeid 
	 * @return 如果没有查询到则放回 ""
	 */
	public String lastSplitCnodeid(String cnodeid);
	
    /**
     * 跨系统流程处理
     * 流程日志的流转信息数据同步
     * @param insid
     * @param request
     * @return
     * @author: Liuay
     * @createDate: 2011-10-31
     */
    public String flwLogDataExchange(String insid, HttpServletRequest request);
    
    /**
     * 跨系统流程处理
     * 流程日志的流转信息数据同步【删除】
     * @param insid	需要删除的流程实例ID
     * @param toUnitList	需要进行数据同步的单位
     * @param toUnitList
     * @param request
     * @return
     * @author: Liuay
     * @createDate: 2011-11-1
     */
    public String flwLogDataDeleteExchange(String insid, List<SgccIniUnit> toUnitList, HttpServletRequest request);
    
    /**
     * 
    * @Title: isLastSender
    * @Description: 判断当前节点是否是多节点汇总中的最后一个处理的节点
    * @param logid 当前日志ID
    * @param insid  实例ID
    * @param nodeid  当前状态节点
    * @param currentCnodeid  当前普通节点
    * @param nextNodeid  当前节点的下一节点id
    * @return boolean    
    * @throws
    * @author qiupy 2012-9-3
     */
    public boolean isLastSender(String logid, String insid, String nodeid, String currentCnodeid,String nextNodeid);
    
    /**
     * 状态节点退回到上一步的状态节点（不能退回到开始节点）
	 * @param flowid 流程id
	 * @param insid  流程实例id
	 * @param nodeid 当前状态节点id
	 * @param cnodeid 当前普通节点id
	 * @param logid   当前日志id
	 * @param flwLog  退回日志对象
	 * @return
     * @author: zhangh 2013-10-15
     */
    public FlwDwrRtnLog toBackStateNode(String flowid, String insid, String nodeid, String cnodeid, String logid, FlwLog flwLog);

	/**
	 * 找到需要发送短信的流程任务，加入到短信队列，发送短信
	 * @param insid 实例ID
	 * @param logid 当前日志ID
	 * @param logList 日志集(当要发送到多个人时，会有多条记录)
	 * @author pengy 2013-11-15
	 */
    public void sendMsgNow(String insid, String logid, String logListStr);

}