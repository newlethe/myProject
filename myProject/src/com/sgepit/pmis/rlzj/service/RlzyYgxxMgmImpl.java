package com.sgepit.pmis.rlzj.service;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SystemDao;

public class RlzyYgxxMgmImpl extends BaseMgmImpl implements RlzyYgxxMgmFacade {
	private SystemDao systemDao;

	public SystemDao getSystemDao() {
		return systemDao;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}
}
