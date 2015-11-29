package com.sgepit.pcmis.jdgk.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkMonthTaskList;
import com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWorkList;

public interface PCJdgkMgmFacade {

	public List getProjectInfo(String orderBy, Integer start, Integer limit,
			HashMap<String, String> params);
 
	public String isHaveProjectPlan(String pid, String plan);
	
	/**
	 * 根据传入的PId 查找工程进度百分比（取一级网络计划进度完成百分比）
	 * @param pid
	 * @return 返回值key约束projectNum、propercentage
	 */
	Map<String,String> getQuaProjectSheduleByPid(String pid);
	
	/**
	 * 执行数据交互
	 * @param projectJosn 进度表gantt图的json串
	 * @param projectUid 进度项目的主键，表edo_project中主键字段uid
	 */
	public boolean pcJdgkExchangeDataToQueue(String projectJosn, String projectUid, String pid);
	
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,String parentId, Map params)throws BusinessException;
	
	//进度管控数据交互 项目单位到集团二级公司
	public String submitReport(String uids, String toUnit, String fromUnit, String opUser);
	/**
	 * @param unitid 单位编号
	 * @param sjType 进度期别
	 */
	public void deleteRate(String unitid, String sjType);
	/**
	 * 进度月报退回
	 * @param uids
	 * @param reason
	 * @param backUser
	 * @param backUnitId
	 * @return
	 */
	public String sendBackJdgkReport(String uids,String reason,String backUser,String backUnitId);
	
	/**
	 * 构造XXX项目XXX月进度任务分析列表树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @author zhangh 2014-03-06
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	public List<ColumnTreeNode> getPcJdgkMonthTaskList(String orderBy,
			Integer start, Integer limit, HashMap map);
	
	/**
	 * 针对新增的月度任务进行明细初始化
	 * @param pid
	 * @param insertUids
	 * @author zhangh 2014-03-06
	 */
	public void initMonthTaskList(String pid, String pname, String idsOfInsert);
	
	/**
	 * 月度任务进行明细
	 * @param masterid 主记录主键，可通过主记录主键删除全部明细
	 * @param taskuids 单个明细主键
	 * @return
	 * @author zhangh 2014-03-07
	 */
	public String deleteMonthTaskList(String masterid,String taskuids);
	
	/**
	 * 从一级网络计划中选择任务
	 * @param ppks 所选的一级网络计划pid
	 * @param uids 月度任务计划明细主键
	 * @param sjType 时间期别
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveEdoTaskToMonthTask(String ppks, String uids,String sjType);
	
	/**
	 * 保存一级网络计划时实际时间
	 * @param taskList
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveTaskListRealTime(PcJdgkMonthTaskList taskList);
	
	/**
	 * 保存任务
	 * @param taskList
	 * @return
	 * @author zhangh 2014-3-8
	 */
	public String saveTaskList(PcJdgkMonthTaskList taskList);
	
	/**
	 * 新增时获取新的节点编号
	 * @param pid PID
	 * @param prefix 编号前缀
	 * @param col 列名称
	 * @param table 表名称
	 * @param lsh 最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2014-3-8
	 */
	@SuppressWarnings("unchecked")
	public String getNewTreeid(String pid, String prefix, String col,
			String table, Long lsh);
	
	public void initWeekWorkList(String pid, String pname, String idsOfInsert);
	public String deleteWeekWorkList(String masterid,String taskuids);
	public List<ColumnTreeNode> getPcJdgkWeekWorkListTree(String orderBy,
			Integer start, Integer limit, HashMap map);
	public String saveWeekWorkList(PcJdgkWeekWorkList taskList);
	/**
	 * 
	* @Title: pcWeekWorkExchangeDataToQueue
	* @Description: 执行周工作计划上报操作
	* @param uids
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String pcWeekWorkExchangeDataToQueue(String uids,String pid);
	/**
	 * 数据交互：项目单位向上级公司提交香梅月度任务分析
	 * @param unitid String 集团二级公司,集团三级公司或者集团公司编号
	 * @Param uids 某条监理报告唯一标识
	 * @return String 标识数据交互业务是否成功 
	 * @author shuz
	 * 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String pcJdgkMonthExchangeDataToQueue(String unitid, String uids);
	
	/**根据项目id和当前时间获取该项目下的任务集合
	 * @param projectuid 一级网络计划的uid
	 * @param sjType 时间
	 * @return   返回的是任务的id集合
	 * @throws Exception
	 */
	public List<Map<String,String>> getEdoTasks(String projectuid,String sjType) throws Exception;
	
	/**获取下月的项目计划节点
	 * @param projectuid 一级网络计划的uid
	 * @param sjType 时间
	 * @return
	 * @throws Exception
	 * 说明：“下月一级网络计划完成情况”取本项目一级网络计划中计划开始时间在下月之前（含下月）但实际完成进度不为100%的项目节点
	 */
	public List<Map<String,String>> getNextMonthTasks(String projectuid,String sjType) throws Exception;
	
	/**把list集合的uids转换为字符串
	 * @param list
	 * @return
	 * @throws Exception
	 */
	public String getUids2Str(List<Map<String,String>> list) throws Exception;
	
	/**根据项目id按树形结构查询该项目下的任务集合
	 * @param projectId 项目id
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,String>> getEdoTasksByTree(String projectId) throws Exception;
	
	/**合并任务id
	 * @param totalList
	 * @param uidsList
	 * @return
	 */
	public String mergeEdoTaskIds(List<Map<String,String>> totalList, List<Map<String,String>> uidsList);
}
