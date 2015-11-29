package com.sgepit.pmis.finalAccounts.prjGeneralInfo.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.dao.PrjGeneralInfoDAO;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoOve;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjParams;

public class FAPrjInfoOveServiceImpl implements FAPrjInfoOveService{
	
	private String beanName = BusinessConstants.PRJ_GENERAL_INFO_PKG + BusinessConstants.PRJ_INFO_OVE ;
	
	private PrjGeneralInfoDAO generalInfoDAO;

	public PrjGeneralInfoDAO getGeneralInfoDAO() {
		return generalInfoDAO;
	}

	public void setGeneralInfoDAO(PrjGeneralInfoDAO generalInfoDAO) {
		this.generalInfoDAO = generalInfoDAO;
	}

	public FAPrjInfoOve getPrjInfoOve(String pid) {
		
		Object obj = generalInfoDAO.findById(beanName, pid);
		if ( obj != null ){
			return (FAPrjInfoOve) obj;
		
		}
		else {
			return null;
			
		}
	}

	public void saveOrUpdate(FAPrjInfoOve prjInfoOve) {
		if ( prjInfoOve.getUids() != null ){
			if ( ! prjInfoOve.getUids().equals("") ){
				generalInfoDAO.saveOrUpdate(prjInfoOve);
				return;
			}
		}
		
		//pid为空或pid为""才会执行此语句insert

		generalInfoDAO.insert(prjInfoOve);
		
	}
	
	public void saveOrUpdate(Object[] objects) throws BusinessException {

		for (Object obj : objects) {
			generalInfoDAO.saveOrUpdate(obj);
		}

	}
	
	public void delete(Object[] objects) throws BusinessException{
		for (Object obj : objects) {
			generalInfoDAO.delete(obj);
		}
	}

	public List<FAPrjParams> getPrjParamsByType(String typeId, String pid) {
		String whereStr = "paramType = '%s' and pid='%s'";
		whereStr = String.format(whereStr, typeId, pid);
		return generalInfoDAO.findByWhere(BusinessConstants.PRJ_GENERAL_INFO_PKG + BusinessConstants.PRJ_INFO_PARAMS, whereStr, "paramNo");
		
	}

}
