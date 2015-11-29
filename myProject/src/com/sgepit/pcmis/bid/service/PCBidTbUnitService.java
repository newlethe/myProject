package com.sgepit.pcmis.bid.service;

import java.util.List;

import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;

/**
 * 招标申请及预审结果service
 * @author Administrator
 *
 */
public interface PCBidTbUnitService {

	/**
	 * 获取已通过预审的单位列表
	 * @param bidContentId 招标内容id
	 * @return
	 */
	List<PcBidTbUnitInfo> getVeryfiedUnits(String bidContentId);
	/**
	 * 获取所有的单位列表
	 * @param bidContentId 招标内容id
	 * @return
	 */
	List<PcBidTbUnitInfo> getAllUnits(String bidContentId);	
}
