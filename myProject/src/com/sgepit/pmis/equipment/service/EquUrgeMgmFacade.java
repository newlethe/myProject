package com.sgepit.pmis.equipment.service;

import java.util.List;

public interface EquUrgeMgmFacade {
	public List equUrge(String inWhere);
	public List selectEquUrge(String beginDate, String endDate);
}
