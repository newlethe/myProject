/**
 * 
 */
package com.sgepit.pmis.weekworkmanagement.service;

import com.sgepit.pmis.weekworkmanagement.hbm.WeekworkManagementM;

/**
 * @author qiupy 2013-5-3 
 *
 */
public interface WeekWorkManagementService {

	public String getUuidValue();
	public String getWeekPeriod();
	public WeekworkManagementM getCurrentWeekPeriod(String pid,String professional);
	public WeekworkManagementM getLastWeekPeriod(String pid,String professional,String currentWeekPeriod);
}
