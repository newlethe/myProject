package com.sgepit.pmis.sczb.service;

import com.sgepit.pmis.sczb.hbm.SczbBc;

public interface SczbBcMgmFacade {
	public void insertSczbBc(SczbBc bc);
	
	public boolean exists(SczbBc bc);
}
