package com.sgepit.pmis.sczb.service;

import java.util.List;

import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbBc;

public class SczbBcMgmImpl implements SczbBcMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}

	public void insertSczbBc(SczbBc bc) {
		// TODO Auto-generated method stub
		sczbBcDao.saveOrUpdate(bc);
	}

	// 查询数据库中是否已经存在该条记录
	public boolean exists(SczbBc bc) {
		// TODO Auto-generated method stub
		List list = null;
		if ("".equals(bc.getUIDS())) {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbBc",
					" bcName='" + bc.getBcName() + "' and PID='" + bc.getPID()+"'");
		} else {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbBc",
					" bcName='" + bc.getBcName() + "' and PID='" + bc.getPID()+"' and uids!='"+bc.getUIDS()+"'");
		}

		if (list != null && list.size() > 0) {
			return true;
		}
		return false;
	}

}
