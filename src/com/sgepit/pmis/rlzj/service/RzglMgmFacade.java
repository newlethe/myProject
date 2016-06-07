package com.sgepit.pmis.rlzj.service;

import java.util.List;
import java.util.Map;

public interface RzglMgmFacade{
	//shuz
	/**
	 * excel数据导入
	 * @param uids
	 * @param beanName
	 * @param fileItem
	 * @author shuz
	 */
	public String importData(String beanName, List<Map<String, String>> list,String pid);
	//qiupy
	/**
	 * 当前模块是否包含流程
	 */
	public String containsFlow(String unitId,String modId);
}
