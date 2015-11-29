package com.sgepit.pmis.budget.service;

import java.sql.SQLException;

import org.apache.commons.fileupload.FileItem;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.budget.hbm.BdgChangeProject;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.budget.hbm.ConProjectBean;

/**
 * @BdgMoneyMgmFacade 合同金额概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface BdgProjectMgmFacade {
	void insertBdgProject(BdgProject bdgProject) throws SQLException, BusinessException;
	void updateBdgProject(BdgProject bdgProject) throws SQLException, BusinessException;
	void deleteBdgProject(BdgProject bdgProject) throws SQLException, BusinessException;
	//删除工程量和合同概算的关联
	public String deleteRelaProject(String proid);
	//更新合同分摊的实际金额，
	public String refreshApp(String appid);
	//关联工程量到合同概算，
	public String relaBdgProject(String proid,String appid);
	//获取合同变更是，概算节点对应的分摊工程量的总值
	public Double getProjectTotalByBgdId(String conid,  String bgdId);
	/**
	 * 
	 * @param prono  工程量编号
	 * @param proname 工程量名称
	 * @param pid    当前项目ID
	 * @return  根据传入的条件 验证工程量编号或工程量名称的唯一性
	 */
	public boolean checkBdgProValid(String prono,String proname,String conid,String pid);
	/**
	 * 新增BdgChangeProject
	 * @param bdgChangeProject
	 */
	public void insertBdgChangeProject(BdgChangeProject bdgChangeProject);
	/**
	 * 修改BdgChangeProject
	 * @param bdgChangeProject
	 */
	public void updateBdgChangeProject(BdgChangeProject bdgChangeProject);
	/**
	 * 删除BdgchangeProject
	 * @param bdgChangeProject
	 */
	public void deleteBdgChangeProject(BdgChangeProject bdgChangeProject);
	/**
	 * 
	 * @param prono 变更工程量编号
	 * @param proname 变更工程量名称
	 * @param changeid 变更编号
	 * @return
	 */
	public String checkBdgChangeProjectOnly(String prono,String changestate,String changeid,String conid,String pid);
	/**
	 * 验证单个合同工程量中数据是否重复
	 * @param prono
	 * @param proname
	 * @param conid
	 * @param pid
	 * @return
	 */
	String checkBdgProjectSameToChangeProject(String prono,String proname,String conid,String pid);
	/**
	 * 验证变更累计工程量金额不超过本次总金额
	 * @param conid
	 * @param chaid
	 * @param pid
	 * @return
	 */
	public String checkChangeProjectMoneyValid(String conid,String chaid,String pid,String appids, String totalMoney);
	/**
	 * 删除变更工程量之间的关联
	 * @param appid
	 */
	public void deleteRelateChangeProject(String appid);
	
	/**
	 * 
	 * @param conid
	 * @param projectId
	 * @param bdgid
	 * @param pid
	 * @return  根据传入参数计算出概算，工程量，合同之间的依赖关系
	 */
	public ConProjectBean summaryConProjectBdgInfo(String conid,String projectId,String bdgid,String pid);
	
	/**
	 * 根据传入条件判断引入的工程量是否已经分摊
	 * @param prono
	 * @param pid
	 * @return
	 */
	public String checkBdgProjectIsUse(String prono,String conid,String pid);
	/**
	 * 根据传入条件关联工程量
	 * @param proid
	 * @param bdgid
	 * @param conid
	 * @author shangtw
	 * @return
	 */
	public String relaBdgNewProject(String proid,String bdgid,String conid);	

	/**
	 * 工程量分摊excel数据导入
	 * @param pid	项目ID
	 * @param conid	合同ID	
	 * @param bdgid	概算ID
	 * @param beanName	实体类
	 * @param fileItem	excel文件
	 * @return
	 * @author pengy 2013-08-21
	 */
	public String importData(String pid,String conid,String bdgid,String beanName,FileItem fileItem);
}
