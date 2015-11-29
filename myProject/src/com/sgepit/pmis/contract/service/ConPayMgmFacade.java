package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConPay;

/**
 * @ConPayMgmFacade 合同付款 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConPayMgmFacade {
	String insertConpay(ConPay conpay) throws SQLException, BusinessException;
	String updateConpay(ConPay conpay) throws SQLException, BusinessException;
	int percentCheck(String conid);
	public String deleteConpay(String payid,String modId);
	public Object[] getMoneyMessage(String conid);
	public String payPercent(String conid);
	public void updateConove(ConOve conove)throws SQLException,	BusinessException;
	public String AutoPayNo(String username,String userid);
	/**
	 * 
	 * @param insertIds 新增时是否进行数据交互ID
	 * @param updateids 修改时是否进行数据交互ID
	 * @param beanName   新增或修改时进行数据交互的Bean
	 */
	public void addDataChangeToSave(String insertIds,String updateids,String beanName);
	/**
	 * 
	 * @param ids 删除时进行数据交互传入的ID
	 * @param beanName  删除时进行数据交互传入的Bean
	 */
	public void addDataChangeToDel(String ids,String beanName );
	/***
	 * 获取工程量中申请金额
	 * @param conid
	 * @param pid
	 * @return
	 */
	public Double getApplyMoneyFromBdgProject(String conid,String pid);
	/***
	 * 获取付款分摊实际金额
	 * @param conid
	 * @param parent
	  * @param payid
	 * @return
	 */	

	public Double getFactpaymoney(String conid,String parent,String payid);
	/***
	 *获取项目本月合同付款信息与累计合同付款信息
	 * @param sj
	 * @param params
	 * @return
	 */		
	public List findPcBusinessConPay(String sj, String params);

	/**
	 * 保存付款申请单、增值税专用发票收具单
	 * @param uids 合同付款主键payid
	 * @param fieldname 字段名：applyFileid、invoiceFileid
	 * @param fileid 文档id
	 * @param hasfile 是否已经存在文档
	 * @param myFile 文档对象
	 * @return 保存信息
	 * @author pengy 2013-12-03
	 */
	public String saveOrUpdateBlob(String uids, String fieldname, String fileid,
			String hasfile, com.jspsmart.upload.File myFile);

}
