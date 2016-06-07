package com.sgepit.pmis.contract.service;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.pmis.contract.hbm.ConOve;

/**
 * @ContractMgmFacade 合同管理业务逻辑接口
 * @author Lifan
 */
public interface ConOveMgmFacade {
	
	String insertConove(ConOve conove) throws SQLException, BusinessException;
	String updateConove(ConOve conove) throws SQLException, BusinessException;
	String deleteConove(String conid,String modId);
	public String getRealName(String userName);
	/*
	 * 获取概算金额和工程量分摊总金额不相等的合同和概算项
	 */
	public List getUnequalbdg(String pid);
	/*
	 * 获取签订金额和概算金额不相等的合同
	 */
	public List getUnequalcon(String pid);
	public boolean isApportion(String conid);
	/**
	 * @description 合同移交
	 * @param conid
	 * @param username
	 * @return
	 */
	public String removeConove(String conid, String username);
	public boolean isEquInfo(String conid);
	public boolean checkConno(String conno);
	public List<PropertyCode> getContractSortByDept(String deptId);
	
	//zhangh 2010-10-19 查询出物资管理中的采购合同 
	//felei1: = USERDEPTID ，filterFlag:分类二中对应的CG
	public List<PropertyCode> getCgContractSort(String felei1,String filterFlag);
	public List<ConOve> getCgHt(String felei1,String filterFlag,String where);
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: zhangh
	 * @createDate: 2011-4-7
	 */
	public InputStream getExcelTemplate(String businessType);
	
	/**
	 * 生成合同自动编码规则；
	 * @param temp
	 * @return
	 * @author: shangtw
	 * @createDate: 2011-9-15
	 */
	public String generateConno(String temp) throws SQLException, BusinessException;
	
	/**
	 * 根据当前登陆用户权限判断合同首页中付款、变更、索赔、违约、结算、附近按钮的显示状态
	 * @param userAccount 当前登陆用户帐号
	 * @return Map<K, V> K:按钮对应的模块名称；V:是否隐藏按钮，false不隐藏，true隐藏
	 * @author zhangh
	 * @since 2011-12-26
	 */
	public Map<String, String> getConRockPowerRole(String userAccount);
	
	/**
	 * 查询本月新签订合同与累计签订合同；
	 * @param sj
	 * @param type
	 * @param pid
	 * @param params
	 * @param start
	 * @param limit
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-3-6
	 */	
	public List findPcBusinessCon(String sj,String type,String pid,String params,Integer start,Integer limit);
	
	
	/**
	 * 合同附件信息同步，向集团同步遗漏数据
	 * @param pid
	 * @return
	 * @author zhangh 2013-03-27
	 */
	public String conOveFileDataExchange(String pid);
	
	/**
	 * 项目单位历史数据进行数据交互到集团，存入交互队列自动交互
	 * @param type
	 * @param pid
	 * @return
	 */
	public String doHistoryDataExchange(String type,String pid);
	public abstract List buildTree(String paramString1, String paramString2, Map paramMap);
}
