package com.sgepit.frame.xgridTemplet.service;

import java.util.List;

import com.sgepit.frame.xgridTemplet.hbm.SgprjTempletConfig;

public interface SgprjTempletConfigService {
	
	/**
	 * 查询出所有的XGRID模板信息
	 * @author Zhw 2011-09-01
	 * @param beanName
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @return
	 */
	public List<SgprjTempletConfig> findorderby(String beanName,
			String orderBy, Integer start, Integer limit);
	
	/**
	 * 更新xgrid模板信息
	 * @author Zhw 2011-09-01
	 * @param sgprjTempletConfig
	 * @return
	 */
	public void updateSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig);
	
	/**
	 * 新增xgrid模板信息
	 * @author Zhw 2011-09-01
	 * @param sgprjTempletConfig
	 * @return
	 */
	public void insertSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig);
	
	/**
	 * 删除xgrid模板信息
	 * @author Zhw 2011-09-01
	 * @param sgprjTempletConfig
	 * @return
	 */
	public void deleteSgprjTempletConfig(SgprjTempletConfig sgprjTempletConfig);
	
	/**
	 * 查询xgrid头文件
	 * @author Zhw 2011-09-01
	 * @param templetSn
	 * @return
	 */
	public String getXgridHeader(String templetSn);
}
