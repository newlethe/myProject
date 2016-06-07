package com.sgepit.pcmis.bid.service;

import java.util.List;

import com.sgepit.pcmis.bid.dao.PCBidDAO;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;

public class PCBidTbUnitServiceImpl implements PCBidTbUnitService{
	
	private PCBidDAO pcBidDAO;

	public PCBidDAO getPcBidDAO() {
		return pcBidDAO;
	}

	public void setPcBidDAO(PCBidDAO pcBidDAO) {
		this.pcBidDAO = pcBidDAO;
	}

	public List<PcBidTbUnitInfo> getVeryfiedUnits(String bidContentId) {
		String whereStr = String.format("contentUids = '%s' and preHearResult = '%s'", bidContentId, "1");
		List<PcBidTbUnitInfo> veryfiedUnitList = pcBidDAO.findByWhere(PcBidTbUnitInfo.class.getName(), whereStr, "tbUnit");
		return veryfiedUnitList;
	}
	public List<PcBidTbUnitInfo> getAllUnits(String bidContentId) {
		String whereStr = String.format("contentUids = '%s'", bidContentId);
		List<PcBidTbUnitInfo> veryfiedUnitList = pcBidDAO.findByWhere(PcBidTbUnitInfo.class.getName(), whereStr, "tbUnit");
		return veryfiedUnitList;
	}
}
