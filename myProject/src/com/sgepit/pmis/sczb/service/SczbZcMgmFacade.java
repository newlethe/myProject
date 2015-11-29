package com.sgepit.pmis.sczb.service;

import java.util.List;

import com.sgepit.pmis.sczb.hbm.SczbZc;

public interface SczbZcMgmFacade {
	public boolean exists(SczbZc zc);
	
	public List<SczbZc> getZcs(String pid);//返回可用的值次列表
}
