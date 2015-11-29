package com.sgepit.pcmis.zhxx.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjKeyMan;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo;
import com.sgepit.pcmis.zhxx.hbm.SgccUnitModule;


public interface PCPrjBaseInfoService {
		
	String addOrUpdate(PcZhxxPrjInfo prj);
	String keymanAddOrUpdate(PcZhxxPrjKeyMan keyman);
	String isUnique(String temp)throws SQLException, BusinessException;
	String getUnumber(String temp) throws SQLException, BusinessException;
	/**
	 * 将项目基本信息的变更实时交互到集团或者项目单位。针对 修改 功能
	 */
	void sendPrjInfoToMIS(String pid,String dydaUids);
	/**
	 * MIS定时上报主要人员信息。
	 * @param pid
	 */
	void sendKeymanToJT(String uids,String pid);
	/**
	 * MIS定时上报主要人员信息。针对删除功能的。
	 * @param ids 主键
	 * @param imagesId 图片信息
	 * @param fromunit 发送单位
	 * @param tounit 接收单位
	 * @modify by liangwj at 2011-10-31 (1.判断是否需要数据交互 2.如果需要数据交互需要加入发送单位)
	 */
	void sendKeymanToJTDEL(String ids, String imagesId, String fromunit,String tounit);
	/**
	 * 数据交互（项目单位->集团），项目主要合作单位新增或编辑
	 * @param idsOfInsert 新增记录id
	 * @param idsOfUpdate 修改记录id
	 * @param fromunit 发送 单位
	 * @param tounit   接收单位
	 * @author liangwj
	 * @since 2011-10-31
	 */
	public abstract String sendCoUnitToJT(String idsOfInsert, String idsOfUpdate,String fromunit,String tounit);
	/**
	 * 数据交互（项目单位->集团），项目主要合作单位删除
	 * @param ids 删除的记录id
	 * @param fromunit 发送单位
	 * @param tounit  接收单位
	 * @return
	 * @author liangwj
	 * @since 2011-10-31
	 */
	public abstract String sendCoUnitToJTDEL(String ids, String fromunit, String tounit);
	/**
	 * MIS定时上报资金来源表中数据的变更。
	 * @param idsOfInsert
	 * @param idsOfUpdate
	 * @param pid
	 */
	void sendFundsrcToJT(String idsOfInsert, String idsOfUpdate,String pid);
	/**
	 *  MIS定时上报资金来源表中数据的变更。针对删除功能。
	 * @param ids
	 * @param pid
	 */
	void sendFundsrcToJTDEL(String ids, String pid);
	/**
	 * 文件删除的数据交换。定时
	 * @param fidArr
	 * @param pid
	 */
	void fileDeleteDataEx(String[] fidArr,String pid);
	/**
	 * 文件上传的数据交换。定时
	 * @param fileLsh
	 * @param businessId
	 * @param businessType
	 * @param blobTable
	 * @param pid
	 */
	void fileUploadDataEx(String fileLsh, String businessId, String businessType, String blobTable,String pid);
	/**
	 * 校验图片文件是否存在，根据PcZhxxPrjKeyMan中的image属性值，查询表app_blob，判断是否存在大对象，如果不存在，则更新PcZhxxPrjKeyMan，将image的值置空
	 * @param keyman
	 * @return
	 */
	public abstract  void validateImage(PcZhxxPrjKeyMan keyman);
	/**
	 * 根据传入的PId 查找工程进度开工项目数、进度百分比
	 * @param pid
	 * @return 返回值key约束projectNum、propercentage
	 */
	Map<String,String> getQuaProjectSheduleByPid(String pid);
	/**
	 * 根据传入的Pid查找计算出人身安全事故数，设备安全事故数，其他事故
	 * @param pid
	 * @return 返回值key约束rsAcc,sbAcc,otherAcc
	 */
   Map<String,String> getAqgkProjectSheduleByPid(String pid);
   /**
    * 根据前台传入PId 查找解析相关数据并返回到页面端做处理
    * @param pid
    * @return 
    */
   Map<String,String>  getAllProjectSheduleByPid(String pid,String totalMoney);
   /**
    * 项目单位上班本单位的组织机构到集团公司
    * @param pid  项目单位编码
    * @param acceptUnitId 集团公司单位编码
    * @return
    */
   public abstract String reportUnitData(String pid, String acceptUnitId);
   /**
    * 检查一个项目中所有资金来源的总和是不是与项目中的投资规模相等，
    * @param pid
    * @return 资金来源的总和减去项目中的投资规模
    */
   public int checkFundsrcEqual(String pid);
   /**
    * @param fileName flex配置文件信息JSON串，如[{bizname:'产业分布图',type:'zhxx'},{bizname:'合同信息图',type:'conove'}]
    * @param matched  文件名称是否匹配，如果为false则不匹配，例如filename=zhxx， matched = ture 则会匹配文件zhxx.cml、zhxx-debug.cml。
    *                 如果matched=false ，则只列出zhxx.cml
    * @return
    */
   public List<JSONObject> getCmlFileList(String fileNames, boolean matched);
   /**
    * 保存配置文件
    * @param xmlStr
    * @param fileName
    * @return
    */
   public boolean saveCmlFile(String xmlStr, String fileName);
   /**
    * 启用配置文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean activeCml(String fileName, String type);
   /**
    * 备份配置文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean backupCml(String fileName, String type);
   /**
    * 删除备份的文件
    * @param fileName
    * @param type
    * @return
    */
   public boolean deleteCml(String fileName, String type);
   
