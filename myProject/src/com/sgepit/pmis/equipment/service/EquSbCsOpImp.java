package com.sgepit.pmis.equipment.service;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.SbCsb;

public class EquSbCsOpImp implements EquSbCsOpFac {
	private EquipmentDAO equipmentDAO;
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	/**
	 * zhangxb 检查供应商编码的唯一性 
	 */
	public boolean checkCSno(String csdm){
		List list = this.equipmentDAO.findByProperty("com.sgepit.pmis.equipment.hbm.SbCsb", "csdm", csdm);
		if(list.size()>0) return false;
		return true;
	}
	/**
	 * zhangxb 关于供应商信息添加修改
	 */
	public String addOrUpdateWzCsb(SbCsb sbcsb) {
		String flag = "0";
		try{
			if("".equals(sbcsb.getUids())||sbcsb.getUids()==null){//新增
				sbcsb.setIsused("1");//默认为启用
				this.equipmentDAO.insert(sbcsb);
				flag="1";
			}else{//修改
				//更新物资编码表
				this.equipmentDAO.saveOrUpdate(sbcsb);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	/**
	 * zhangxb 供应商 启用?禁用
	 */
	public boolean updateWzCsStateChange(String uids,String flag) {
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String [] uidsArr = uids.split(",");
		for(int i=0 ; i< uidsArr.length; i++){
			jdbc.update(" update sb_csb set isused='"+flag+"' where uids='"+uidsArr[i]+"' ");
		}
		return true;		
	}	
}
