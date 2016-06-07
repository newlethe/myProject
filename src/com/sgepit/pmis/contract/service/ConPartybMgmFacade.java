package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.contract.hbm.ConPartyb;

/**
 * @ConPartybMgmFacade 合同乙方单位 - 业务逻辑接口
 * @author Xiaosa
 */
public interface ConPartybMgmFacade {
	void insertConPartyb(ConPartyb conPartyb) throws SQLException, BusinessException;
	void updateConPartyb(ConPartyb conPartyb) throws SQLException, BusinessException;

	/**
	 * 获得合同对应乙方单位信息
	 * @param conModel
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	List getPartyB() throws SQLException, BusinessException;
	
	public ConPartyb getPartyBBean(String cpid) throws SQLException, BusinessException;
	public String getPartyBNo();
	public String getyfdwmc(String cpid);
	public boolean checkPartyb(String partybno, String partyb, String cpid);
	/**
	 * 立即发送新增的乙方单位
	 * @param insertIds
	 * @param updateids
	 * @param beanName
	 */
	public void immediatelySendPartybSave(String insertIds,String updateids,String beanName);
	/**
	 * 立即发送删除的乙方单位
	 * @param ids
	 * @param beanName
	 */
	public void immediatelySendPartybDel(String ids,String beanName);
	
}
