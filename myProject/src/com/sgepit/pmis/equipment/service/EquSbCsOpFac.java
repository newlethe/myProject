package com.sgepit.pmis.equipment.service;

import com.sgepit.pmis.equipment.hbm.SbCsb;

public interface EquSbCsOpFac {
	public boolean checkCSno(String csdm);
	String addOrUpdateWzCsb(SbCsb sbcsb);
	public boolean updateWzCsStateChange(String uids,String flag);
}
