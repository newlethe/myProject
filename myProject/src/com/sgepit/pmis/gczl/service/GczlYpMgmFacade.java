package com.sgepit.pmis.gczl.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.naming.NamingException;

import org.jdom.JDOMException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.gczl.hbm.GczlJyStat;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApproval;

/**
 * 工程质量验评Service
 * 
 * @author Yinzf
 * 
 */
public interface GczlYpMgmFacade {

	/**
	 * 返回单位下拉列表字符串
	 * 
	 * @return
	 */
	String getUnitArrStr();

	/**
	 * 返回日期下拉列表字符串（年月）
	 * @return
	 */
	String getYearMonthArrStr();
	
	Boolean checkSjTypeAvailable(String sjType, String deptId);

	/**
	 * 保存工程质量统计主表
	 * @param jyStats
	 * @throws BusinessException
	 */
	void saveOrUpdate(GczlJyStat[] jyStats) throws BusinessException;
	
	/**
	 * 获得工程质量统计报表xml(dhtmlxGrid使用)
	 * @param jyStatId 主表id
	 * @return
	 */
	String getGczlYpDetailXml(String jyStatId);
	
	/**
	 * 更新质量验评统计报表数据
	 * @param statId
	 * @param dataXML
	 * @throws JDOMException
	 * @throws IOException
	 * @throws NamingException
	 * @throws SQLException
	 */
	void updateYpStatDetailData(String statId,String dataXML) throws JDOMException, IOException, NamingException, SQLException;

	/**
	 * 获得单位工程树
	 * @param statId
	 * @param parentId
	 * @return
	 */
	List<ColumnTreeNode> getSelectDwPrjTree(String statId, String parentId);
	
	/**
	 * 为报表增加单位工程项目
	 * @param jyxmBhs 项目编号数组
	 * @param statId 主表id
	 */
	void addNodesToZlypStat(String[] jyxmBhs, String statId);
	
	/**
	 * 删除质量验评统计记录，同时删除对应的报表
	 * @param statId
	 * @throws BusinessException
	 */
	void deleteZlypStat(String statId) throws BusinessException;
	
	String getSjTypeForDept(String deptId);
	
	String getNewGczlStatUids(String userId, String deptId);
	/**
	 * 验评记录管理
	 * @param pid
	 * @param xmbh
	 * @param start
	 * @param limit
	 * @param where
	 * @author shangtw
	 */
	List getGczlApproval(String pid, String xmbh,Integer start,Integer limit,String where);
}
