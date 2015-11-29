package com.sgepit.pmis.sczb.service;

import java.util.List;

import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbZbsx;

public class SczbZbsxMgmImpl implements SczbZbsxMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}

	public boolean exists(SczbZbsx zbsx) {
		// TODO Auto-generated method stub
		List list = null;
		if ("".equals(zbsx.getUids()) || zbsx.getUids() == null) {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbZbsx",
					" zcName='" + zbsx.getZcName() + "' and orderId="
							+ zbsx.getOrderId() + " and pid='" + zbsx.getPid()
							+ "'");
		} else {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbZbsx",
					" zcName='" + zbsx.getZcName() + "' and orderId="
							+ zbsx.getOrderId() + " and pid='" + zbsx.getPid()
							+ "' and uids!='" + zbsx.getUids() + "'");
		}
		if(list!=null&&list.size()>0){
			return true;
		}
		return false;
	}
}
