package com.sgepit.pmis.equipment.service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquTkGoods;

public class EqutkgoodsMgmImpl extends BaseMgmImpl implements EqutkgoodsMgmFacade{
	
	private EquipmentDAO equipmentDAO;

	private String beanName = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_TK_GOODS;
	private String goodsSubBean = BusinessConstants.EQU_PACKAGE + BusinessConstants.EQU_DH;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static EqutkgoodsMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (EqutkgoodsMgmImpl) ctx.getBean("equTkGoodsMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	public void insertTkGoods(EquTkGoods equTkGoods){
		this.equipmentDAO.insert(equTkGoods);
	}
	
	public void updateTkGoods(EquTkGoods equTkGoods){
		this.equipmentDAO.saveOrUpdate(equTkGoods);
	}
	
	/**
	 * 删除到货记录时,判断下面是否有到货设备和到货部件
	 * @param ggid
	 * @return
	 */
	public String checkDelete(String ggid){
		String state = "";
		List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
		if (!list.isEmpty()) state = "该设备到货下有[到货部件]信息！是否删除！";
		return state;
	}
	
	/**
	 * 删除到货记录
	 * @param ggid
	 * @param type
	 */
	public void deleteTkGoods(String ggid, String type){
		if (!"".equals(type)){
			List list = this.equipmentDAO.findByProperty(goodsSubBean, "dhId", ggid);
			this.equipmentDAO.deleteAll(list);
		}
		EquTkGoods equTkGoods = (EquTkGoods)this.equipmentDAO.findById(beanName, ggid);
		this.equipmentDAO.delete(equTkGoods);
	}
	
	public List getGoodsSub(String ggid){
		String sql = "select gs.*, i.equ_name, p.part_name, p.part_num "
					+"from equ_get_goods_sub gs, equ_info i, equ_info_part p "
					+"where gs.equid = i.equid and gs.partid = p.partid and gs.ggid = '"+ggid+"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	public String initTkGoodsBh(String initBh){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select nvl(max(substr(gg_no,-3)),0)+1 from equ_get_goods where gg_no like '"+ initBh +"%'";
		String bhGet = (String) jdbc.queryForObject(sql, String.class);
		NumberFormat format = NumberFormat.getNumberInstance(Locale.getDefault());
		format.setMinimumIntegerDigits(3);
		return initBh.concat(format.format(Integer.valueOf(bhGet)));
	}
	
	public boolean checkBhExist(String bh){
		String sql = "select * from equ_get_goods where gg_no = '"+ bh +"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		if(list.size()==0)return true;
		return false;
	}
	
}
