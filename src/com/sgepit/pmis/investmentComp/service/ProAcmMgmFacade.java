
package com.sgepit.pmis.investmentComp.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.investmentComp.hbm.ProAcmInfo;
import com.sgepit.pmis.investmentComp.hbm.ProAcmMonth;
import com.sgepit.pmis.investmentComp.hbm.ProAcmTree;



public interface ProAcmMgmFacade {
	
   void insertProAcm(ProAcmInfo proAcmInfo)throws SQLException, BusinessException;
   void updateProAcm(ProAcmInfo proAcmInfo)throws SQLException, BusinessException;
   void delProAcm(ProAcmInfo proAcmInfo)throws SQLException, BusinessException;
   
   public List<ColumnTreeNode> proAcmTree(String parentId, String conid, String  monId) throws BusinessException;
   public int UpdateTree(String[] bdgids, String monId, String conid);
   /**
	 * 获得当月累计完成金额
	 * @param conid
	 * @param monId
	 * @return
	 */
	public Double getMoney(String monId, String type);
	/**
	   * 通过一个工程量查找对应的概算项
	   * @param bdgid
	   * @param monId
	   * @return
	*/
   public String getPath(String bdgid, String monId);

   /**
	 * 累计完成金额
	 * @param conid
	 * @param monId
	 * @return
	 */
	public Double getSumMoney(String conid, String monId, String bdgid);
	/**
	 * 获得累计工程量
	 * @param conid
	 * @param monId
	 * @param bdgid
	 * @return
	 */
	public Double getTotalpro(String conid, String monId, String proid);
	/**
	 * 判断下个月是否已经有投资完成记录
	 * @param uids
	 * @return
	 */
	public List hasNextMonth(String uids, String conid);
	/**
	 * 初始化工程工资完成-Info 信息
	 * @param conid
	 * @param monId
	 * @param pid	项目编号
	 */
	public void initialProAcmInfo(String conid, String monId, String pid);
	/**
	 * 初始化工程量投资完成每月的树
	 * @param conid
	 * @param monId
	 * @param pid	项目编号
	 */
	public void initialProAcmTree(String conid, String monId, String pid);
	// 当下个月已经投资完成了,但是还修改本月的时候, 修改这个月以后的工程量累计量(左边grid pro_acm_Info)
	public void laterMonthInfo(String monId, String conid,  String[] proIds, Double[] difference );
	// 当下个月已经投资完成了,但是还修改本月的时候, 修改这个月以后的投资完成累计量(树)
	public void laterMonthTree(List listMonth, String bdgid, Double difference );
	/**
	 * 累计该概算项的当月完成金额
	 * @param monId
	 * @param bdgid
	 * @return
	 */
	public Double sumBdgMoney(String monId, String bdgid);
	/**
	 * 累计当月完成金额
	 * @param parentId
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void sumMoneyHandler(ProAcmTree pat) throws SQLException, BusinessException;

	/**
	 * 获取可以新增的数据期别
	 * @param conId          合同ID
	 * @return
	 */
	public String getSjTypeForComp(String conId);
	
	/**
	 * 删除工程量投资完成主表，同时删除从表和概算树
	 * @param pam
	 * @return
	 * @author zhangh
	 */
	public String delProAcmMonth(ProAcmMonth pam);
	
	public List getProAcmTree(String orderBy, Integer start, Integer limit, HashMap map);
	
	public void updateProAcmMonth(String monId);
	
	/**
	 * 工程量投资完成： 根据pro_acm_info表中的数据，更新pro_acm_tree表；
	 * @param monId
	 * @author: Liuay
	 * @createDate: 2012-2-28
	 */
	public void updateProAcmTree(String monId);
	
	/**
	 * 工程量投资完成数据交互
	 * @param uids
	 * @param toPid
	 * @param fromPid
	 * @param initial 是否执行工程量完成的初始化，添加前置删除SQL，1：执行 0：不执行
	 * @return
	 * @author: zhangh
	 * @createDate: 2012-03-15
	 */
	public String proAcmDataExchange(String uids, String toPid, String fromPid, String initial);
	
//	public String getOtherReportXml(String monId,String conid,String pid,String bdgid);
	
	/**
	 * 工程量从bdg_project中选择相关项后新增到pro_acm_info
	 * @param proappid
	 * @param conid
	 * @param monId
	 * @param pid
	 * 
	 */
	public void initialNewProAcmInfo(String proappid,String conid,String monId,String pid );

	/**
	 * 优化报表打开时间，直接将报表数据存储到表
	 * @param masterId 投资完成主表主键
	 * @param pid 项目id
	 * @author pengy
	 * @createtime 2014-02-27
	 */
	public void saveProAcmTreeToTable(String masterId, String pid);

}