   public List welcomePage(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params);
   
   public List prjCountIndex(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params);
   
   //项目前期维护的新增和修改功能
   public String addOrUpdatePre(PcZhxxQianqPrjInfo prj);
   
   /**
    * 根据单位编号找到该单位下属所有项目单位(包括前期项目维护中的项目),返回一个项目单位编号
    * @param unitid
    * @return
    * @throws SQLException
    * @throws BusinessException
    */
   public String checkPidBeUsed(String pid) throws SQLException, BusinessException;
   
   
   /**
    * 自动获取前期项目编号
    * @param temp
    * @return
    * @throws SQLException
    * @throws BusinessException
    */
   public String getPreUnumber(String temp) throws SQLException, BusinessException;
   /**
    * 将一个前期项目转化为正式项目
    * @param uids  前期项目主键值
    * 
    * @return String   转换是否成功标志
    */
   public String prjSwitch(String uids, String newPid, String prjStage, String upUnitid) throws SQLException, BusinessException;
   
   /**
	 * 添加或修改项目单位所不需要显示的模块
	 * 
	 * @param sum
	 * @param unid
	 * @return
	 */
   public String addOrUpdateSgccUnitModule(SgccUnitModule [] sums,String unid) throws SQLException, BusinessException;
  /**
   * 根据项目单位id查询该单位不需要显示的模块
   * @param bean beanName
   * @param propertyName   unitid
   * @param unitid  项目单位id
   * @return
   */
   public List getSgccUnitModuleByUnitid(String bean,String propertyName,String unitid);
   /**
    * 根据模块id查询该模块不需要显示的项目单位名称
    * @param bean
    * @param propertyName
    * @param moduleid
    * @return
    */
   public List getSgccUnitModuleByModuleid(String bean,String propertyName,String moduleid);

   
   /**
    * 新兴能源公司首页在建项目统计取数
    * @param pid
    * @return
    * @author zhangh 2012-06-06
    */
   public List getProIndexData(String pid,String sjType);
   
   /**
    * 基建项目概况首页取数
    * @param pid
    * @return
    * @author zhangh 2012-06-06
    */
   public List getProItemIndexData(String pid);
   
	/**
	 * 查询地图和项目单位信息
	 * @return
	 * @author zhangh 2012-06-11
	 */
	public String getMapUnitInfo(String pid) throws Exception ;
	
	
	/**
	 * 获取里程碑节点，风电火电分别获取初始化的14个和7个。其他获取根节点下第一层节点
	 * @param pid
	 * @return
	 * @author zhangh 2012-06-19
	 */
	public String getLiChengBeiByType(String pid);
	
	/**
	 * 新增，修改组织机构信息后添加到动态数据，并做数据交互
	 * @param pid
	 * @param idsOfAll
	 * @param toUnit
	 * @param fromUnit
	 * @return
	 */
	public String addDydaAfterSaveOrUpdateSgcc(String pid, String[] idsOfAll, String toUnit, String fromUnit);
	/**
	 * 上月数据完整性考核分数
	 * @param unitid
	 * @return
	 */
	public String getLastMonthNum(String unitid);
	/**
	 * 上月数据完整性考核分数
	 * @param unitid
	 * @return
	 */	
	public String getLastMonthNums(String[] pids);
	/**
	 * 
	* @Title: initBaseInfoD
	* @Description: 初始化项目基本情况
	* @param pid
	* @param idsOfInsert   
	* @return void    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public void initBaseInfoD(String pid,String idsOfInsert);
	/**
	 * 
	* @Title: deleteBaseInfoD
	* @Description: 删除项目基本情况明细
	* @param masterId
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String deleteBaseInfoD(String masterId,String pid);
	/**
	 * 
	* @Title: doProBaseInfoExchangeDataToQueue
	* @Description: 上报项目基本情况表
	* @param uids
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-16
	 */
	public String doProBaseInfoExchangeDataToQueue(String uids,String pid);
}






