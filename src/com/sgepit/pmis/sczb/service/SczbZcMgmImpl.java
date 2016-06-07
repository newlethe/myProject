package com.sgepit.pmis.sczb.service;

import java.util.List;

import com.sgepit.pmis.sczb.dao.SczbBcDAO;
import com.sgepit.pmis.sczb.hbm.SczbZc;

public class SczbZcMgmImpl implements SczbZcMgmFacade {
	private SczbBcDAO sczbBcDao;

	public SczbBcDAO getSczbBcDao() {
		return sczbBcDao;
	}

	public void setSczbBcDao(SczbBcDAO sczbBcDao) {
		this.sczbBcDao = sczbBcDao;
	}

	public boolean exists(SczbZc zc) {
		// TODO Auto-generated method stub

		List list = null;
		if ("".equals(zc.getUids())) {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbZc",
					" zcName='" + zc.getZcName() + "' and pid='" + zc.getPid()
							+ "'");
		} else {
			list = sczbBcDao.findByWhere("com.sgepit.pmis.sczb.hbm.SczbZc",
					" zcName='" + zc.getZcName() + "' and pid='" + zc.getPid()
							+ "' and uids!='" + zc.getUids() + "'");
		}

		if (list != null && list.size() > 0) {
			return true;
		}

		return false;
	}

	public List<SczbZc> getZcs(String pid) {
		// TODO Auto-generated method stub
		List<SczbZc> list = sczbBcDao.findWhereOrderBy(
				"com.sgepit.pmis.sczb.hbm.SczbZc", "pid='" + pid
						+ "' and ifUse='0'", "orders");
		if(list !=null&&list.size()>0){
			return list;
		}
		return null;
	}

}
