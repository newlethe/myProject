package com.sgepit.pcmis.zlgk.service;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypRecord;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypReport;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree;


@SuppressWarnings("unchecked")
public interface PCZlgkService {
		
	
	public List getLastedReportName(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException;
	
	public List getSjtype(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException;
	//获得最新监理报告名称,一次返回所有的项目最新的监理报告名称
//	public List<PcZlgkSuperreportInfo> getLatestReportName(String[] pids);
	
	public boolean initZlgkGczlJyxm(String[] uidsArr,String sj,String uids,String pid);
	public String getSjTypeForZlgk(String pid);
	public String getLjhgsAndLjbhgs(String pid,String uid,String sj);
	public void updateLjhgsAndLjbhgs(String pid,String sj,String lx);
	public boolean deletePcZlgkQuaInfoById(String uids);
	public String getLjhgl(String pid,String sj);
	public String getByhgl(String pid,String sj);
	/**
	 * 根据传入的Pid计算出质量验评项目数，占比，及优良率
	 * @param pid
	 * @return 返回值key约束定义assNum、percentage、goodRage
	 */
	Map<String,String>getProjectSheduleByPid(String pid);
	
	public String submitSuperReport(String unitid, String uids);
	
	public String pcZlgkExchangeDataToQueue(String uids, String pid,String reportMan,String unitname);
	
	/**
	 * 删除  
	 * 		在记录中，同期别的数据，相应的检验项目不用的类型有4条数据，对于少于4条的检验项目，是在xgrid中做了删除，同时删除其他类型的项目；
	 * @param pid
	 * @param sjType
	 * @author: Liuay
	 * @createDate: 2011-12-9
	 */
	public void delDwgcFromQuaDetail(String pid, String sjType);
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,long state);
	public String assessmentReportTojt(String uids, String sendPerson,String unitname);
	/**
	 *累计验评定优良率--累计验评定合格率
	 * @param pid 
	 * @param sj
	 * @createDate 2011-08-02
	 * @author shangtw
	 */	
	public List getNewLastedReportName(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException;
    /**
     * 质量验评分类树维护
     * @param orderBy
     * @param start
     * @param limit
     * @author yanglh
     * @param map
     * @return
     * @date 2013-6-3
     */
    public List<ColumnTreeNode> pcZlgkZlypTree(String orderBy,
					Integer start, Integer limit, HashMap map);
    /**
     * 初始化质量验评分类维护树
     * @param pid(根据项目单位PID生成相关的树结构)
     * @return
     * @author yanglh
     * @date 2013-6-3
     */
    public List<PcZlgkZlypTree> originalPcZlgkZlypTree(String pid);
    /**
     * 新增或者修改质量验评分类树
     * @param zlypTree
     * @return
     * @author yanglh
     * @date 2013-6-17
     */
    public String zlypAddOrUpdate(PcZlgkZlypTree  zlypTree);
    /**
     * 删除选择记录的质量验评分类树信息
     * @param uuid
     * @param pid
     * @param parentid
     * @return
     * @author yanglh
     * @date 2013-6-18
     */
    public String zlypDeleteDate(String uuid,String pid,String parentid,String engineerNo);
    
	/**
	 * 构造质量验评标准分类树
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
     * @author yanglh
	 * @date 2013-6-21
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
    /**
     * 质量验评记录管理新增或者修改
     * @param zlyprecord
     * @param getFielId
     * @return
     * @author yanglh
	 * @date 2013-6-21
     */
	public String zlgkZlypRecordAddOrUpdate(PcZlgkZlypRecord zlyprecord,String getFielId);
	/**
	 * 点击上传附件是，删除以前的旧附件，可通用
	 * @param fileId  sgcc_attach_list相关的模块ID
	 * @param getFielId app_blob与APP_FILEINFO中的主键
     * @author yanglh
	 * @date 2013-6-21
	 */
	public void delAppFileinfoAndAppBlob(String fileId,String getFielId);
	/**
	 * 对上报数据进行新增
	 * @param obj
	 * @return
     * @author yanglh
	 * @date 2013-6-24
	 */
	public String addPcZlgkZlypReport(PcZlgkZlypReport obj );
	/**
	 * 获取质量验评附件移交信息
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrName
	 * @return
	 * @author yanglh 2013-6-25
	 */	
	public String getJsonStrForTransToZlgkZlyp(String type, String fileId,
			String fileTypes, String yjrName, String uuid);
	/**
	 * 质量验评附件移交
	 * @param pid
	 * @param userdeptid
	 * @param username
	 * @param type
	 * @param fileLshs
	 * @param fileNames
	 * @param fileIds
	 * @param zlSortId
	 * @param flag
	 * @author yanglh 2013-6-25
	 */
	public boolean pcZlgkZlypTransToZLSByType(String pid, String userdeptid,
									String username, String type, String fileLshs, String fileNames,
									String fileIds, String zlSortId,boolean flag);
	/**
	 * 质量验评附件移交撤回
	 * @param filelsh
	 * @param fileIds
	 * @author yanglh 2012-6-26
	 */
	public boolean cancelPcZlgkTrans(String filelsh);
	/**
	 * 初始化根节点时或保存时设置权限
	 * @param uuid
	 * @param depId
	 * @param pid
	 * @return
	 */
	public String addPcZlgkRightSortDept(String uuid,String depId,String pid);
	/**
	 * 从指定根节点开始获取节点权限树
	 * 
	 * @param nodeId
	 * @param rootId
	 * @return
	 */
	public List getComFileSortRightTree(String nodeId, String rootId,String fileStorId, Boolean excludeDept);

	/**
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAlone(String nodeId,String deptId,String rightType,String rightValue,
			             String selectNode,String PID,String gerIsLeaf);
	
	/**
	 * 根据父节点查找以该父节点为根节点的所有节点，构成树结构
	 * @param parentId  父节点ID
	 * @param deptIds   访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return Map List，map的key 与实体的属性对应
	 */
	public List<Map> getComFileSortTreeByParentId(String parentId,String deptIds,String selectNode,
			        String PID,String gerIsLeaf);	
	/**
	 * 设置节点权限
	 * @param nodeId  节点ID
	 * @param rightStr  格式示例：部门ID1`权限类型1|部门ID2`权限类型2|部门ID3`权限类型3|部门ID4`权限类型4
	 * @return
	 */
	public boolean setComFileSortNodeRight(String nodeId,String rightStr);
	
	/**@param权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAll(String nodeId,String deptId,String rightType,String rightValue,
			   String selectNode,String PID,String gerIsLeaf);
	/**
	 * 质量验评统计
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> pcZlgkZlypStatisticsTree(String orderBy,
			                           Integer start, Integer limit, HashMap map);
	
	public InputStream getExcelTemplate(String businessType);
    /**
     * 数据的导出通过拼接方式导出数据
     * @param pid
     * @param startTime
     * @param endTime
     * @param unitSTr
     * @param billstateStr
     * @author yanglh 2013-07-18
     */
	public HSSFWorkbook exportExcelByQuerySql(String pid, String startTime,
			String endTime, String unitSTr, String billstateStr);	
	
	/**
	 * 执行招标申请信息上报的数据交互
	 * @param uids
	 * @param pid
	 * @return
	 */
	public String pcZbsqxxExchangeDataToQueue(String uids, String pid,String reportMan,String unitname);
	/**
	 * 招标申请信息审核
	 */
	public String updateZbsqState(String uids,String backUser,String unitname,String reason,String fromUnit,long state);
}
