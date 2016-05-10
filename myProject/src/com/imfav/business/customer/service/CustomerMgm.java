package com.imfav.business.customer.service;

import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.imfav.business.customer.hbm.Customer;

/**
 * 类说明
 * 
 * @author zhangh
 * @version 创建时间：2015年12月5日 下午11:19:43
 */
public interface CustomerMgm {

	/**
	 * 添加或编辑客户信息
	 * 
	 * @param customer
	 * @return
	 */
	public String addOrUpdateCustomer(Customer customer);

	/**
	 * 删除客户信息
	 * 
	 * @param uids
	 * @return 0：删除异常，1：删除成功，2：客户有股票交易信息，不能删除
	 */
	public String deleteCustomer(String uids);

	/**
	 * 客户定金已回操作，操作成功后，同步在回款记录中生成一条与定金金额相同的数据
	 * 
	 * @param uids
	 * @return
	 */
	public String customerHasDeposit(String uids);

	/**
	 * 根据手机号查询所在地
	 * 
	 * @param mobile
	 * @return
	 */
	public String getMobileFrom(String mobile);

	
	public List findBusinessStatistics(String beanName, String where, String orderBy,
			Integer firstRow, Integer maxRow, String isManager, String between);
	
	
	/**
	 * 前台根据传递的表头和查询条件导出excel
	 * @param header
	 * @param where
	 * @return
	 */
	public HSSFWorkbook exportExcelByHeaderAndWhere(String header, String where);
}
