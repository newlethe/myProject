package com.sgepit.pmis.sczb.service;

import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbZbjl;

public class SczbZbjlMgmImpl implements SczbZbjlMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}
	
	public void saveOrUpdate(SczbZbjl zbjl) {
		// TODO Auto-generated method stub
		if("".equals(zbjl.getUids())||(zbjl.getUids()==null)){
			sczbBcDao.insert(zbjl);
		}else{
			sczbBcDao.saveOrUpdate(zbjl);
		}
		
		
		
	}

}
