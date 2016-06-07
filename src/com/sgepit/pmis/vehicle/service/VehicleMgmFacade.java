package com.sgepit.pmis.vehicle.service;

import java.io.InputStream;

import com.sgepit.pcmis.common.hbm.PcBusniessBack;

public interface VehicleMgmFacade {
	
	/**获取某个表编号的最大值
	 * @param prefix:编号前缀
	 * @param col: 列名称
	 * @param table: 表名称
	 * @param lsh：最大的流水号（null，表示没有传入，需要从数据库中获取）
	 * @return
	 */
	public String getVehicleApplyNewBh(String prefix, String col, String table,Long lsh); 
	
	/**
	 * 根据业务类型，获取最新的数据导出word模板信息；
	 * @param businessType
	 * @return
	 */
	public InputStream getExcelTemplate(String businessType);
	/**
	 * 插入流转记录
	 * @param pcBusniessBack PcBusniessBack对象
	 */
	public String insertBuniessBack(PcBusniessBack pcBusniessBack);
}
