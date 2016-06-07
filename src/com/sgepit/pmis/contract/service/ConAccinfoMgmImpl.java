package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConAccinfo;

public class ConAccinfoMgmImpl extends BaseMgmImpl implements ConAccinfoMgmFacade {
	
	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConAccinfoMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConAccinfoMgmImpl) ctx.getBean("conAccinfoMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}
	public ContractDAO getContractDAO() {
		return (ContractDAO)com.sgepit.frame.base.Constant.wact.getBean("contractDAO");
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void insertConAccinfo(ConAccinfo conAccinfo) throws SQLException, BusinessException {
		//this.contractDAO.insert(conAccinfo);
		this.getContractDAO().insert(conAccinfo);
		List dataList = new ArrayList();
		dataList.add(conAccinfo);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExchangeDataList(dataList, Constant.DefaultOrgRootID,"新增或修改合同账目信息");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
	}
	
	public void updateConAccinfo(ConAccinfo conAccinfo) throws SQLException, BusinessException {
		//this.contractDAO.saveOrUpdate(conAccinfo);
		this.getContractDAO().saveOrUpdate(conAccinfo);
		List dataList = new ArrayList();
		dataList.add(conAccinfo);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExchangeDataList(dataList, Constant.DefaultOrgRootID,"新增或修改合同账目信息");
			dataExchangeService.addExchangeListToQueue(ExchangeList);
		}
	}

	@SuppressWarnings("unchecked")
	public void addOrUpdate(List<ConAccinfo> list){
		try {
			for (Iterator iterator = list.iterator(); iterator.hasNext();) {
				ConAccinfo conAccinfo = (ConAccinfo) iterator.next();
				if ("".equals(conAccinfo.getAccid().trim()) || conAccinfo.getAccid() == null){
					this.insertConAccinfo(conAccinfo);
				}else{
					this.updateConAccinfo(conAccinfo);
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (BusinessException e) {
			e.printStackTrace();
		}
	}
	
	@SuppressWarnings("unchecked")
	public void deleteAccinfoBeans(List ids){
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_ACCINFO;
		if (ids.isEmpty()) return;
		List list = new ArrayList();
		for (int i = 0; i < ids.size(); i++){
			String id = (String)ids.get(i);
			//ConAccinfo conAccinfo = (ConAccinfo)this.contractDAO.findById(beanName, id);
			ConAccinfo conAccinfo = (ConAccinfo)this.getContractDAO().findById(beanName, id);
			list.add(conAccinfo);
		}
		this.getContractDAO().deleteAll(list);
		List dataList = new ArrayList();
		dataList.add(list);
		
	}
	
	public List getConAccinfoBeans(String payid) throws SQLException, BusinessException{
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_ACCINFO;
		String strWhere = "payid = '" + payid + "'";
		List list = this.getContractDAO().findByWhere(beanName, strWhere);
		//List list = contractDAO.findByWhere(beanName, strWhere);
		if (list.isEmpty()) return null;
		return list;
	}
}
